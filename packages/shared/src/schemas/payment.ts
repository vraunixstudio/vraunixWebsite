import { z } from "zod";
import { PAYMENT_METHODS } from "../constants/status.js";
import {
  objectIdSchema,
  optionalDateString,
  optionalText,
  positiveDecimalString,
  requiredText,
} from "./common.js";

export const paymentCreateSchema = z.object({
  invoiceId: objectIdSchema,
  amount: positiveDecimalString,
  method: z.enum(PAYMENT_METHODS),
  reference: optionalText(200),
  receivedAt: optionalDateString,
  notes: optionalText(2000),
  idempotencyKey: optionalText(120),
});

export const paymentRejectSchema = z.object({
  reason: requiredText(5, 2000, "Provide a reason"),
});

export const paymentReverseSchema = z.object({
  reason: requiredText(5, 2000, "Provide a reason"),
});

export const paymentListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: optionalText(200),
  status: optionalText(30),
  invoiceId: optionalText(30),
});
