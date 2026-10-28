import type { Request } from "express";
import { AuditLog } from "../database/models/audit-log.js";
import { hashIp } from "../utils/crypto.js";
import { logger } from "../utils/logger.js";
import {
  dateRangeFilter,
  paginationMeta,
  searchRegex,
} from "../utils/pagination.js";

export type AuditActor = {
  id?: string;
  name: string;
  email: string;
};

export type AuditInput = {
  actor?: AuditActor;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  req?: Request;
};

export async function recordAudit(input: AuditInput): Promise<void> {
  try {
    await AuditLog.create({
      actorId: input.actor?.id,
      actorName: input.actor?.name ?? "System",
      actorEmail: input.actor?.email ?? "system@vraunix.internal",
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      metadata: input.metadata,
      ipHash: hashIp(input.req?.ip),
    });
  } catch (error) {
    logger.error({ err: error, action: input.action }, "Failed to write audit log");
  }
}

export async function listAuditLogs(query: {
  page: number;
  limit: number;
  search?: string;
  action?: string;
  entityType?: string;
  actorId?: string;
  from?: string;
  to?: string;
}) {
  const filter: Record<string, unknown> = {};
  if (query.action) filter.action = query.action;
  if (query.entityType) filter.entityType = query.entityType;
  if (query.actorId) filter.actorId = query.actorId;
  const range = dateRangeFilter(query.from, query.to);
  if (range) filter.createdAt = range;
  if (query.search) {
    const regex = searchRegex(query.search);
    filter.$or = [
      { actorName: regex },
      { actorEmail: regex },
      { action: regex },
      { entityType: regex },
      { entityId: regex },
    ];
  }

  const [items, total] = await Promise.all([
    AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .lean(),
    AuditLog.countDocuments(filter),
  ]);

  return { items, meta: paginationMeta(total, query.page, query.limit) };
}
