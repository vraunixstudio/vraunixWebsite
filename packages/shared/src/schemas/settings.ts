import { z } from "zod";
import { CURRENCY_CODES, DEFAULT_CURRENCY } from "../constants/currency.js";
import { MAINTENANCE_FREQUENCIES } from "../constants/status.js";
import {
  decimalString,
  emailSchema,
  optionalText,
  requiredText,
} from "./common.js";

const percentage = decimalString.refine(
  (value) => Number(value) >= 0 && Number(value) <= 100,
  "Enter a percentage between 0 and 100"
);

export const maintenancePlanSchema = z.object({
  name: requiredText(2, 120),
  description: optionalText(1000),
  price: decimalString,
  currency: z.enum(CURRENCY_CODES).default(DEFAULT_CURRENCY),
  frequency: z.enum(MAINTENANCE_FREQUENCIES),
  features: z.array(z.string().trim().min(1).max(300)).max(40).default([]),
});

export const companySettingsSchema = z.object({
  name: requiredText(1, 160),
  slogan: requiredText(1, 240),
  description: requiredText(10, 3000),
  email: emailSchema,
  phone: optionalText(60),
  location: optionalText(200),
  website: optionalText(300),
  legalName: optionalText(200),
});

export const brandingSettingsSchema = z.object({
  documentFooter: optionalText(1000),
  primaryContactName: optionalText(120),
  primaryContactTitle: optionalText(120),
});

export const invoiceSettingsSchema = z.object({
  prefix: z
    .string()
    .trim()
    .min(2)
    .max(20)
    .regex(/^[A-Z0-9-]+$/, "Use uppercase letters, numbers, and hyphens"),
  dueDays: z.coerce.number().int().min(0).max(365),
  paymentTerms: optionalText(5000),
  footerNote: optionalText(1000),
});

export const proposalSettingsSchema = z.object({
  prefix: z
    .string()
    .trim()
    .min(2)
    .max(20)
    .regex(/^[A-Z0-9-]+$/, "Use uppercase letters, numbers, and hyphens"),
  validityDays: z.coerce.number().int().min(1).max(365),
  defaultTerms: optionalText(10000),
  nextSteps: optionalText(3000),
});

export const emailSettingsSchema = z.object({
  fromName: optionalText(120),
  fromEmail: emailSchema,
  replyTo: emailSchema.optional(),
});

export const discoverySettingsSchema = z.object({
  budgetRanges: z.array(z.string().trim().min(1).max(120)).min(1).max(30),
  timelines: z.array(z.string().trim().min(1).max(120)).min(1).max(30),
  currencies: z.array(z.enum(CURRENCY_CODES)).min(1).max(30),
});

export const securitySettingsSchema = z.object({
  sessionTtlHours: z.coerce.number().int().min(1).max(72),
  allowMarketerPaymentRecording: z.boolean(),
});

export const settingsUpdateSchema = z.object({
  company: companySettingsSchema.optional(),
  branding: brandingSettingsSchema.optional(),
  currency: z.object({ default: z.enum(CURRENCY_CODES) }).optional(),
  tax: z
    .object({
      defaultRatePercent: percentage,
      label: requiredText(1, 80),
    })
    .optional(),
  invoice: invoiceSettingsSchema.optional(),
  proposal: proposalSettingsSchema.optional(),
  email: emailSettingsSchema.optional(),
  discovery: discoverySettingsSchema.optional(),
  security: securitySettingsSchema.optional(),
  maintenancePlans: z.array(maintenancePlanSchema).max(20).optional(),
});

export const serviceUpdateSchema = z.object({
  title: requiredText(2, 160).optional(),
  tagline: optionalText(300),
  summary: optionalText(1000),
  description: z.array(z.string().trim().min(1).max(3000)).max(20).optional(),
  benefits: z.array(z.string().trim().min(1).max(500)).max(40).optional(),
  deliverables: z.array(z.string().trim().min(1).max(500)).max(40).optional(),
  active: z.boolean().optional(),
  order: z.coerce.number().int().min(0).max(999).optional(),
  startingFromMinor: z.coerce.number().int().min(0).optional(),
});

export const documentGenerateSchema = z
  .object({
    type: z.enum([
      "company_proposal",
      "project_proposal",
      "scope_of_work",
      "agreement",
      "invoice",
      "receipt",
      "handover_report",
      "maintenance_agreement",
      "maintenance_report",
    ]),
    proposalId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
    invoiceId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
    paymentId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
    projectId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
    maintenanceId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  })
  .superRefine((value, ctx) => {
    const require = (field: "proposalId" | "invoiceId" | "paymentId" | "projectId" | "maintenanceId") => {
      if (!value[field]) {
        ctx.addIssue({
          code: "custom",
          message: `${field} is required for ${value.type}`,
          path: [field],
        });
      }
    };
    switch (value.type) {
      case "company_proposal":
        break;
      case "project_proposal":
      case "scope_of_work":
      case "agreement":
        require("proposalId");
        break;
      case "invoice":
        require("invoiceId");
        break;
      case "receipt":
        require("paymentId");
        break;
      case "handover_report":
        require("projectId");
        break;
      case "maintenance_agreement":
      case "maintenance_report":
        require("maintenanceId");
        break;
    }
  });

export const templateUpdateSchema = z.object({
  title: requiredText(1, 200),
  content: requiredText(10, 50000),
});

export type SettingsUpdateInput = z.infer<typeof settingsUpdateSchema>;
