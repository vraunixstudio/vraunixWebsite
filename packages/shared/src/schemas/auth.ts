import { z } from "zod";
import { emailSchema, passwordSchema } from "./common.js";

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required").max(128),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;