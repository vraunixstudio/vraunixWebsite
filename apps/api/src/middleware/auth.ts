import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { findSessionUser } from "../services/auth.service.js";
import { AppError } from "../utils/http-error.js";

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.cookies?.[env.SESSION_COOKIE_NAME] as string | undefined;
    if (!token) throw AppError.unauthorized();
    const context = await findSessionUser(token);
    if (!context) throw AppError.unauthorized("Your session has expired");
    req.auth = context;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.auth) {
    next(AppError.unauthorized());
    return;
  }
  if (req.auth.user.role !== "admin") {
    next(AppError.forbidden("Administrator access is required"));
    return;
  }
  next();
}

export function requireRole(...roles: Array<"admin">) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth) {
      next(AppError.unauthorized());
      return;
    }
    if (!roles.includes(req.auth.user.role)) {
      next(AppError.forbidden());
      return;
    }
    next();
  };
}
