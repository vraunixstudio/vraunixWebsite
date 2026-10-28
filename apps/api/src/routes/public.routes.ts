import { Router } from "express";
import { getSettings, toPublicSettings } from "../services/settings.service.js";
import { submitInquiry } from "../services/inquiry.service.js";
import { sendData } from "../utils/response.js";

export const publicRouter = Router();

publicRouter.get("/settings", async (_req, res) => {
  const settings = await getSettings();
  sendData(res, toPublicSettings(settings));
});

publicRouter.post("/contact", async (req, res) => {
  const { name, email, businessName, phone, message } = req.body;
  const inquiry = await submitInquiry({
    name,
    email,
    businessName,
    phone,
    message,
    source: "contact",
  });

  sendData(res, {
    reference: inquiry._id.toString(),
    receivedAt: inquiry.createdAt,
  }, 201);
});
