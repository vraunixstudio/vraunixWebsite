import { Schema, model, type Types } from "mongoose";
import { baseSchemaOptions } from "../schema-options.js";

export interface AuditLogDocument {
  actorId?: Types.ObjectId;
  actorName: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const auditLogSchema = new Schema<AuditLogDocument>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "User" },
    actorName: { type: String, required: true, maxlength: 120 },
    actorEmail: { type: String, required: true, maxlength: 254 },
    action: { type: String, required: true, maxlength: 120, index: true },
    entityType: { type: String, required: true, maxlength: 80, index: true },
    entityId: { type: String, maxlength: 120 },
    metadata: { type: Schema.Types.Mixed },
    ipHash: { type: String },
  },
  { ...baseSchemaOptions, timestamps: { createdAt: true, updatedAt: false } }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
auditLogSchema.index({ actorId: 1, createdAt: -1 });

export const AuditLog = model<AuditLogDocument>("AuditLog", auditLogSchema);
