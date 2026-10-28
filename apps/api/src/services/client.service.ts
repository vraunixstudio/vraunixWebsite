import { Client } from "../database/models/client.js";
import { AppError } from "../utils/http-error.js";
import { recordAudit } from "./audit.service.js";
import type { Request } from "express";

export async function listClients(options: { page?: number; limit?: number; search?: string; status?: string } = {}) {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(100, Math.max(1, options.limit ?? 9));
  const filter: Record<string, unknown> = {};
  if (options.status?.trim()) filter.status = options.status.trim();
  if (options.search?.trim()) {
    const regex = new RegExp(options.search.trim(), "i");
    filter.$or = [{ name: regex }, { email: regex }, { contactName: regex }, { country: regex }];
  }
  const total = await Client.countDocuments(filter);
  const data = await Client.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  return { data, total, page, limit };
}

export async function getClient(id: string) {
  const client = await Client.findById(id).lean();
  if (!client) throw AppError.notFound("Client not found");
  return client;
}

export async function createClient(input: Record<string, unknown>, actor: { id: string; name: string; email: string; role: string }, req?: Request) {
  const client = await Client.create(input);
  await recordAudit({ actor, action: "client.created", entityType: "Client", entityId: String(client._id), req });
  return client;
}

export async function updateClient(id: string, input: Record<string, unknown>, actor: { id: string; name: string; email: string; role: string }, req?: Request) {
  const client = await Client.findById(id);
  if (!client) throw AppError.notFound("Client not found");
  Object.assign(client, input);
  await client.save();
  await recordAudit({ actor, action: "client.updated", entityType: "Client", entityId: id, req });
  return client;
}

export async function createClientFromInquiry(inquiryId: string, actor: { id: string; name: string; email: string; role: string }, req?: Request) {
  const { Inquiry } = await import("../database/models/inquiry.js");
  const inquiry = await Inquiry.findById(inquiryId);
  if (!inquiry) throw AppError.notFound("Inquiry not found");
  const client = await Client.create({
    name: inquiry.businessName || inquiry.name,
    contactName: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    notes: inquiry.message,
    status: "active",
  });
  inquiry.status = "converted";
  inquiry.clientId = client._id;
  await inquiry.save();
  await recordAudit({ actor, action: "client.created_from_inquiry", entityType: "Client", entityId: String(client._id), metadata: { inquiryId }, req });
  return client;
}