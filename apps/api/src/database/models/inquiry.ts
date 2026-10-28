import { Schema, model, type Types } from "mongoose";
import { baseSchemaOptions } from "../schema-options.js";

export interface InquiryDocument {
  _id: Types.ObjectId;
  name: string;
  email: string;
  businessName?: string;
  phone?: string;
  message?: string;
  source: "discovery" | "contact";
  status: "new" | "contacted" | "qualified" | "converted" | "closed";
  clientId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const inquirySchema = new Schema<InquiryDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    businessName: { type: String, trim: true, maxlength: 160 },
    phone: { type: String, trim: true, maxlength: 40 },
    message: { type: String, trim: true, maxlength: 5000 },
    source: { type: String, enum: ["discovery", "contact"], default: "contact" },
    status: { type: String, enum: ["new", "contacted", "qualified", "converted", "closed"], default: "new" },
    clientId: { type: Schema.Types.ObjectId, ref: "Client" },
  },
  baseSchemaOptions
);

inquirySchema.index({ status: 1, createdAt: -1 });

export const Inquiry = model<InquiryDocument>("Inquiry", inquirySchema);