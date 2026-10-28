import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { parseInput } from "../middleware/validate.js";
import { idParamSchema } from "@vraunix/shared";
import { sendData } from "../utils/response.js";
import { actorFrom, routeId } from "./helpers.js";
import { listInquiries, getInquiry, submitInquiry, updateInquiryStatus } from "../services/inquiry.service.js";

export const inquiryRouter = Router();

inquiryRouter.post("/", async (req, res) => {
  const result = await submitInquiry(req.body ?? {});
  sendData(res, result, 201);
});

inquiryRouter.use(authenticate, requireAdmin);

inquiryRouter.get("/", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 9;
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const result = await listInquiries({ page, limit, search, status });
  sendData(res, result.data, 200, { page: result.page, limit: result.limit, total: result.total, totalPages: Math.ceil(result.total / result.limit) });
});

inquiryRouter.get("/:id", async (req, res) => {
  const id = parseInput(idParamSchema, req.params).id;
  sendData(res, await getInquiry(id));
});

inquiryRouter.patch("/:id/status", async (req, res) => {
  const id = routeId(req);
  const actor = actorFrom(req);
  sendData(res, await updateInquiryStatus(id, String(req.body?.status ?? ""), actor, req));
});