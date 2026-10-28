import { Schema, model, type Types } from "mongoose";
import { baseSchemaOptions } from "../schema-options.js";

export interface InvoiceLine {
  description: string;
  quantity: string;
  unitPriceMinor: number;
  amountMinor: number;
}

export interface InvoiceDocument {
  _id: Types.ObjectId;
  clientId: Types.ObjectId;
  projectId?: Types.ObjectId;
  number: string;
  currency: string;
  issueDate: Date;
  dueDate: Date;
  lineItems: InvoiceLine[];
  discount?: { type: "fixed" | "percent"; value: string };
  taxRatePercent: string;
  subtotalMinor: number;
  discountMinor: number;
  taxMinor: number;
  totalMinor: number;
  amountPaidMinor: number;
  balanceMinor: number;
  status: "draft" | "issued" | "partially_paid" | "paid" | "overdue" | "void";
  notes?: string;
  terms?: string;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<InvoiceDocument>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project" },
    number: { type: String, required: true, unique: true },
    currency: { type: String, required: true, default: "NPR" },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    lineItems: [
      {
        description: { type: String, required: true, trim: true, maxlength: 500 },
        quantity: { type: String, required: true, trim: true, maxlength: 40 },
        unitPriceMinor: { type: Number, required: true, default: 0 },
        amountMinor: { type: Number, required: true, default: 0 },
      },
    ],
    discount: {
      type: { type: String, enum: ["fixed", "percent"] },
      value: { type: String },
    },
    taxRatePercent: { type: String, default: "0" },
    subtotalMinor: { type: Number, default: 0 },
    discountMinor: { type: Number, default: 0 },
    taxMinor: { type: Number, default: 0 },
    totalMinor: { type: Number, default: 0 },
    amountPaidMinor: { type: Number, default: 0 },
    balanceMinor: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "issued", "partially_paid", "paid", "overdue", "void"], default: "draft" },
    notes: { type: String, trim: true, maxlength: 5000 },
    terms: { type: String, trim: true, maxlength: 5000 },
  },
  baseSchemaOptions
);

invoiceSchema.index({ clientId: 1, createdAt: -1 });
invoiceSchema.index({ status: 1 });

export const Invoice = model<InvoiceDocument>("Invoice", invoiceSchema);