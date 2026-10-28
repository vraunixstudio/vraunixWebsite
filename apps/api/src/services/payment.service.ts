import { Counter } from "../database/models/counter.js";
import { Invoice } from "../database/models/invoice.js";
import { Payment } from "../database/models/payment.js";
import { AppError } from "../utils/http-error.js";
import { recordAudit } from "./audit.service.js";
import type { Request } from "express";

async function nextNumber(key: string, prefix: string) {
  const counter = await Counter.findByIdAndUpdate(key, { $inc: { seq: 1 } }, { new: true, upsert: true });
  return `${prefix}-${String(counter!.seq).padStart(4, "0")}`;
}

export async function listPayments(options: { page?: number; limit?: number; search?: string; invoiceId?: string; status?: string } = {}) {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(100, Math.max(1, options.limit ?? 9));
  const filter: Record<string, unknown> = {};
  if (options.invoiceId) filter.invoiceId = options.invoiceId;
  if (options.status?.trim()) filter.verificationStatus = options.status.trim();
  const total = await Payment.countDocuments(filter);
  const data = await Payment.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  return { data, total, page, limit };
}

export async function recordPayment(input: Record<string, unknown>, actor: { id: string; name: string; email: string; role: string }, req?: Request) {
  const invoice = await Invoice.findById(input.invoiceId);
  if (!invoice) throw AppError.notFound("Invoice not found");
  const amountMinor = Math.round(Number(input.amount) * 100);
  const payment = await Payment.create({
    ...input,
    amountMinor,
    number: await nextNumber("payment", "PAY"),
    currency: invoice.currency,
    receivedAt: input.receivedAt ? new Date(input.receivedAt as string) : new Date(),
    verificationStatus: "pending",
  });
  await recordAudit({ actor, action: "payment.recorded", entityType: "Payment", entityId: String(payment._id), req });
  return payment;
}

export async function verifyPayment(id: string, actor: { id: string; name: string; email: string; role: string }, req?: Request) {
  const payment = await Payment.findById(id);
  if (!payment) throw AppError.notFound("Payment not found");
  if (payment.verificationStatus !== "pending") throw AppError.badRequest("Payment already processed");
  payment.verificationStatus = "verified";
  await payment.save();
  const invoice = await Invoice.findById(payment.invoiceId);
  if (invoice) {
    invoice.amountPaidMinor += payment.amountMinor;
    invoice.balanceMinor = Math.max(0, invoice.totalMinor - invoice.amountPaidMinor);
    if (invoice.balanceMinor === 0) invoice.status = "paid";
    else invoice.status = "partially_paid";
    await invoice.save();
  }
  await recordAudit({ actor, action: "payment.verified", entityType: "Payment", entityId: id, req });
  return payment;
}