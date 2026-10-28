import { Schema, model, type Types } from "mongoose";
import { STAFF_ROLES, type StaffRole } from "@vraunix/shared";
import { baseSchemaOptions } from "../schema-options.js";

export interface UserDocument {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash?: string;
  role: StaffRole;
  active: boolean;
  lastLoginAt?: Date;
  createdBy?: Types.ObjectId;
  passwordChangedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    passwordHash: { type: String, select: false },
    role: { type: String, enum: [...STAFF_ROLES], required: true, default: "admin" },
    active: { type: Boolean, required: true, default: false },
    lastLoginAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    passwordChangedAt: { type: Date },
  },
  baseSchemaOptions
);

userSchema.index({ role: 1, active: 1 });

export const User = model<UserDocument>("User", userSchema);
