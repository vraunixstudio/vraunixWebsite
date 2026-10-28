import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { getDashboardOverview } from "../services/overview.service.js";
import { sendData } from "../utils/response.js";

export const overviewRouter = Router();

overviewRouter.use(authenticate);

overviewRouter.get("/", async (req, res) => {
  sendData(res, await getDashboardOverview());
});
