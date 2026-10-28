import { Schema, model, type Types } from "mongoose";
import { baseSchemaOptions } from "../schema-options.js";

export interface ProjectDocument {
  _id: Types.ObjectId;
  clientId: Types.ObjectId;
  proposalId?: Types.ObjectId;
  name: string;
  description?: string;
  status: "planning" | "in_progress" | "client_review" | "completed" | "on_hold" | "cancelled";
  priceMinor?: number;
  currency: string;
  startDate?: Date;
  targetDate?: Date;
  deliverables: string[];
  milestones: { name: string; dueDate?: Date; status: "pending" | "in_progress" | "completed" }[];
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<ProjectDocument>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    proposalId: { type: Schema.Types.ObjectId, ref: "Proposal" },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 5000 },
    status: { type: String, enum: ["planning", "in_progress", "client_review", "completed", "on_hold", "cancelled"], default: "planning" },
    priceMinor: { type: Number, min: 0 },
    currency: { type: String, default: "NPR" },
    startDate: { type: Date },
    targetDate: { type: Date },
    deliverables: [{ type: String, trim: true, maxlength: 500 }],
    milestones: [
      {
        name: { type: String, required: true, trim: true, maxlength: 200 },
        dueDate: { type: Date },
        status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending" },
      },
    ],
  },
  baseSchemaOptions
);

projectSchema.index({ clientId: 1, createdAt: -1 });

export const Project = model<ProjectDocument>("Project", projectSchema);