import type { ClientSession, HydratedDocument } from "mongoose";
import { withOptionalTransaction } from "../database/connect.js";
import { Counter } from "../database/models/counter.js";
import { Invoice, type InvoiceDocument } from "../database/models/invoice.js";
import { Payment } from "../database/models/payment.js";
import { AppError } from "../utils/http-error.js";
import { recordAudit } from "./audit.service.js";
import type { Request } from "express";

type PaymentActor = { id: string; name: string; email: string; role: string };

type RecordPaymentInput = {
  invoiceId: string;
  amount: string;
  method: string;
  reference?: string;
  receivedAt?: string;
  notes?: string;
};

async function nextNumber(key: string, prefix: string, session?: ClientSession) {
  const counter = await Counter.findByIdAndUpdate(
    key,
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true, ...(session ? { session } : {}) }
  );
  return `${prefix}-${String(counter!.seq).padStart(4, "0")}`;
}

function paymentAmountMinor(value: unknown): number {
  const amount = Math.round(Number(value) * 100);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw AppError.badRequest("Enter a payment amount greater than zero");
  }
  return amount;
}

function paymentReceivedAt(value: string | undefined): Date {
  if (!value) return new Date();
  const receivedAt = new Date(value);
  if (Number.isNaN(receivedAt.getTime())) {
    throw AppError.badRequest("Enter a valid payment date");
  }
  return receivedAt;
}

function applyPayment(
  invoice: HydratedDocument<InvoiceDocument>,
  amountMinor: number
): void {
  const amountPaidMinor = (invoice.amountPaidMinor ?? 0) + amountMinor;
  invoice.amountPaidMinor = amountPaidMinor;
  invoice.balanceMinor = Math.max(0, invoice.totalMinor - amountPaidMinor);
  invoice.status = invoice.balanceMinor === 0 ? "paid" : "partially_paid";
}

export async function listPayments(options: { page?: number; limit?: number; search?: string; invoiceId?: string; status?: string } = {}) {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(100, Math.max(1, options.limit ?? 9));
  const filter: Record<string, unknown> = {};
  if (options.invoiceId) filter.invoiceId = options.invoiceId;
  if (options.status?.trim()) filter.verificationStatus = options.status.trim();
  if (options.search?.trim()) {
    const regex = new RegExp(options.search.trim(), "i");
    filter.$or = [{ number: regex }, { reference: regex }, { method: regex }];
  }
  const total = await Payment.countDocuments(filter);
  const data = await Payment.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  return { data, total, page, limit };
}

export async function recordPayment(input: RecordPaymentInput, actor: PaymentActor, req?: Request) {
  const amountMinor = paymentAmountMinor(input.amount);

  const payment = await withOptionalTransaction(async (session) => {
    const invoice = await Invoice.findById(input.invoiceId).session(session ?? null);
    if (!invoice) throw AppError.notFound("Invoice not found");
    if (invoice.status === "draft") {
      throw AppError.badRequest("Issue this invoice before recording a payment");
    }
    if (invoice.status === "void") {
      throw AppError.badRequest("Payments cannot be recorded against a void invoice");
    }

    const balanceMinor = Math.max(
      0,
      invoice.totalMinor - (invoice.amountPaidMinor ?? 0)
    );
    if (balanceMinor === 0) {
      throw AppError.conflict("This invoice is already fully paid");
    }
    if (amountMinor > balanceMinor) {
      throw AppError.badRequest("Payment amount exceeds the remaining invoice balance");
    }

    const payment = new Payment({
      invoiceId: invoice._id,
      clientId: invoice.clientId,
      number: await nextNumber("payment", "PAY", session),
      amountMinor,
      currency: invoice.currency,
      method: input.method,
      reference: input.reference,
      receivedAt: paymentReceivedAt(input.receivedAt),
      verificationStatus: "verified",
      notes: input.notes,
    });
    await payment.save(session ? { session } : {});

    applyPayment(invoice, amountMinor);
    await invoice.save(session ? { session } : {});

    return payment;
  });

  await recordAudit({ actor, action: "payment.recorded", entityType: "Payment", entityId: String(payment._id), req });
  return payment;
}

export async function verifyPayment(id: string, actor: PaymentActor, req?: Request) {
  const payment = await withOptionalTransaction(async (session) => {
    const payment = await Payment.findById(id).session(session ?? null);
    if (!payment) throw AppError.notFound("Payment not found");
    if (payment.verificationStatus !== "pending") {
      throw AppError.badRequest("Payment already processed");
    }

    const invoice = await Invoice.findById(payment.invoiceId).session(session ?? null);
    if (!invoice) throw AppError.notFound("Invoice not found");
    if (invoice.status === "draft") {
      throw AppError.badRequest("Issue this invoice before verifying a payment");
    }
    if (invoice.status === "void") {
      throw AppError.badRequest("Payments cannot be verified against a void invoice");
    }

    const balanceMinor = Math.max(
      0,
      invoice.totalMinor - (invoice.amountPaidMinor ?? 0)
    );
    if (payment.amountMinor > balanceMinor) {
      throw AppError.badRequest("Payment amount exceeds the remaining invoice balance");
    }

    payment.verificationStatus = "verified";
    await payment.save(session ? { session } : {});

    applyPayment(invoice, payment.amountMinor);
    await invoice.save(session ? { session } : {});

    return payment;
  });

  await recordAudit({ actor, action: "payment.verified", entityType: "Payment", entityId: id, req });
  return payment;
}
