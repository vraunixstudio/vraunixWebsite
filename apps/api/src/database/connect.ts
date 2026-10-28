import mongoose, { type ClientSession } from "mongoose";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

mongoose.set("strictQuery", true);

export async function connectDatabase(uri = env.MONGODB_URI): Promise<void> {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(uri, {
    dbName: env.MONGODB_DATABASE || undefined,
    autoIndex: !env.isProduction,
    serverSelectionTimeoutMS: 10_000,
  });
  logger.info(
    { database: mongoose.connection.name },
    "Connected to MongoDB"
  );
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}

export async function dropTestDatabase(): Promise<void> {
  if (!env.isTest) {
    throw new Error("Refusing to drop a database outside the test environment");
  }
  await mongoose.connection.dropDatabase();
}

function transactionUnsupported(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return (
    error.message.includes("Transaction numbers are only allowed") ||
    error.message.includes("replica set") ||
    error.message.includes("mongos")
  );
}

export async function withOptionalTransaction<T>(
  operation: (session?: ClientSession) => Promise<T>
): Promise<T> {
  const session = await mongoose.startSession();
  try {
    let result: T | undefined;
    await session.withTransaction(async () => {
      result = await operation(session);
    });
    return result as T;
  } catch (error) {
    if (transactionUnsupported(error)) {
      logger.debug(
        "MongoDB transactions are unavailable; running operation without a transaction"
      );
      return operation(undefined);
    }
    throw error;
  } finally {
    await session.endSession();
  }
}
