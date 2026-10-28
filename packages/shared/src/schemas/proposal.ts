import { z } from "zod";
import { CURRENCY_CODES, DEFAULT_CURRENCY } from "../constants/currency.js";
import { PROPOSAL_STATUSES } from "../constants/status.js";
import {
  decimalString,
  objectIdSchema,
  optionalText,
  positiveDecimalString,
  requiredText,
} from "./common.js";

export const proposalLineItemSchema = z.object({
  description: requiredText(1, 300),
  quantity: positiveDecimalString,
  unitPrice: decimalString,
});

export const proposalDiscountSchema = z
  .object({
    type: z.enum(["fixed", "percent"]),
    value: decimalString,
  })
  .optional();

export const proposalPricingSchema = z.object({
  currency: z.enum(CURRENCY_CODES).default(DEFAULT_CURRENCY),
  lineItems: z.array(proposalLineItemSchema).min(1).max(100),
  discount: proposalDiscountSchema,
  taxRatePercent: decimalString.default("0"),
});

export const proposalMilestoneSchema = z.object({
  label: requiredText(1, 160),
  percentage: decimalString,
  timing: optionalText(160),
});

export const proposalContentSchema = z.object({
  title: requiredText(1, 200),
  overview: optionalText(5000),
  objectives: z.array(z.string().trim().min(1).max(500)).max(30).default([]),
  scope: z
    .object({
      summary: optionalText(5000),
      included: z.array(z.string().trim().min(1).max(300)).max(100).default([]),
      excluded: z.array(z.string().trim().min(1).max(300)).max(100).default([]),
      pages: z.array(z.string().trim().min(1).max(300)).max(200).default([]),
      features: z.array(z.string().trim().min(1).max(300)).max(100).default([]),
      deliverables: z.array(z.string().trim().min(1).max(300)).max(100).default([]),
      revisions: optionalText(2000),
      milestones: z
        .array(
          z.object({
            name: requiredText(1, 200),
            description: optionalText(1000),
            timing: optionalText(200),
          })
        )
        .max(30)
        .default([]),
      dependencies: optionalText(2000),
    })
    .optional(),
  timeline: optionalText(3000),
  terms: optionalText(10000),
  maintenance: optionalText(3000),
  technologies: z.array(z.string().trim().min(1).max(120)).max(40).default([]),
  paymentMilestones: z.array(proposalMilestoneSchema).max(12).default([]),
});

export const proposalCreateSchema = z
  .object({
    type: z.enum(["company", "client"]).default("client"),
    title: requiredText(1, 200),
    leadId: objectIdSchema.optional(),
    clientId: objectIdSchema.optional(),
    projectId: objectIdSchema.optional(),
    content: proposalContentSchema.optional(),
    pricing: proposalPricingSchema.optional(),
  })
  .superRefine((value, ctx) => {
    if (value.type === "company") {
      if (value.leadId || value.clientId || value.projectId) {
        ctx.addIssue({
          code: "custom",
          message: "A global company proposal cannot reference a client, lead, or project",
          path: ["type"],
        });
      }
      if (value.pricing) {
        ctx.addIssue({
          code: "custom",
          message: "A global company proposal cannot include project-specific pricing",
          path: ["pricing"],
        });
      }
    } else {
      if (!value.leadId && !value.clientId) {
        ctx.addIssue({
          code: "custom",
          message: "A client proposal must be linked to a lead or client",
          path: ["clientId"],
        });
      }
      if (!value.pricing) {
        ctx.addIssue({
          code: "custom",
          message: "Client proposals require pricing",
          path: ["pricing"],
        });
      }
    }
  });

export const proposalUpdateSchema = z.object({
  title: optionalText(200),
  content: proposalContentSchema.optional(),
  pricing: proposalPricingSchema.optional(),
});

export const proposalAcceptanceSchema = z.object({
  acceptedByName: requiredText(2, 160),
  method: z.enum(["written_confirmation", "typed_acceptance", "initial_payment"]),
  note: optionalText(2000),
});

export const proposalDeclineSchema = z.object({
  reason: optionalText(2000),
});

export const proposalListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: optionalText(200),
  status: z.enum(PROPOSAL_STATUSES).optional(),
  type: z.enum(["company", "client"]).optional(),
  clientId: objectIdSchema.optional(),
});

export type ProposalContentInput = z.infer<typeof proposalContentSchema>;
export type ProposalCreateInput = z.infer<typeof proposalCreateSchema>;
export type ProposalPricingInput = z.infer<typeof proposalPricingSchema>;
