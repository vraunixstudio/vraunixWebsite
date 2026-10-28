import { Schema, model, type Types } from "mongoose";
import { baseSchemaOptions } from "../schema-options.js";

export interface PaymentDocument {
  _id: Types.ObjectId;
  invoiceId: Types.ObjectId;
  clientId: Types.ObjectId;
  number: string;
  amountMinor: number;
  currency: string;
  method: string;
  reference?: string;
  receivedAt: Date;
  verificationStatus: "pending" | "verified" | "rejected";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<PaymentDocument>(
  {
    invoiceId: { type: Schema.Types.ObjectId, ref: "Invoice", required: true },
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    number: { type: String, required: true, unique: true },
    amountMinor: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "USD" },
    method: { type: String, required: true, trim: true, maxlength: 60 },
    reference: { type: String, trim: true, maxlength: 200 },
    receivedAt: { type: Date, required: true },
    verificationStatus: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
    notes: { type: String, trim: true, maxlength: 2000 },
  },
  baseSchemaOptions
);

paymentSchema.index({ invoiceId: 1 });

export const Payment = model<PaymentDocument>("Payment", paymentSchema);