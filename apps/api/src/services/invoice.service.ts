import { Counter } from "../database/models/counter.js";
import { Invoice } from "../database/models/invoice.js";
import { AppError } from "../utils/http-error.js";
import { recordAudit } from "./audit.service.js";
import type { Request } from "express";

async function nextNumber(key: string, prefix: string) {
  const counter = await Counter.findByIdAndUpdate(key, { $inc: { seq: 1 } }, { new: true, upsert: true });
  return `${prefix}-${String(counter!.seq).padStart(4, "0")}`;
}

function calcTotals(lineItems: { quantity: string; unitPriceMinor: number }[], discount: { type: "fixed" | "percent"; value: string } | undefined, taxRatePercent: string) {
  const subtotalMinor = lineItems.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (item.unitPriceMinor || 0), 0);
  let discountMinor = 0;
  if (discount?.type === "fixed") discountMinor = Math.round(Number(discount.value) * 100);
  if (discount?.type === "percent") discountMinor = Math.round(subtotalMinor * (Number(discount.value) / 100));
  const taxable = Math.max(0, subtotalMinor - discountMinor);
  const taxMinor = Math.round(taxable * (Number(taxRatePercent) / 100));
  const totalMinor = taxable + taxMinor;
  return { subtotalMinor, discountMinor, taxMinor, totalMinor };
}

export async function listInvoices(options: { page?: number; limit?: number; search?: string; clientId?: string; status?: string } = {}) {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(100, Math.max(1, options.limit ?? 9));
  const filter: Record<string, unknown> = {};
  if (options.clientId) filter.clientId = options.clientId;
  if (options.status?.trim()) filter.status = options.status.trim();
  if (options.search?.trim()) {
    const regex = new RegExp(options.search.trim(), "i");
    filter.$or = [{ number: regex }];
  }
  const total = await Invoice.countDocuments(filter);
  const data = await Invoice.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  return { data, total, page, limit };
}

export async function getInvoice(id: string) {
  const invoice = await Invoice.findById(id).lean();
  if (!invoice) throw AppError.notFound("Invoice not found");
  return invoice;
}

export async function createInvoice(input: Record<string, unknown>, actor: { id: string; name: string; email: string; role: string }, req?: Request) {
  const number = await nextNumber("invoice", "INV");
  const rawLines = (input.lineItems as unknown[]) ?? [];
  const lineItems = rawLines.map((item) => {
    const row = item as Record<string, unknown>;
    const unitPriceMinor =
      typeof row.unitPriceMinor === "number"
        ? row.unitPriceMinor
        : Math.round(Number(row.unitPrice ?? 0) * 100);
    const quantity = String(row.quantity ?? "1");
    const amountMinor = Math.round((Number(quantity) || 0) * unitPriceMinor);
    return {
      description: String(row.description ?? ""),
      quantity,
      unitPriceMinor,
      amountMinor,
    };
  });
  const discount = input.discount as { type: "fixed" | "percent"; value: string } | undefined;
  const taxRatePercent = String(input.taxRatePercent ?? "0");
  const totals = calcTotals(lineItems, discount, taxRatePercent);
  const invoice = await Invoice.create({
    ...input,
    lineItems,
    number,
    taxRatePercent,
    ...totals,
    amountPaidMinor: 0,
    balanceMinor: totals.totalMinor,
    status: "draft",
  });
  await recordAudit({ actor, action: "invoice.created", entityType: "Invoice", entityId: String(invoice._id), req });
  return invoice;
}

export async function updateInvoice(id: string, input: Record<string, unknown>, actor: { id: string; name: string; email: string; role: string }, req?: Request) {
  const invoice = await Invoice.findById(id);
  if (!invoice) throw AppError.notFound("Invoice not found");
  if (invoice.status !== "draft") throw AppError.badRequest("Only draft invoices can be edited");
  const lineItems = (input.lineItems as unknown[]) ?? invoice.lineItems;
  const discount = (input.discount as { type: "fixed" | "percent"; value: string } | undefined) ?? invoice.discount;
  const taxRatePercent = String(input.taxRatePercent ?? invoice.taxRatePercent);
  const totals = calcTotals(lineItems as { quantity: string; unitPriceMinor: number }[], discount, taxRatePercent);
  Object.assign(invoice, input, totals);
  invoice.balanceMinor = totals.totalMinor - invoice.amountPaidMinor;
  await invoice.save();
  await recordAudit({ actor, action: "invoice.updated", entityType: "Invoice", entityId: id, req });
  return invoice;
}

export async function issueInvoice(id: string, actor: { id: string; name: string; email: string; role: string }, req?: Request) {
  const invoice = await Invoice.findById(id);
  if (!invoice) throw AppError.notFound("Invoice not found");
  if (invoice.status !== "draft") throw AppError.badRequest("Only draft invoices can be issued");
  invoice.status = "issued";
  await invoice.save();
  await recordAudit({ actor, action: "invoice.issued", entityType: "Invoice", entityId: id, req });
  return invoice;
}