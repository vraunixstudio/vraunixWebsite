import { randomUUID } from "node:crypto";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import pinoHttp from "pino-http";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";
import { csrfProtection } from "./middleware/csrf.js";
import { normalizeJson } from "./middleware/json-normalize.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import { authRouter } from "./routes/auth.routes.js";
import { publicRouter } from "./routes/public.routes.js";
import { overviewRouter } from "./routes/overview.routes.js";
import { inquiryRouter } from "./routes/inquiry.routes.js";
import { clientRouter } from "./routes/client.routes.js";
import { proposalRouter } from "./routes/proposal.routes.js";
import { projectRouter } from "./routes/project.routes.js";
import { invoiceRouter } from "./routes/invoice.routes.js";
import { paymentRouter } from "./routes/payment.routes.js";

import { settingsRouter } from "./routes/settings.routes.js";
import { auditRouter } from "./routes/audit.routes.js";

export function createApp(): express.Express {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", env.TRUST_PROXY);

  const allowedOrigins = [
    env.WEB_ORIGIN.replace(/\/$/, ""),
    env.PUBLIC_APP_URL.replace(/\/$/, ""),
  ];

  app.use(
    pinoHttp({
      logger,
      genReqId(req, res) {
        const supplied = req.headers["x-request-id"];
        const id =
          typeof supplied === "string" && supplied.length <= 100
            ? supplied
            : randomUUID();
        res.setHeader("x-request-id", id);
        return id;
      },
    })
  );

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "same-site" },
    })
  );

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
          callback(null, true);
          return;
        }
        callback(new Error("Origin is not allowed"));
      },
      credentials: true,
      methods: ["GET", "HEAD", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "x-csrf-token", "x-xsrf-token"],
      maxAge: 600,
    })
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(normalizeJson);

  app.get("/health", (_req, res) => {
    const databaseReady = mongoose.connection.readyState === 1;
    res.status(databaseReady ? 200 : 503).json({
      success: databaseReady,
      data: {
        status: databaseReady ? "ok" : "degraded",
        database: databaseReady ? "connected" : "disconnected",
        environment: env.NODE_ENV,
        timestamp: new Date().toISOString(),
      },
    });
  });

  app.use("/api/v1", csrfProtection);

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/public", publicRouter);
  app.use("/api/v1/overview", overviewRouter);
  app.use("/api/v1/inquiries", inquiryRouter);
  app.use("/api/v1/clients", clientRouter);
  app.use("/api/v1/proposals", proposalRouter);
  app.use("/api/v1/projects", projectRouter);
  app.use("/api/v1/invoices", invoiceRouter);
  app.use("/api/v1/payments", paymentRouter);
  app.use("/api/v1/settings", settingsRouter);
  app.use("/api/v1/audit-logs", auditRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export const app = createApp();
