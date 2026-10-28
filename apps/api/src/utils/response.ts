import type { Response } from "express";
import type { PaginationMeta } from "@vraunix/shared";

export function sendData<T>(
  res: Response,
  data: T,
  status = 200,
  meta?: PaginationMeta
): void {
  res.status(status).json({
    success: true,
    data,
    ...(meta ? { meta } : {}),
  });
}

export function sendError(
  res: Response,
  status: number,
  code: string,
  message: string,
  details?: unknown
): void {
  res.status(status).json({
    success: false,
    error: {
      code,
      message,
      ...(details === undefined ? {} : { details }),
    },
  });
}
