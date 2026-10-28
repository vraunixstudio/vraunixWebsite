import {
  emailSchema,
  passwordSchema,
  requiredText,
} from "@vraunix/shared";
import { env } from "../config/env.js";
import { connectDatabase, disconnectDatabase } from "../database/connect.js";
import { User } from "../database/models/user.js";
import { hashPassword } from "../services/password.service.js";
import { ensureSettings } from "../services/settings.service.js";
import { logger } from "../utils/logger.js";

async function main(): Promise<void> {
  const name = requiredText(2, 120).parse(env.INITIAL_ADMIN_NAME);
  const email = emailSchema.parse(env.INITIAL_ADMIN_EMAIL);
  const password = passwordSchema.parse(env.INITIAL_ADMIN_PASSWORD);

  await connectDatabase();
  await ensureSettings();

  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== "admin") {
      throw new Error(
        `The account ${email} exists but is not an administrator. Choose another email.`
      );
    }
    if (!existing.active) {
      existing.active = true;
      await existing.save();
      logger.info({ email }, "Existing administrator re-activated");
      return;
    }
    logger.info({ email }, "Administrator already exists; no changes made");
    return;
  }

  await User.create({
    name,
    email,
    passwordHash: await hashPassword(password),
    role: "admin",
    active: true,
    passwordChangedAt: new Date(),
  });

  logger.info({ email }, "Initial administrator created");
}

main()
  .catch((error) => {
    logger.fatal({ err: error }, "Administrator seed failed");
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase().catch(() => undefined);
  });
