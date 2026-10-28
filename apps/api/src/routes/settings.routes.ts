import { Router } from "express";
import { settingsUpdateSchema } from "@vraunix/shared";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { parseInput } from "../middleware/validate.js";
import { recordAudit } from "../services/audit.service.js";
import {
  getSettings,
  updateSettings,
} from "../services/settings.service.js";
import { sendData } from "../utils/response.js";
import { actorFrom } from "./helpers.js";

export const settingsRouter = Router();

settingsRouter.use(authenticate);

settingsRouter.get("/", async (_req, res) => {
  sendData(res, await getSettings());
});

const handleUpdateSettings = async (req: any, res: any) => {
  const input = parseInput(settingsUpdateSchema, req.body);
  const actor = actorFrom(req);
  const settings = await updateSettings(input, actor.id);
  await recordAudit({
    actor,
    action: "settings.updated",
    entityType: "Settings",
    entityId: String(settings._id),
    metadata: { sections: Object.keys(input) },
    req,
  });
  sendData(res, settings);
};

settingsRouter.patch("/", requireAdmin, handleUpdateSettings);
settingsRouter.put("/", requireAdmin, handleUpdateSettings);
