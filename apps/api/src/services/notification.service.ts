import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import nodemailer, { type Transporter } from "nodemailer";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { getSettings } from "./settings.service.js";

export type EmailDelivery = {
  sent: boolean;
  delivery: "sent" | "skipped_not_configured" | "failed";
  error?: string;
};

export type EmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  kind: string;
};

let transporter: Transporter | null = null;

function getTransport(): Transporter | null {
  if (!env.mailConfigured) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      secure: env.MAIL_SECURE,
      auth:
        env.MAIL_USER && env.MAIL_PASSWORD
          ? { user: env.MAIL_USER, pass: env.MAIL_PASSWORD }
          : undefined,
    });
  }
  return transporter;
}

async function writeDevEmail(input: EmailInput, reason: string): Promise<void> {
  if (env.isTest) return;
  try {
    const dir = path.join(env.storageDir, "outbox");
    await mkdir(dir, { recursive: true });
    const fileName = `${new Date().toISOString().replace(/[:.]/g, "-")}-${input.kind}.json`;
    await writeFile(
      path.join(dir, fileName),
      JSON.stringify(
        { ...input, createdAt: new Date().toISOString(), delivery: reason },
        null,
        2
      ),
      "utf8"
    );
    logger.warn(
      { to: input.to, subject: input.subject, kind: input.kind, file: fileName },
      "Email not sent because mail is not configured; saved to development outbox"
    );
  } catch (error) {
    logger.warn({ err: error, kind: input.kind }, "Could not write development outbox email");
  }
}

export async function sendEmail(input: EmailInput): Promise<EmailDelivery> {
  const transport = getTransport();
  if (!transport) {
    await writeDevEmail(input, "skipped_not_configured");
    return { sent: false, delivery: "skipped_not_configured" };
  }

  let from = env.MAIL_FROM;
  if (!from) {
    try {
      const settings = await getSettings();
      from = `${settings.email.fromName ?? settings.company.name} <${settings.email.fromEmail}>`;
    } catch {
      from = "Vraunix Studio <no-reply@localhost>";
    }
  }

  try {
    await transport.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
    logger.info({ kind: input.kind }, "Email sent");
    return { sent: true, delivery: "sent" };
  } catch (error) {
    logger.error({ err: error, kind: input.kind }, "Email delivery failed");
    return {
      sent: false,
      delivery: "failed",
      error: error instanceof Error ? error.message : "Unknown email error",
    };
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendNewEnquiryNotification(input: {
  to: string;
  reference: string;
  name: string;
  businessName?: string;
  source: string;
}): Promise<EmailDelivery> {
  const subject = `New ${input.source} enquiry — ${input.reference}`;
  const text = [
    `A new enquiry has been received.`,
    "",
    `Reference: ${input.reference}`,
    `Contact: ${input.name}`,
    input.businessName ? `Business: ${input.businessName}` : "",
    `Source: ${input.source}`,
    "",
    "Sign in to the Vraunix Studio dashboard to review the full submission.",
  ]
    .filter(Boolean)
    .join("\n");
  return sendEmail({
    to: input.to,
    subject,
    text,
    kind: "new_enquiry",
  });
}
