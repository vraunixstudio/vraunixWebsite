import { Schema, model, type Types } from "mongoose";
import { baseSchemaOptions } from "../schema-options.js";

export interface PasswordResetDocument {
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const passwordResetSchema = new Schema<PasswordResetDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date },
  },
  baseSchemaOptions
);

passwordResetSchema.index({ expiresAt: 1 });

export const PasswordReset = model<PasswordResetDocument>(
  "PasswordReset",
  passwordResetSchema
);
