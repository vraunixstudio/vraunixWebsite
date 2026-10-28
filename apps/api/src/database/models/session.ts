import { Schema, model, type Types } from "mongoose";
import { baseSchemaOptions } from "../schema-options.js";

export interface SessionDocument {
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date;
  ipHash?: string;
  userAgent?: string;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<SessionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date },
    ipHash: { type: String },
    userAgent: { type: String, maxlength: 500 },
    lastSeenAt: { type: Date, required: true, default: () => new Date() },
  },
  baseSchemaOptions
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
sessionSchema.index({ userId: 1, revokedAt: 1 });

export const Session = model<SessionDocument>("Session", sessionSchema);
