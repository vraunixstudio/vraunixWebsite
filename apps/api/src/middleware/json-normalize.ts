import type { NextFunction, Request, Response } from "express";

function normalize(value: unknown, seen = new WeakSet<object>()): unknown {
  if (value === null || value === undefined) return value;
  if (value instanceof Date) return value;
  if (Buffer.isBuffer(value)) return value;
  if (Array.isArray(value)) {
    return value.map((item) => normalize(item, seen));
  }
  if (typeof value === "object") {
    if ((value as { _bsontype?: string })._bsontype === "ObjectId") {
      return String(value);
    }
    if (seen.has(value)) return value;
    seen.add(value);
    const record = value as Record<string, unknown>;
    if (typeof record.toObject === "function") {
      return normalize((record.toObject as () => unknown)(), seen);
    }
    const result: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(record)) {
      if (key === "__v") continue;
      if (key === "_id") {
        result.id = normalize(entry, seen);
        continue;
      }
      result[key] = normalize(entry, seen);
    }
    return result;
  }
  return value;
}

export function normalizeJson(
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  const original = res.json.bind(res);
  res.json = (body: unknown) => original(normalize(body));
  next();
}
