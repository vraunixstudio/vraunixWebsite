import { Schema, model, type Types } from "mongoose";
import { baseSchemaOptions } from "../schema-options.js";

export interface ClientDocument {
  _id: Types.ObjectId;
  name: string;
  contactName?: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  country?: string;
  taxId?: string;
  billing?: { name?: string; email?: string; address?: string };
  notes?: string;
  status: "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const clientSchema = new Schema<ClientDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    contactName: { type: String, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, trim: true, maxlength: 40 },
    website: { type: String, trim: true, maxlength: 500 },
    address: { type: String, trim: true, maxlength: 500 },
    country: { type: String, trim: true, maxlength: 80 },
    taxId: { type: String, trim: true, maxlength: 80 },
    billing: {
      name: { type: String, trim: true, maxlength: 160 },
      email: { type: String, trim: true, lowercase: true, maxlength: 254 },
      address: { type: String, trim: true, maxlength: 500 },
    },
    notes: { type: String, trim: true, maxlength: 5000 },
    status: { type: String, enum: ["active", "archived"], default: "active" },
  },
  baseSchemaOptions
);

clientSchema.index({ name: 1 });
clientSchema.index({ email: 1 });

export const Client = model<ClientDocument>("Client", clientSchema);