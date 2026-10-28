import { Router } from "express";
import {
  changePasswordSchema,
  loginSchema,
} from "@vraunix/shared";
import { authenticate } from "../middleware/auth.js";
import { parseInput } from "../middleware/validate.js";
import { loginLimiter } from "../middleware/rate-limit.js";
import {
  changePassword,
  clearCsrfCookie,
  clearSessionCookie,
  login,
  logout,
  serializeUser,
  setCsrfCookie,
  setSessionCookie,
} from "../services/auth.service.js";
import { createCsrfToken } from "../utils/crypto.js";
import { sendData } from "../utils/response.js";
import { actorFrom, sessionIdFrom } from "./helpers.js";

export const authRouter = Router();

authRouter.get("/csrf", (_req, res) => {
  const token = createCsrfToken();
  setCsrfCookie(res, token);
  sendData(res, { csrfToken: token });
});

authRouter.post("/login", loginLimiter, async (req, res) => {
  const input = parseInput(loginSchema, req.body);
  const result = await login(input.email, input.password, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  setSessionCookie(res, result.token, result.expiresAt);
  setCsrfCookie(res, createCsrfToken());
  sendData(res, {
    user: serializeUser(result.user),
    session: { expiresAt: result.expiresAt.toISOString() },
  });
});

authRouter.use(authenticate);

authRouter.get("/session", (req, res) => {
  if (!req.auth) return;
  sendData(res, {
    user: serializeUser(req.auth.user),
    session: { expiresAt: req.auth.session.expiresAt.toISOString() },
  });
});

authRouter.post("/logout", async (req, res) => {
  const actor = actorFrom(req);
  await logout(sessionIdFrom(req), actor);
  clearSessionCookie(res);
  clearCsrfCookie(res);
  sendData(res, { loggedOut: true });
});

authRouter.post("/change-password", async (req, res) => {
  const input = parseInput(changePasswordSchema, req.body);
  const actor = actorFrom(req);
  await changePassword(
    actor.id,
    sessionIdFrom(req),
    input.currentPassword,
    input.newPassword,
    req
  );
  sendData(res, { changed: true });
});
