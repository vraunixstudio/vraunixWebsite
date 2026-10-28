import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { parseInput } from "../middleware/validate.js";
import { idParamSchema } from "@vraunix/shared";
import { sendData } from "../utils/response.js";
import { actorFrom, routeId } from "./helpers.js";
import { listProposals, getProposal, createProposal, updateProposal, sendProposal, acceptProposal } from "../services/proposal.service.js";

export const proposalRouter = Router();

proposalRouter.use(authenticate, requireAdmin);

proposalRouter.get("/", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 9;
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const clientId = typeof req.query.clientId === "string" ? req.query.clientId : undefined;
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const result = await listProposals({ page, limit, search, clientId, status });
  sendData(res, result.data, 200, { page: result.page, limit: result.limit, total: result.total, totalPages: Math.ceil(result.total / result.limit) });
});

proposalRouter.get("/:id", async (req, res) => {
  const id = parseInput(idParamSchema, req.params).id;
  sendData(res, await getProposal(id));
});

proposalRouter.post("/", async (req, res) => {
  const actor = actorFrom(req);
  sendData(res, await createProposal(req.body ?? {}, actor, req), 201);
});

proposalRouter.patch("/:id", async (req, res) => {
  const id = routeId(req);
  const actor = actorFrom(req);
  sendData(res, await updateProposal(id, req.body ?? {}, actor, req));
});

proposalRouter.post("/:id/send", async (req, res) => {
  const id = routeId(req);
  const actor = actorFrom(req);
  sendData(res, await sendProposal(id, actor, req));
});

proposalRouter.post("/:id/accept", async (req, res) => {
  const id = routeId(req);
  const actor = actorFrom(req);
  sendData(res, await acceptProposal(id, actor, req));
});