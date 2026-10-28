import pino from "pino";
import { env } from "../config/env.js";

export const logger = pino({
  level: env.NODE_ENV === "test" ? "silent" : env.isProduction ? "info" : "debug",
  redact: {
    paths: [
      "req.headers.cookie",
      "req.headers.authorization",
      "res.headers['set-cookie']",
      "password",
      "passwordHash",
      "token",
      "sessionToken",
      "csrfToken",
    ],
    censor: "[REDACTED]",
  },
});
