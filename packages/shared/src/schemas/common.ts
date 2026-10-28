import { z } from "zod";

export const OBJECT_ID_RE = /^[a-f\d]{24}$/i;
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const DECIMAL_RE = /^\d+(\.\d{1,4})?$/;

export const objectIdSchema = z
  .string()
  .regex(OBJECT_ID_RE, "Invalid identifier");

export const emailSchema = z
  .string()
  .trim()
  .min(3)
  .max(254)
  .email("Enter a valid email address")
  .transform((value) => value.toLowerCase());

export const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .max(128, "Password is too long")
  .regex(/[A-Za-z]/, "Password must include a letter")
  .regex(/[0-9]/, "Password must include a number");

export const optionalText = (max: number) =>
  z.preprocess(
    (value) =>
      value === "" || value === null || value === undefined
        ? undefined
        : value,
    z.string().trim().max(max).optional()
  );

export const requiredText = (min: number, max: number, message?: string) =>
  z.string().trim().min(min, message).max(max);

export const optionalDateString = z.preprocess(
  (value) =>
    value === "" || value === null || value === undefined ? undefined : value,
  z.string().regex(DATE_RE, "Use YYYY-MM-DD date format").optional()
);

export const optionalDateTimeString = z.preprocess(
  (value) =>
    value === "" || value === null || value === undefined ? undefined : value,
  z.string().datetime({ offset: true }).optional()
);

export const decimalString = z
  .union([z.string(), z.number()])
  .transform((value) => String(value).trim())
  .refine((value) => DECIMAL_RE.test(value), "Use a valid decimal number")
  .refine((value) => Number(value) <= 1_000_000_000, "Value is too large");

export const positiveDecimalString = decimalString.refine(
  (value) => Number(value) > 0,
  "Enter a value greater than zero"
);

export const optionalUrlSchema = z.preprocess(
  (value) =>
    value === "" || value === null || value === undefined ? undefined : value,
  z
    .string()
    .trim()
    .max(500)
    .refine(
      (value) => /^https?:\/\/[^\s]+$/i.test(value),
      "Enter a full URL beginning with http:// or https://"
    )
    .optional()
);

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(100000).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: optionalText(200),
  status: optionalText(60),
  sort: optionalText(60),
  assignedTo: optionalText(60),
  from: optionalDateString,
  to: optionalDateString,
});

export type ListQuery = z.infer<typeof listQuerySchema>;

export const idParamSchema = z.object({ id: objectIdSchema });

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
