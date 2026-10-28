import {
  BUDGET_RANGES,
  COMPANY,
  CURRENCY_CODES,
  DEFAULT_CURRENCY,
  TIMELINE_OPTIONS,
  type PublicSettings,
  type SettingsUpdateInput,
} from "@vraunix/shared";
import { Types, type HydratedDocument } from "mongoose";
import { Settings, type SettingsDocument } from "../database/models/settings.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { toMinor } from "../utils/money.js";

export const DEFAULT_SETTINGS = {
  key: "global",
  company: {
    name: COMPANY.name,
    slogan: COMPANY.slogan,
    description: COMPANY.description,
    email: COMPANY.email,
    phone: COMPANY.phone,
    location: COMPANY.location,
    website: COMPANY.website,
    legalName: COMPANY.name,
  },
  branding: {
    documentFooter: `${COMPANY.name} — ${COMPANY.slogan}`,
    primaryContactName: "",
    primaryContactTitle: "",
  },
  currency: { default: DEFAULT_CURRENCY },
  tax: { defaultRatePercent: "0", label: "Tax" },
  invoice: {
    prefix: "VX-INV",
    dueDays: 14,
    paymentTerms:
      "Payment is due by the date shown on this invoice. Please include the invoice number with your payment.",
    footerNote: "Thank you for working with Vraunix Studio.",
  },
  proposal: {
    prefix: "VX-PRP",
    validityDays: 30,
    defaultTerms:
      "This proposal is valid for the period stated above. Pricing and scope are based on the information available at the time of preparation. Work outside the agreed Scope of Work requires a documented change request.",
    nextSteps:
      "Review the proposal and Scope of Work. If everything is correct, confirm acceptance in writing so we can prepare the agreement and initial invoice.",
  },
  email: {
    fromName: "Vraunix Studio",
    fromEmail: "no-reply@vraunix.example",
    replyTo: COMPANY.email,
  },
  discovery: {
    budgetRanges: [...BUDGET_RANGES],
    timelines: [...TIMELINE_OPTIONS],
    currencies: [...CURRENCY_CODES],
  },
  security: {
    sessionTtlHours: env.SESSION_TTL_HOURS,
    allowMarketerPaymentRecording: true,
  },
  maintenancePlans: [
    {
      name: "Essential Care",
      description: "Routine updates and checks for a small business website.",
      priceMinor: 7500,
      currency: DEFAULT_CURRENCY,
      frequency: "monthly",
      features: [
        "Core software updates",
        "Backup verification",
        "Basic security checks",
        "Monthly maintenance report",
        "Email support",
      ],
    },
    {
      name: "Growth Care",
      description: "More frequent support with a content-change allowance.",
      priceMinor: 15000,
      currency: DEFAULT_CURRENCY,
      frequency: "monthly",
      features: [
        "Everything in Essential Care",
        "Content changes within the agreed allowance",
        "Performance review",
        "Priority email support",
      ],
    },
    {
      name: "Quarterly Review",
      description: "A scheduled quarterly maintenance arrangement.",
      priceMinor: 25000,
      currency: DEFAULT_CURRENCY,
      frequency: "quarterly",
      features: [
        "Quarterly updates and checks",
        "Backup verification",
        "Quarterly maintenance report",
        "Email support",
      ],
    },
  ],
};

const PLAN_DEFAULT_NAMES = DEFAULT_SETTINGS.maintenancePlans.map((plan) => plan.name);

export async function ensureSettings(): Promise<void> {
  const existing = await Settings.findOne({ key: "global" }).lean();
  if (existing) return;
  try {
    await Settings.create(
      DEFAULT_SETTINGS as unknown as Parameters<typeof Settings.create>[0]
    );
    logger.info("Created default company settings");
  } catch (error) {
    if ((error as { code?: number }).code === 11000) {
      return;
    }
    throw error;
  }
}

export async function getSettings(): Promise<HydratedDocument<SettingsDocument>> {
  let settings = await Settings.findOne({ key: "global" });
  if (!settings) {
    await ensureSettings();
    settings = await Settings.findOne({ key: "global" });
  }
  if (!settings) {
    throw new Error("Settings could not be initialized");
  }
  return settings;
}

export function toPublicSettings(settings: SettingsDocument): PublicSettings {
  return {
    company: {
      name: settings.company.name,
      slogan: settings.company.slogan,
      description: settings.company.description,
      email: settings.company.email,
      phone: settings.company.phone,
      location: settings.company.location,
      website: settings.company.website,
    },
    currency: { default: settings.currency.default },
    discovery: {
      budgetRanges:
        settings.discovery.budgetRanges.length > 0
          ? settings.discovery.budgetRanges
          : [...BUDGET_RANGES],
      timelines:
        settings.discovery.timelines.length > 0
          ? settings.discovery.timelines
          : [...TIMELINE_OPTIONS],
      currencies:
        settings.discovery.currencies.length > 0
          ? settings.discovery.currencies
          : [...CURRENCY_CODES],
    },
  };
}

export async function updateSettings(
  input: SettingsUpdateInput,
  updatedBy: string
): Promise<HydratedDocument<SettingsDocument>> {
  const settings = await getSettings();
  if (input.company) settings.company = { ...settings.company, ...input.company };
  if (input.branding) settings.branding = { ...settings.branding, ...input.branding };
  if (input.currency) settings.currency = input.currency;
  if (input.tax) settings.tax = input.tax;
  if (input.invoice) settings.invoice = { ...settings.invoice, ...input.invoice };
  if (input.proposal) settings.proposal = { ...settings.proposal, ...input.proposal };
  if (input.email) settings.email = { ...settings.email, ...input.email };
  if (input.discovery) settings.discovery = input.discovery;
  if (input.security) settings.security = input.security;
  if (input.maintenancePlans) {
    settings.maintenancePlans = input.maintenancePlans.map((plan, index) => ({
      _id: settings.maintenancePlans[index]?._id,
      name: plan.name,
      description: plan.description,
      priceMinor: toMinor(plan.price, plan.currency),
      currency: plan.currency,
      frequency: plan.frequency,
      features: plan.features,
    }));
  }
  settings.updatedBy = new Types.ObjectId(updatedBy);
  await settings.save();
  return settings;
}

export function defaultPlanNames(): string[] {
  return PLAN_DEFAULT_NAMES;
}
