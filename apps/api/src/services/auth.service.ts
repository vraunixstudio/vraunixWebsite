import type { Request, Response } from "express";
import {
  normalizeEmail,
  passwordSchema,
  type SessionUser,
} from "@vraunix/shared";
import { env } from "../config/env.js";
import { Session } from "../database/models/session.js";
import { User, type UserDocument } from "../database/models/user.js";
import { AppError } from "../utils/http-error.js";
import {
  generateToken,
  hashIp,
  safeEqual,
  sha256,
  verifyCsrfToken,
} from "../utils/crypto.js";
import { logger } from "../utils/logger.js";
import { hashPassword, verifyPassword } from "./password.service.js";
import { recordAudit } from "./audit.service.js";
import { sendNewEnquiryNotification } from "./notification.service.js";
import { getSettings } from "./settings.service.js";

const CSRF_COOKIE = "vx_csrf";

export type AuthContext = {
  user: UserDocument;
  session: {
    id: string;
    expiresAt: Date;
  };
};

function authUser(user: UserDocument): SessionUser {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function cookieBase() {
  return {
    secure: env.COOKIE_SECURE,
    sameSite: "lax" as const,
    path: "/",
  };
}

export function setSessionCookie(
  res: Response,
  token: string,
  expiresAt: Date
): void {
  res.cookie(env.SESSION_COOKIE_NAME, token, {
    ...cookieBase(),
    httpOnly: true,
    maxAge: Math.max(0, expiresAt.getTime() - Date.now()),
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(env.SESSION_COOKIE_NAME, { ...cookieBase(), httpOnly: true });
}

export function setCsrfCookie(res: Response, token: string): void {
  res.cookie(CSRF_COOKIE, token, {
    ...cookieBase(),
    httpOnly: false,
    maxAge: 2 * 60 * 60 * 1000,
  });
}

export function clearCsrfCookie(res: Response): void {
  res.clearCookie(CSRF_COOKIE, { ...cookieBase(), httpOnly: false });
}

export async function findSessionUser(token: string): Promise<AuthContext | null> {
  if (!token) return null;
  const session = await Session.findOne({
    tokenHash: sha256(token),
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });
  if (!session) return null;

  const user = await User.findById(session.userId);
  if (!user || !user.active) {
    if (session) {
      session.revokedAt = new Date();
      await session.save();
    }
    return null;
  }

  if (Date.now() - session.lastSeenAt.getTime() > 5 * 60 * 1000) {
    Session.updateOne(
      { _id: session._id },
      { $set: { lastSeenAt: new Date() } }
    ).catch((error) => logger.warn({ err: error }, "Session touch failed"));
  }

  return {
    user,
    session: { id: String(session._id), expiresAt: session.expiresAt },
  };
}

export async function login(
  email: string,
  password: string,
  meta: { ip?: string; userAgent?: string }
): Promise<{ user: UserDocument; token: string; expiresAt: Date }> {
  const normalized = normalizeEmail(email);
  const user = await User.findOne({ email: normalized }).select("+passwordHash");

  if (!user || !user.passwordHash) {
    await recordAudit({
      action: "auth.login_failed",
      entityType: "User",
      metadata: { email: normalized, reason: "invalid_credentials" },
    });
    throw AppError.unauthorized("Invalid email or password");
  }

  const passwordValid = await verifyPassword(password, user.passwordHash);
  if (!passwordValid) {
    await recordAudit({
      actor: { id: String(user._id), name: user.name, email: user.email },
      action: "auth.login_failed",
      entityType: "User",
      entityId: String(user._id),
      metadata: { reason: "invalid_credentials" },
    });
    throw AppError.unauthorized("Invalid email or password");
  }

  if (!user.active) {
    await recordAudit({
      actor: { id: String(user._id), name: user.name, email: user.email },
      action: "auth.login_inactive",
      entityType: "User",
      entityId: String(user._id),
    });
    throw new AppError(403, "ACCOUNT_INACTIVE", "This staff account is inactive");
  }

  const settings = await getSettings();
  const ttlHours = Math.min(
    72,
    Math.max(1, settings.security.sessionTtlHours || env.SESSION_TTL_HOURS)
  );
  const token = generateToken(32);
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);

  await Session.create({
    userId: user._id,
    tokenHash: sha256(token),
    expiresAt,
    ipHash: hashIp(meta.ip),
    userAgent: meta.userAgent?.slice(0, 500),
    lastSeenAt: new Date(),
  });

  user.lastLoginAt = new Date();
  await user.save();

  await recordAudit({
    actor: { id: String(user._id), name: user.name, email: user.email },
    action: "auth.login_succeeded",
    entityType: "User",
    entityId: String(user._id),
  });

  return { user, token, expiresAt };
}

export async function logout(sessionId: string, actor?: SessionUser): Promise<void> {
  await Session.updateOne(
    { _id: sessionId },
    { $set: { revokedAt: new Date() } }
  );
  if (actor) {
    await recordAudit({
      actor,
      action: "auth.logout",
      entityType: "Session",
      entityId: sessionId,
    });
  }
}

export function serializeUser(user: UserDocument): SessionUser {
  return authUser(user);
}

export async function changePassword(
  userId: string,
  currentSessionId: string,
  currentPassword: string,
  newPassword: string,
  req?: Request
): Promise<void> {
  passwordSchema.parse(newPassword);
  const user = await User.findById(userId).select("+passwordHash");
  if (!user || !user.passwordHash) {
    throw AppError.notFound("Staff account not found");
  }
  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) throw AppError.badRequest("Your current password is incorrect");
  const sameAsCurrent = await verifyPassword(newPassword, user.passwordHash);
  if (sameAsCurrent) {
    throw AppError.badRequest("Choose a password that is different from your current password");
  }

  user.passwordHash = await hashPassword(newPassword);
  user.passwordChangedAt = new Date();
  await user.save();
  await Session.updateMany(
    { userId: user._id, revokedAt: null, _id: { $ne: currentSessionId } },
    { $set: { revokedAt: new Date() } }
  );

  await recordAudit({
    actor: authUser(user),
    action: "auth.password_changed",
    entityType: "User",
    entityId: String(user._id),
    req,
  });
}

export function assertSameOrigin(origin: string | undefined): void {
  if (!origin) return;
  const allowed = new Set([
    env.WEB_ORIGIN.replace(/\/$/, ""),
    env.PUBLIC_APP_URL.replace(/\/$/, ""),
  ]);
  if (!allowed.has(origin.replace(/\/$/, ""))) {
    throw AppError.forbidden("Origin is not allowed");
  }
}

export function csrfCookieName(): string {
  return CSRF_COOKIE;
}

export function validateCsrf(
  cookieToken: string | undefined,
  headerToken: string | undefined
): void {
  if (!cookieToken || !headerToken || !safeEqual(cookieToken, headerToken)) {
    throw new AppError(403, "CSRF_INVALID", "Invalid or missing CSRF token");
  }
  if (!verifyCsrfToken(cookieToken)) {
    throw new AppError(403, "CSRF_INVALID", "Invalid CSRF token");
  }
}

export async function notifyNewEnquiry(input: {
  reference: string;
  name: string;
  businessName?: string;
  source: string;
}): Promise<void> {
  try {
    const settings = await getSettings();
    const recipients = new Set<string>([settings.company.email]);
    const admins = await User.find({ role: "admin", active: true }).select("email");
    for (const admin of admins) recipients.add(admin.email);
    await Promise.all(
      [...recipients].map((to) =>
        sendNewEnquiryNotification({ to, ...input })
      )
    );
  } catch (error) {
    logger.error({ err: error }, "Failed to notify staff of new enquiry");
  }
}
