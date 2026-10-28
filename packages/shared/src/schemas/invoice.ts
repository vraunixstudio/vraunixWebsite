import { z } from "zod";
import { CURRENCY_CODES, DEFAULT_CURRENCY } from "../constants/currency.js";
import { INVOICE_STATUSES } from "../constants/status.js";
import {
  decimalString,
  objectIdSchema,
  optionalDateString,
  optionalText,
  positiveDecimalString,
  requiredText,
} from "./common.js";

export const invoiceLineItemSchema = z.object({
  description: requiredText(1, 300),
  quantity: positiveDecimalString,
  unitPrice: decimalString,
});

export const invoiceCreateSchema = z.object({
  clientId: objectIdSchema,
  projectId: objectIdSchema.optional(),
  proposalId: objectIdSchema.optional(),
  maintenanceId: objectIdSchema.optional(),
  currency: z.enum(CURRENCY_CODES).default(DEFAULT_CURRENCY),
  issueDate: optionalDateString,
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  lineItems: z.array(invoiceLineItemSchema).min(1).max(100),
  discount: z
    .object({
      type: z.enum(["fixed", "percent"]),
      value: decimalString,
    })
    .optional(),
  taxRatePercent: decimalString.default("0"),
  billingMilestone: optionalText(200),
  notes: optionalText(3000),
  terms: optionalText(5000),
});

export const invoiceUpdateSchema = invoiceCreateSchema.partial().omit({
  maintenanceId: true,
});

export const invoiceVoidSchema = z.object({
  reason: requiredText(5, 2000, "Provide a reason for voiding this invoice"),
});

export const invoiceListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: optionalText(200),
  status: z.enum(INVOICE_STATUSES).optional(),
  clientId: objectIdSchema.optional(),
  from: optionalDateString,
  to: optionalDateString,
});

export type InvoiceCreateInput = z.infer<typeof invoiceCreateSchema>;
