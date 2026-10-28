import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { listAuditLogs } from "../services/audit.service.js";
import { sendData } from "../utils/response.js";
import {
  listQueryFrom,
  queryString,
} from "./helpers.js";

export const auditRouter = Router();

auditRouter.use(authenticate, requireAdmin);

auditRouter.get("/", async (req, res) => {
  const query = listQueryFrom(req);
  const result = await listAuditLogs({
    page: query.page,
    limit: query.limit,
    search: query.search,
    action: queryString(req.query.action),
    entityType: queryString(req.query.entityType),
    actorId: queryString(req.query.actorId),
    from: query.from,
    to: query.to,
  });
  sendData(res, result.items, 200, result.meta);
});
