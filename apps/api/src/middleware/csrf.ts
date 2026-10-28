import type { NextFunction, Request, Response } from "express";
import {
  assertSameOrigin,
  csrfCookieName,
  validateCsrf,
} from "../services/auth.service.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function csrfProtection(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (SAFE_METHODS.has(req.method)) {
    next();
    return;
  }
  try {
    assertSameOrigin(req.headers.origin);
    const cookieToken = req.cookies?.[csrfCookieName()] as string | undefined;
    const headerToken =
      (req.headers["x-csrf-token"] as string | undefined) ??
      (req.headers["x-xsrf-token"] as string | undefined);
    validateCsrf(cookieToken, headerToken);
    next();
  } catch (error) {
    next(error);
  }
}
