import { z } from "zod";
import {
  emailSchema,
  optionalText,
  optionalUrlSchema,
  requiredText,
} from "./common.js";

export const clientCreateSchema = z.object({
  name: requiredText(2, 160, "Enter the client or organization name"),
  contactName: optionalText(120),
  email: emailSchema,
  phone: optionalText(40),
  website: optionalUrlSchema,
  address: optionalText(500),
  country: optionalText(80),
  taxId: optionalText(80),
  billingName: optionalText(160),
  billingEmail: emailSchema.optional(),
  billingAddress: optionalText(500),
  notes: optionalText(5000),
  sourceLeadId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
});

export const clientUpdateSchema = clientCreateSchema.partial().omit({
  sourceLeadId: true,
});

export type ClientCreateInput = z.infer<typeof clientCreateSchema>;
export type ClientUpdateInput = z.infer<typeof clientUpdateSchema>;
