import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { parseInput } from "../middleware/validate.js";
import { paymentCreateSchema } from "@vraunix/shared";

import { sendData } from "../utils/response.js";
import { actorFrom, routeId } from "./helpers.js";
import { listPayments, recordPayment, verifyPayment } from "../services/payment.service.js";

export const paymentRouter = Router();

paymentRouter.use(authenticate, requireAdmin);

paymentRouter.get("/", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 9;
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const invoiceId = typeof req.query.invoiceId === "string" ? req.query.invoiceId : undefined;
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const result = await listPayments({ page, limit, search, invoiceId, status });
  sendData(res, result.data, 200, { page: result.page, limit: result.limit, total: result.total, totalPages: Math.ceil(result.total / result.limit) });
});

paymentRouter.post("/", async (req, res) => {
  const actor = actorFrom(req);
  const input = parseInput(paymentCreateSchema, req.body ?? {});
  sendData(res, await recordPayment(input, actor, req), 201);
});

paymentRouter.post("/:id/verify", async (req, res) => {
  const id = routeId(req);
  const actor = actorFrom(req);
  sendData(res, await verifyPayment(id, actor, req));
});
