import { Schema, model, type Types } from "mongoose";
import { DEFAULT_CURRENCY } from "@vraunix/shared";
import { baseSchemaOptions } from "../schema-options.js";

export interface SettingsDocument {
  key: string;
  company: {
    name: string;
    slogan: string;
    description: string;
    email: string;
    phone?: string;
    location?: string;
    website?: string;
    legalName?: string;
  };
  branding: {
    documentFooter?: string;
    primaryContactName?: string;
    primaryContactTitle?: string;
  };
  currency: { default: string };
  tax: { defaultRatePercent: string; label: string };
  invoice: {
    prefix: string;
    dueDays: number;
    paymentTerms?: string;
    footerNote?: string;
  };
  proposal: {
    prefix: string;
    validityDays: number;
    defaultTerms?: string;
    nextSteps?: string;
    defaultAbout?: string;
  };
  email: {
    fromName?: string;
    fromEmail: string;
    replyTo?: string;
  };
  discovery: {
    budgetRanges: string[];
    timelines: string[];
    currencies: string[];
  };
  security: {
    sessionTtlHours: number;
    allowMarketerPaymentRecording: boolean;
  };
  maintenancePlans: {
    _id?: Types.ObjectId;
    name: string;
    description?: string;
    priceMinor: number;
    currency: string;
    frequency: string;
    features: string[];
  }[];
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const maintenancePlanSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 120 },
    description: { type: String, maxlength: 1000 },
    priceMinor: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: DEFAULT_CURRENCY },
    frequency: { type: String, required: true },
    features: { type: [String], default: [] },
  },
  { _id: true }
);

const settingsSchema = new Schema<SettingsDocument>(
  {
    key: { type: String, required: true, unique: true, default: "global" },
    company: {
      name: { type: String, required: true },
      slogan: { type: String, required: true },
      description: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      location: { type: String },
      website: { type: String },
      legalName: { type: String },
    },
    branding: {
      documentFooter: { type: String },
      primaryContactName: { type: String },
      primaryContactTitle: { type: String },
    },
    currency: { default: { type: String, required: true, default: DEFAULT_CURRENCY } },
    tax: {
      defaultRatePercent: { type: String, required: true, default: "0" },
      label: { type: String, required: true, default: "Tax" },
    },
    invoice: {
      prefix: { type: String, required: true, default: "VX-INV" },
      dueDays: { type: Number, required: true, default: 14 },
      paymentTerms: { type: String },
      footerNote: { type: String },
    },
    proposal: {
      prefix: { type: String, required: true, default: "VX-PRP" },
      validityDays: { type: Number, required: true, default: 30 },
      defaultTerms: { type: String },
      nextSteps: { type: String },
      defaultAbout: { type: String },
    },
    email: {
      fromName: { type: String },
      fromEmail: { type: String, required: true },
      replyTo: { type: String },
    },
    discovery: {
      budgetRanges: { type: [String], default: [] },
      timelines: { type: [String], default: [] },
      currencies: { type: [String], default: [] },
    },
    security: {
      sessionTtlHours: { type: Number, required: true, default: 8, min: 1, max: 72 },
      allowMarketerPaymentRecording: { type: Boolean, required: true, default: true },
    },
    maintenancePlans: { type: [maintenancePlanSchema], default: [] },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  baseSchemaOptions
);

export const Settings = model<SettingsDocument>("Settings", settingsSchema);
