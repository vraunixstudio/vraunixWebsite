export class AppError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static badRequest(message: string, details?: unknown) {
    return new AppError(400, "BAD_REQUEST", message, details);
  }

  static unauthorized(message = "Authentication required") {
    return new AppError(401, "UNAUTHORIZED", message);
  }

  static forbidden(message = "You do not have permission to perform this action") {
    return new AppError(403, "FORBIDDEN", message);
  }

  static notFound(message = "Resource not found") {
    return new AppError(404, "NOT_FOUND", message);
  }

  static conflict(message: string, details?: unknown) {
    return new AppError(409, "CONFLICT", message, details);
  }

  static unprocessable(message: string, details?: unknown) {
    return new AppError(422, "VALIDATION_ERROR", message, details);
  }

  static tooManyRequests(message = "Too many requests. Please try again later.") {
    return new AppError(429, "RATE_LIMITED", message);
  }

  static internal(message = "An unexpected error occurred") {
    return new AppError(500, "INTERNAL_ERROR", message);
  }
}
