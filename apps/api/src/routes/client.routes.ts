import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { parseInput } from "../middleware/validate.js";
import { idParamSchema } from "@vraunix/shared";
import { sendData } from "../utils/response.js";
import { actorFrom, routeId } from "./helpers.js";
import { listClients, getClient, createClient, updateClient, createClientFromInquiry } from "../services/client.service.js";

export const clientRouter = Router();

clientRouter.use(authenticate, requireAdmin);

clientRouter.get("/", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 9;
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const result = await listClients({ page, limit, search, status });
  sendData(res, result.data, 200, { page: result.page, limit: result.limit, total: result.total, totalPages: Math.ceil(result.total / result.limit) });
});

clientRouter.get("/:id", async (req, res) => {
  const id = parseInput(idParamSchema, req.params).id;
  sendData(res, await getClient(id));
});

clientRouter.post("/", async (req, res) => {
  const actor = actorFrom(req);
  sendData(res, await createClient(req.body ?? {}, actor, req), 201);
});

clientRouter.post("/from-inquiry/:id", async (req, res) => {
  const id = routeId(req);
  const actor = actorFrom(req);
  sendData(res, await createClientFromInquiry(id, actor, req), 201);
});

clientRouter.patch("/:id", async (req, res) => {
  const id = routeId(req);
  const actor = actorFrom(req);
  sendData(res, await updateClient(id, req.body ?? {}, actor, req));
});