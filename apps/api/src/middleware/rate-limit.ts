import { rateLimit } from "express-rate-limit";
import { env } from "../config/env.js";
import { sendError } from "../utils/response.js";

function limit(name: string, max: number, windowMs: number) {
  return rateLimit({
    windowMs,
    limit: max,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skip: () => env.isTest && process.env.RATE_LIMIT_TEST_DISABLE === "true",
    handler: (_req, res) => {
      res.setHeader("Retry-After", String(Math.ceil(windowMs / 1000)));
      sendError(
        res,
        429,
        "RATE_LIMITED",
        `${name} request limit reached. Please try again later.`
      );
    },
  });
}

export const loginLimiter = limit(
  "Login",
  env.RATE_LIMIT_LOGIN_MAX,
  15 * 60 * 1000
);

export const discoveryLimiter = limit(
  "Discovery submission",
  env.RATE_LIMIT_DISCOVERY_MAX,
  60 * 60 * 1000
);

export const contactLimiter = limit(
  "Contact submission",
  env.RATE_LIMIT_CONTACT_MAX,
  60 * 60 * 1000
);

export const authRecoveryLimiter = limit("Account recovery", 5, 60 * 60 * 1000);
