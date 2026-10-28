import { z } from "zod";
import {
  TICKET_PRIORITIES,
  TICKET_STATUSES,
} from "../constants/status.js";
import {
  objectIdSchema,
  optionalText,
  requiredText,
} from "./common.js";

export const ticketCreateSchema = z.object({
  clientId: objectIdSchema,
  projectId: objectIdSchema.optional(),
  maintenanceId: objectIdSchema.optional(),
  title: requiredText(3, 200),
  description: requiredText(5, 5000),
  priority: z.enum(TICKET_PRIORITIES).default("normal"),
  assignedTo: objectIdSchema.nullable().optional(),
});

export const ticketUpdateSchema = z.object({
  title: requiredText(3, 200).optional(),
  description: requiredText(5, 5000).optional(),
  priority: z.enum(TICKET_PRIORITIES).optional(),
  assignedTo: objectIdSchema.nullable().optional(),
});

export const ticketStatusSchema = z.object({
  status: z.enum(TICKET_STATUSES),
  resolution: optionalText(5000),
});

export const ticketActivitySchema = z.object({
  message: requiredText(1, 3000),
  kind: z.enum(["update", "work_log", "client_reply", "resolution"]).default("update"),
  minutesSpent: z.coerce.number().int().min(0).max(10000).optional(),
  followUpRequired: z.boolean().optional().default(false),
});

export type TicketCreateInput = z.infer<typeof ticketCreateSchema>;
