import type { z } from "zod";
import { AppError } from "../utils/http-error.js";

export function parseInput<TSchema extends z.ZodType>(
  schema: TSchema,
  data: unknown
): z.infer<TSchema> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw AppError.unprocessable(
      "Please correct the highlighted fields",
      result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }))
    );
  }
  return result.data;
}
