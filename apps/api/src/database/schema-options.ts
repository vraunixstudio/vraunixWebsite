import type { SchemaOptions } from "mongoose";

export const baseSchemaOptions: SchemaOptions = {
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: false,
    transform: (_doc, ret: Record<string, unknown>) => {
      const id = ret._id;
      if (id !== undefined) {
        ret.id = String(id);
        delete ret._id;
      }
      delete ret.__v;
      return ret;
    },
  },
};
