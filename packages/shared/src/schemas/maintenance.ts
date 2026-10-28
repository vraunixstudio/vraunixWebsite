import { z } from "zod";
import { CURRENCY_CODES, DEFAULT_CURRENCY } from "../constants/currency.js";
import {
  MAINTENANCE_FREQUENCIES,
  MAINTENANCE_SERVICE_STATUSES,
} from "../constants/status.js";
import {
  decimalString,
  objectIdSchema,
  optionalDateString,
  optionalText,
  optionalUrlSchema,
  requiredText,
} from "./common.js";

export const MAINTENANCE_TASK_STATUSES = [
  "pending",
  "in_progress",
  "completed",
  "skipped",
] as const;

export const maintenanceTaskSchema = z.object({
  title: requiredText(1, 300),
  dueDate: optionalDateString,
  status: z.enum(MAINTENANCE_TASK_STATUSES).optional().default("pending"),
  notes: optionalText(2000),
});

export const maintenanceCreateSchema = z.object({
  clientId: objectIdSchema,
  projectId: objectIdSchema.optional(),
  websiteUrl: optionalUrlSchema,
  planName: requiredText(2, 160),
  coveredServices: z
    .array(z.string().trim().min(1).max(300))
    .max(50)
    .default([]),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  endDate: optionalDateString,
  billingFrequency: z.enum(MAINTENANCE_FREQUENCIES),
  price: decimalString,
  currency: z.enum(CURRENCY_CODES).default(DEFAULT_CURRENCY),
  nextBillingDate: optionalDateString,
  renewalReminderDays: z.coerce.number().int().min(0).max(365).optional().default(14),
  supportScope: optionalText(3000),
  serviceStatus: z.enum(MAINTENANCE_SERVICE_STATUSES).optional().default("active"),
  scheduledTasks: z.array(maintenanceTaskSchema).max(100).default([]),
  notes: optionalText(3000),
});

export const maintenanceUpdateSchema = maintenanceCreateSchema.partial().omit({
  clientId: true,
});

export const maintenanceTaskUpdateSchema = z.object({
  taskId: objectIdSchema,
  status: z.enum(MAINTENANCE_TASK_STATUSES),
  notes: optionalText(2000),
});

export const maintenanceBillingRunSchema = z.object({
  asOf: optionalDateString,
  maintenanceId: objectIdSchema.optional(),
});

export type MaintenanceCreateInput = z.infer<typeof maintenanceCreateSchema>;
