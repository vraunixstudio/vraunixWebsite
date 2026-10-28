import { z } from "zod";
import { CURRENCY_CODES, DEFAULT_CURRENCY } from "../constants/currency.js";
import {
  CHANGE_REQUEST_STATUSES,
  PROJECT_STATUSES,
} from "../constants/status.js";
import {
  objectIdSchema,
  optionalDateString,
  optionalText,
  requiredText,
} from "./common.js";

export const MILESTONE_STATUSES = [
  "pending",
  "in_progress",
  "completed",
] as const;

export const projectMilestoneSchema = z.object({
  name: requiredText(1, 200),
  description: optionalText(1000),
  dueDate: optionalDateString,
  status: z.enum(MILESTONE_STATUSES).optional().default("pending"),
});

export const testingItemSchema = z.object({
  label: requiredText(1, 300),
  passed: z.boolean().default(false),
  notes: optionalText(1000),
});

export const projectCreateSchema = z.object({
  name: requiredText(2, 200),
  clientId: objectIdSchema,
  leadId: objectIdSchema.optional(),
  proposalId: objectIdSchema.optional(),
  description: optionalText(5000),
  scopeSnapshot: optionalText(10000),
  deliverables: z.array(z.string().trim().min(1).max(300)).max(100).default([]),
  milestones: z.array(projectMilestoneSchema).max(50).default([]),
  price: z.string().optional(),
  currency: z.enum(CURRENCY_CODES).default(DEFAULT_CURRENCY),
  assignedTo: z.array(objectIdSchema).max(20).default([]),
  startDate: optionalDateString,
  targetDate: optionalDateString,
  testingChecklist: z.array(testingItemSchema).max(100).default([]),
});

export const projectUpdateSchema = projectCreateSchema.partial().omit({
  clientId: true,
  leadId: true,
});

export const projectStatusSchema = z.object({
  status: z.enum(PROJECT_STATUSES),
  note: optionalText(1000),
});

export const changeRequestCreateSchema = z.object({
  description: requiredText(5, 3000),
  costImpact: optionalText(160),
  timelineImpact: optionalText(160),
});

export const changeRequestDecisionSchema = z.object({
  status: z.enum(CHANGE_REQUEST_STATUSES),
  decisionNote: optionalText(2000),
});

export const deploymentSchema = z.object({
  url: optionalText(500),
  notes: optionalText(3000),
});

export const handoverSchema = z.object({
  notes: requiredText(1, 5000),
  completed: z.boolean().default(false),
});

export const projectFeedbackSchema = z.object({
  message: requiredText(1, 3000),
  source: z.enum(["client", "staff"]).default("client"),
});

export const milestoneUpdateSchema = z.object({
  milestoneId: objectIdSchema,
  status: z.enum(MILESTONE_STATUSES),
});

export const testingItemUpdateSchema = z.object({
  index: z.coerce.number().int().min(0),
  passed: z.boolean(),
  notes: optionalText(1000),
});

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectMilestoneInput = z.infer<typeof projectMilestoneSchema>;
