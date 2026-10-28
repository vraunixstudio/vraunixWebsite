import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { parseInput } from "../middleware/validate.js";
import { idParamSchema } from "@vraunix/shared";
import { sendData } from "../utils/response.js";
import { actorFrom, routeId } from "./helpers.js";
import { listInvoices, getInvoice, createInvoice, updateInvoice, issueInvoice } from "../services/invoice.service.js";

export const invoiceRouter = Router();

invoiceRouter.use(authenticate, requireAdmin);

invoiceRouter.get("/", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 9;
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const clientId = typeof req.query.clientId === "string" ? req.query.clientId : undefined;
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const result = await listInvoices({ page, limit, search, clientId, status });
  sendData(res, result.data, 200, { page: result.page, limit: result.limit, total: result.total, totalPages: Math.ceil(result.total / result.limit) });
});

invoiceRouter.get("/:id", async (req, res) => {
  const id = parseInput(idParamSchema, req.params).id;
  sendData(res, await getInvoice(id));
});

invoiceRouter.post("/", async (req, res) => {
  const actor = actorFrom(req);
  sendData(res, await createInvoice(req.body ?? {}, actor, req), 201);
});

invoiceRouter.patch("/:id", async (req, res) => {
  const id = routeId(req);
  const actor = actorFrom(req);
  sendData(res, await updateInvoice(id, req.body ?? {}, actor, req));
});

invoiceRouter.post("/:id/issue", async (req, res) => {
  const id = routeId(req);
  const actor = actorFrom(req);
  sendData(res, await issueInvoice(id, actor, req));
});