import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { env } from "../config/env.js";

export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function signCsrfToken(random: string): string {
  const signature = createHmac("sha256", env.CSRF_SECRET)
    .update(random)
    .digest("base64url");
  return `${random}.${signature}`;
}

export function createCsrfToken(): string {
  return signCsrfToken(generateToken(24));
}

export function verifyCsrfToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return false;
  try {
    const expected = signCsrfToken(parts[0]);
    const actualBuffer = Buffer.from(token);
    const expectedBuffer = Buffer.from(expected);
    return (
      actualBuffer.length === expectedBuffer.length &&
      timingSafeEqual(actualBuffer, expectedBuffer)
    );
  } catch {
    return false;
  }
}

export function hashIp(ip: string | undefined): string | undefined {
  if (!ip) return undefined;
  return createHmac("sha256", env.SESSION_SECRET).update(ip).digest("hex");
}

export function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB);
}
