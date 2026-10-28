import { Counter } from "../database/models/counter.js";
import { Proposal } from "../database/models/proposal.js";
import { AppError } from "../utils/http-error.js";
import { recordAudit } from "./audit.service.js";
import type { Request } from "express";

async function nextNumber(key: string, prefix: string) {
  const counter = await Counter.findByIdAndUpdate(
    key,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `${prefix}-${String(counter!.seq).padStart(4, "0")}`;
}

export async function listProposals(options: { page?: number; limit?: number; search?: string; clientId?: string; status?: string } = {}) {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(100, Math.max(1, options.limit ?? 9));
  const filter: Record<string, unknown> = {};
  if (options.clientId) filter.clientId = options.clientId;
  if (options.status?.trim()) filter.status = options.status.trim();
  if (options.search?.trim()) {
    const regex = new RegExp(options.search.trim(), "i");
    filter.$or = [{ title: regex }, { number: regex }];
  }
  const total = await Proposal.countDocuments(filter);
  const data = await Proposal.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  return { data, total, page, limit };
}

export async function getProposal(id: string) {
  const proposal = await Proposal.findById(id).lean();
  if (!proposal) throw AppError.notFound("Proposal not found");
  return proposal;
}

export async function createProposal(input: Record<string, unknown>, actor: { id: string; name: string; email: string; role: string }, req?: Request) {
  const number = await nextNumber("proposal", "PROP");
  const proposal = await Proposal.create({ ...input, number, status: "draft" });
  await recordAudit({ actor, action: "proposal.created", entityType: "Proposal", entityId: String(proposal._id), req });
  return proposal;
}

export async function updateProposal(id: string, input: Record<string, unknown>, actor: { id: string; name: string; email: string; role: string }, req?: Request) {
  const proposal = await Proposal.findById(id);
  if (!proposal) throw AppError.notFound("Proposal not found");
  if (proposal.status !== "draft") throw AppError.badRequest("Only draft proposals can be edited");
  Object.assign(proposal, input);
  await proposal.save();
  await recordAudit({ actor, action: "proposal.updated", entityType: "Proposal", entityId: id, req });
  return proposal;
}

export async function sendProposal(id: string, actor: { id: string; name: string; email: string; role: string }, req?: Request) {
  const proposal = await Proposal.findById(id);
  if (!proposal) throw AppError.notFound("Proposal not found");
  if (proposal.status !== "draft") throw AppError.badRequest("Proposal has already been sent");
  proposal.status = "sent";
  proposal.sentAt = new Date();
  await proposal.save();
  await recordAudit({ actor, action: "proposal.sent", entityType: "Proposal", entityId: id, req });
  return proposal;
}

export async function acceptProposal(id: string, actor: { id: string; name: string; email: string; role: string }, req?: Request) {
  const proposal = await Proposal.findById(id);
  if (!proposal) throw AppError.notFound("Proposal not found");
  if (proposal.status !== "sent") throw AppError.badRequest("Only sent proposals can be accepted");
  proposal.status = "accepted";
  proposal.acceptedAt = new Date();
  await proposal.save();
  await recordAudit({ actor, action: "proposal.accepted", entityType: "Proposal", entityId: id, req });
  return proposal;
}