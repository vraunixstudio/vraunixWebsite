import { createServer } from "node:http";
import { app } from "./app.js";
import { env } from "./config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "./database/connect.js";
import { ensureSettings } from "./services/settings.service.js";
import { logger } from "./utils/logger.js";

const server = createServer(app);
let shuttingDown = false;

async function start(): Promise<void> {
  await connectDatabase();
  await ensureSettings();

  server.listen(env.PORT, () => {
    logger.info(
      {
        port: env.PORT,
        environment: env.NODE_ENV,
        webOrigin: env.WEB_ORIGIN,
      },
      "Vraunix API listening"
    );
  });
}

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info({ signal }, "Shutting down Vraunix API");

  const force = setTimeout(() => {
    logger.error("Graceful shutdown timed out");
    process.exit(1);
  }, 10_000);
  force.unref();

  server.close(async (error) => {
    try {
      await disconnectDatabase();
    } finally {
      clearTimeout(force);
      process.exit(error ? 1 : 0);
    }
  });

  server.closeIdleConnections();
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});
process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
process.on("unhandledRejection", (error) => {
  logger.fatal({ err: error }, "Unhandled promise rejection");
  void shutdown("unhandledRejection");
});
process.on("uncaughtException", (error) => {
  logger.fatal({ err: error }, "Uncaught exception");
  process.exit(1);
});

start().catch((error) => {
  logger.fatal({ err: error }, "Failed to start Vraunix API");
  process.exit(1);
});
