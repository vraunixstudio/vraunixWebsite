import { Project } from "../database/models/project.js";
import { Proposal } from "../database/models/proposal.js";
import { AppError } from "../utils/http-error.js";
import { recordAudit } from "./audit.service.js";
import type { Request } from "express";

export async function listProjects(options: { page?: number; limit?: number; search?: string; clientId?: string; status?: string } = {}) {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(100, Math.max(1, options.limit ?? 9));
  const filter: Record<string, unknown> = {};
  if (options.clientId) filter.clientId = options.clientId;
  if (options.status?.trim()) filter.status = options.status.trim();
  if (options.search?.trim()) {
    const regex = new RegExp(options.search.trim(), "i");
    filter.$or = [{ name: regex }];
  }
  const total = await Project.countDocuments(filter);
  const data = await Project.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  return { data, total, page, limit };
}

export async function getProject(id: string) {
  const project = await Project.findById(id).lean();
  if (!project) throw AppError.notFound("Project not found");
  return project;
}

export async function createProject(input: Record<string, unknown>, actor: { id: string; name: string; email: string; role: string }, req?: Request) {
  const project = await Project.create(input);
  await recordAudit({ actor, action: "project.created", entityType: "Project", entityId: String(project._id), req });
  return project;
}

export async function updateProject(id: string, input: Record<string, unknown>, actor: { id: string; name: string; email: string; role: string }, req?: Request) {
  const project = await Project.findById(id);
  if (!project) throw AppError.notFound("Project not found");
  Object.assign(project, input);
  await project.save();
  await recordAudit({ actor, action: "project.updated", entityType: "Project", entityId: id, req });
  return project;
}

export async function createProjectFromProposal(proposalId: string, actor: { id: string; name: string; email: string; role: string }, req?: Request) {
  const proposal = await Proposal.findById(proposalId);
  if (!proposal) throw AppError.notFound("Proposal not found");
  if (proposal.status !== "accepted") throw AppError.badRequest("Proposal must be accepted first");
  const existing = await Project.findOne({ proposalId: proposal._id });
  if (existing) return existing;
  const project = await Project.create({
    clientId: proposal.clientId,
    proposalId: proposal._id,
    name: proposal.title,
    description: proposal.description,
    priceMinor: proposal.pricing.totalMinor,
    currency: proposal.pricing.currency,
    deliverables: proposal.scope ?? [],
    status: "planning",
    milestones: [],
  });
  await recordAudit({ actor, action: "project.created_from_proposal", entityType: "Project", entityId: String(project._id), metadata: { proposalId }, req });
  return project;
}