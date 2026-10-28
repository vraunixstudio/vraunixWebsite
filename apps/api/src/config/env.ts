import path from "node:path";
import { config as loadEnv } from "dotenv";
import { z } from "zod";

const rootEnv = path.resolve(process.cwd(), "../../.env");
const localEnv = path.resolve(process.cwd(), ".env");
loadEnv({ path: rootEnv, quiet: true });
loadEnv({ path: localEnv, quiet: true });

const booleanFromString = z
  .union([z.boolean(), z.string()])
  .transform((value) => {
    if (typeof value === "boolean") return value;
    return ["1", "true", "yes", "on"].includes(value.toLowerCase());
  });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  WEB_ORIGIN: z.string().url().default("http://localhost:3000"),
  API_BASE_URL: z.string().url().default("http://127.0.0.1:4000"),
  PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  MONGODB_URI: z.string().min(10, "MONGODB_URI is required"),
  MONGODB_DATABASE: z.string().optional(),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters"),
  CSRF_SECRET: z.string().min(32, "CSRF_SECRET must be at least 32 characters"),
  SESSION_COOKIE_NAME: z.string().regex(/^[a-zA-Z0-9_.-]+$/).default("vx_session"),
  SESSION_TTL_HOURS: z.coerce.number().int().min(1).max(72).default(8),
  COOKIE_SECURE: booleanFromString.optional(),
  TRUST_PROXY: booleanFromString.default(false),
  STORAGE_PROVIDER: z.literal("local").default("local"),
  STORAGE_DIR: z.string().default("storage"),
  MAIL_HOST: z.string().optional(),
  MAIL_PORT: z.coerce.number().int().positive().default(587),
  MAIL_SECURE: booleanFromString.default(false),
  MAIL_USER: z.string().optional(),
  MAIL_PASSWORD: z.string().optional(),
  MAIL_FROM: z.string().optional(),
  RATE_LIMIT_LOGIN_MAX: z.coerce.number().int().positive().default(10),
  RATE_LIMIT_DISCOVERY_MAX: z.coerce.number().int().positive().default(5),
  RATE_LIMIT_CONTACT_MAX: z.coerce.number().int().positive().default(5),
  INITIAL_ADMIN_NAME: z.string().optional(),
  INITIAL_ADMIN_EMAIL: z.string().optional(),
  INITIAL_ADMIN_PASSWORD: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment configuration:\n${issues}`);
}

export const env = {
  ...parsed.data,
  COOKIE_SECURE:
    parsed.data.COOKIE_SECURE ?? parsed.data.NODE_ENV === "production",
  isProduction: parsed.data.NODE_ENV === "production",
  isTest: parsed.data.NODE_ENV === "test",
  storageDir: path.resolve(process.cwd(), parsed.data.STORAGE_DIR),
  mailConfigured: Boolean(parsed.data.MAIL_HOST),
} as const;

if (env.isProduction) {
  if (env.SESSION_SECRET === env.CSRF_SECRET) {
    throw new Error("SESSION_SECRET and CSRF_SECRET must be different in production");
  }
  if (!env.COOKIE_SECURE) {
    throw new Error("COOKIE_SECURE must be true in production");
  }
}
