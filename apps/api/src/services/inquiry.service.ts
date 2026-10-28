import type { Request } from "express";
import { Inquiry } from "../database/models/inquiry.js";
import { AppError } from "../utils/http-error.js";
import { recordAudit } from "./audit.service.js";

export async function listInquiries(options: { page?: number; limit?: number; search?: string; status?: string } = {}) {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(100, Math.max(1, options.limit ?? 9));
  const filter: Record<string, unknown> = {};
  if (options.status?.trim()) filter.status = options.status.trim();
  if (options.search?.trim()) {
    const regex = new RegExp(options.search.trim(), "i");
    filter.$or = [{ name: regex }, { email: regex }, { businessName: regex }, { message: regex }];
  }
  const total = await Inquiry.countDocuments(filter);
  const data = await Inquiry.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  return { data, total, page, limit };
}

export async function getInquiry(id: string) {
  const inquiry = await Inquiry.findById(id).lean();
  if (!inquiry) throw AppError.notFound("Inquiry not found");
  return inquiry;
}

export async function submitInquiry(input: Record<string, unknown>) {
  const inquiry = await Inquiry.create({ ...input, status: "new" });
  return inquiry;
}

export async function updateInquiryStatus(id: string, status: string, actor: { id: string; name: string; email: string; role: string }, req?: Request) {
  const inquiry = await Inquiry.findById(id);
  if (!inquiry) throw AppError.notFound("Inquiry not found");
  inquiry.status = status as "new" | "contacted" | "qualified" | "converted" | "closed";
  await inquiry.save();
  await recordAudit({ actor, action: "inquiry.updated", entityType: "Inquiry", entityId: id, metadata: { status }, req });
  return inquiry;
}