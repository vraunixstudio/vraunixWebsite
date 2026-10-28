import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { parseInput } from "../middleware/validate.js";
import { idParamSchema } from "@vraunix/shared";
import { sendData } from "../utils/response.js";
import { actorFrom, routeId } from "./helpers.js";
import { listProjects, getProject, createProject, updateProject, createProjectFromProposal } from "../services/project.service.js";

export const projectRouter = Router();

projectRouter.use(authenticate, requireAdmin);

projectRouter.get("/", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 9;
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const clientId = typeof req.query.clientId === "string" ? req.query.clientId : undefined;
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const result = await listProjects({ page, limit, search, clientId, status });
  sendData(res, result.data, 200, { page: result.page, limit: result.limit, total: result.total, totalPages: Math.ceil(result.total / result.limit) });
});

projectRouter.get("/:id", async (req, res) => {
  const id = parseInput(idParamSchema, req.params).id;
  sendData(res, await getProject(id));
});

projectRouter.post("/", async (req, res) => {
  const actor = actorFrom(req);
  sendData(res, await createProject(req.body ?? {}, actor, req), 201);
});

projectRouter.post("/from-proposal/:id", async (req, res) => {
  const id = routeId(req);
  const actor = actorFrom(req);
  sendData(res, await createProjectFromProposal(id, actor, req), 201);
});

projectRouter.patch("/:id", async (req, res) => {
  const id = routeId(req);
  const actor = actorFrom(req);
  sendData(res, await updateProject(id, req.body ?? {}, actor, req));
});