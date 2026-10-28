import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { AppError } from "../utils/http-error.js";
import { sendError } from "../utils/response.js";

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, 404, "NOT_FOUND", `Route not found: ${req.method} ${req.path}`);
}

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (res.headersSent) return;

  if (error instanceof AppError) {
    sendError(res, error.status, error.code, error.message, error.details);
    return;
  }

  if (error instanceof ZodError) {
    sendError(
      res,
      422,
      "VALIDATION_ERROR",
      "Please correct the highlighted fields",
      error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }))
    );
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    sendError(
      res,
      422,
      "VALIDATION_ERROR",
      "The submitted data is invalid",
      Object.values(error.errors).map((entry) => ({
        path: entry.path,
        message: entry.message,
      }))
    );
    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    sendError(res, 400, "INVALID_ID", "Invalid identifier");
    return;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: number }).code === 11000
  ) {
    sendError(
      res,
      409,
      "DUPLICATE",
      "A record with these unique details already exists"
    );
    return;
  }

  if (error instanceof SyntaxError && "body" in error) {
    sendError(res, 400, "INVALID_JSON", "Request body contains invalid JSON");
    return;
  }

  logger.error(
    {
      err: error,
      requestId: (req as Request & { id?: string }).id,
      method: req.method,
      path: req.path,
    },
    "Unhandled request error"
  );

  sendError(
    res,
    500,
    "INTERNAL_ERROR",
    env.isProduction
      ? "An unexpected error occurred. Please try again."
      : error instanceof Error
        ? error.message
        : "An unexpected error occurred"
  );
};
