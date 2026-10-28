import { connectDatabase, disconnectDatabase } from "../database/connect.js";
import { ensureSettings } from "../services/settings.service.js";
import { logger } from "../utils/logger.js";

async function main(): Promise<void> {
  await connectDatabase();
  await ensureSettings();
  logger.info("Base settings ensured");
}

main()
  .catch((error) => {
    logger.fatal({ err: error }, "Seed failed");
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase().catch(() => undefined);
  });