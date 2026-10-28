import type { Request } from "express";
import {
  idParamSchema,
  listQuerySchema,
  type ListQuery,
  type SessionUser,
} from "@vraunix/shared";
import { AppError } from "../utils/http-error.js";
import { parseInput } from "../middleware/validate.js";
import { serializeUser } from "../services/auth.service.js";

export function actorFrom(req: Request): SessionUser {
  if (!req.auth) throw AppError.unauthorized();
  return serializeUser(req.auth.user);
}

export function sessionIdFrom(req: Request): string {
  if (!req.auth) throw AppError.unauthorized();
  return req.auth.session.id;
}

export function routeId(req: Request, name = "id"): string {
  if (name === "id") return parseInput(idParamSchema, req.params).id;
  const value = req.params[name];
  if (typeof value !== "string" || value.length === 0) {
    throw AppError.badRequest("Missing route identifier");
  }
  return value;
}

export function listQueryFrom(req: Request): ListQuery {
  return parseInput(listQuerySchema, req.query);
}

export function queryString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function queryNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
