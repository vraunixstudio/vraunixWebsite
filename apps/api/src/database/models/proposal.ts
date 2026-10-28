import { Schema, model, type Types } from "mongoose";
import { baseSchemaOptions } from "../schema-options.js";

export interface ProposalLine {
  description: string;
  quantity: string;
  unitPriceMinor: number;
}

export interface ProposalDocument {
  _id: Types.ObjectId;
  clientId: Types.ObjectId;
  number: string;
  title: string;
  description?: string;
  scope?: string[];
  pricing: { currency: string; totalMinor: number; lines?: ProposalLine[] };
  status: "draft" | "sent" | "accepted" | "declined" | "expired";
  sentAt?: Date;
  acceptedAt?: Date;
  declinedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const proposalSchema = new Schema<ProposalDocument>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    number: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 5000 },
    scope: [{ type: String, trim: true, maxlength: 500 }],
    pricing: {
      currency: { type: String, required: true, default: "NPR" },
      totalMinor: { type: Number, required: true, default: 0 },
      lines: [
        {
          description: { type: String, required: true, trim: true, maxlength: 500 },
          quantity: { type: String, required: true, trim: true, maxlength: 40 },
          unitPriceMinor: { type: Number, required: true, default: 0 },
        },
      ],
    },
    status: { type: String, enum: ["draft", "sent", "accepted", "declined", "expired"], default: "draft" },
    sentAt: { type: Date },
    acceptedAt: { type: Date },
    declinedAt: { type: Date },
  },
  baseSchemaOptions
);

proposalSchema.index({ clientId: 1, createdAt: -1 });
proposalSchema.index({ status: 1 });

export const Proposal = model<ProposalDocument>("Proposal", proposalSchema);