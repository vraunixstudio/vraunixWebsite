import { z } from "zod";
import {
  CONTACT_METHOD_OPTIONS,
  PRIORITY_OPTIONS,
  PROJECT_TYPE_OPTIONS,
} from "../constants/discovery.js";
import {
  emailSchema,
  objectIdSchema,
  optionalDateString,
  optionalText,
  optionalUrlSchema,
  requiredText,
} from "./common.js";
import { LEAD_STATUSES } from "../constants/status.js";

export const discoverySubmissionSchema = z.object({
  contact: z.object({
    fullName: requiredText(2, 120, "Enter your full name"),
    businessName: optionalText(160),
    email: emailSchema,
    phone: optionalText(40),
    country: optionalText(80),
    existingWebsite: optionalUrlSchema,
  }),
  projectTypes: z
    .array(z.enum(PROJECT_TYPE_OPTIONS))
    .min(1, "Select at least one project type")
    .max(PROJECT_TYPE_OPTIONS.length),
  goals: z.object({
    businessDescription: requiredText(
      20,
      3000,
      "Describe your business in at least 20 characters"
    ),
    websitePurpose: requiredText(10, 2000, "Describe the website purpose"),
    targetAudience: requiredText(5, 1000, "Describe your target audience"),
    challenges: optionalText(2000),
    desiredOutcomes: requiredText(10, 2000, "Describe the desired outcomes"),
    existingProblems: optionalText(2000),
  }),
  requirements: z.object({
    websiteType: optionalText(160),
    expectedPages: optionalText(500),
    designStyle: optionalText(160),
    referenceWebsites: optionalText(1000),
    requiredFeatures: z.array(z.string().trim().min(1).max(160)).max(30).default([]),
    cmsNeeds: optionalText(1000),
    mobileRequirements: optionalText(1000),
    integrations: z.array(z.string().trim().min(1).max(160)).max(30).default([]),
    seoNeeds: optionalText(1000),
    domainHostingNeeds: optionalText(1000),
  }),
  budget: z.object({
    range: requiredText(1, 120, "Select a budget range"),
    currency: optionalText(10),
    notes: optionalText(1000),
  }),
  timeline: z.object({
    launchTimeframe: requiredText(1, 120, "Select a desired launch timeframe"),
    priority: z.enum(PRIORITY_OPTIONS),
    contentReadiness: optionalText(160),
  }),
  maintenance: z.object({
    needed: z.boolean().default(false),
    updateFrequency: optionalText(120),
    backupMonitoring: optionalText(1000),
    supportPreference: optionalText(200),
    specialRequirements: optionalText(1000),
  }),
  additional: z.object({
    comments: optionalText(3000),
    preferredContactMethod: z.enum(CONTACT_METHOD_OPTIONS),
    privacyConsent: z.literal(true, {
      message: "Please acknowledge the privacy notice",
    }),
    contactConsent: z.literal(true, {
      message: "Please consent to being contacted about your enquiry",
    }),
  }),
  honeypot: z.string().max(200).optional(),
});

export type DiscoverySubmission = z.infer<typeof discoverySubmissionSchema>;

export const contactSubmissionSchema = z.object({
  name: requiredText(2, 120, "Enter your name"),
  businessName: optionalText(160),
  email: emailSchema,
  phone: optionalText(40),
  serviceInterest: optionalText(160),
  message: requiredText(10, 5000, "Enter a message of at least 10 characters"),
  privacyConsent: z.literal(true, {
    message: "Please acknowledge the privacy notice",
  }),
  honeypot: z.string().max(200).optional(),
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

export const leadNoteSchema = z.object({
  message: requiredText(1, 5000),
  kind: z.enum(["note", "contact", "internal"]).optional().default("note"),
});

export const leadUpdateSchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  assignedTo: z.string().nullable().optional(),
  reviewed: z
    .object({
      contact: z
        .object({
          fullName: requiredText(2, 120).optional(),
          businessName: optionalText(160),
          email: emailSchema.optional(),
          phone: optionalText(40),
          country: optionalText(80),
          existingWebsite: optionalUrlSchema,
        })
        .optional(),
      notes: optionalText(5000),
      requirementsSummary: optionalText(5000),
      budgetRange: optionalText(120),
      currency: optionalText(10),
      desiredTimeline: optionalText(120),
    })
    .optional(),
});

export const leadStatusSchema = z.object({
  status: z.enum(LEAD_STATUSES),
});

export const convertLeadSchema = z.object({
  mode: z.enum(["new", "link"]).default("new"),
  clientId: objectIdSchema.optional(),
  clientName: optionalText(160),
  billingEmail: emailSchema.optional(),
});

export const linkLeadSchema = z.object({
  clientId: objectIdSchema,
});

export const leadAssignmentSchema = z.object({
  assignedTo: z.string().nullable(),
});

export const leadTimelineQuerySchema = z.object({
  from: optionalDateString,
  to: optionalDateString,
});

export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;
export type ConvertLeadInput = z.infer<typeof convertLeadSchema>;
