import { randomUUID } from "node:crypto";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { connectDatabase, disconnectDatabase } from "../src/database/connect.js";
import { Client } from "../src/database/models/client.js";
import { Invoice } from "../src/database/models/invoice.js";
import { Payment } from "../src/database/models/payment.js";
import { Session } from "../src/database/models/session.js";
import { User } from "../src/database/models/user.js";
import { hashPassword } from "../src/services/password.service.js";
import { recordPayment, verifyPayment } from "../src/services/payment.service.js";

const actor = {
  id: "payment-test-admin",
  name: "Payment Test Admin",
  email: "payments@example.test",
  role: "admin",
};

const createdClientIds: string[] = [];
const createdInvoiceIds: string[] = [];
const createdPaymentIds: string[] = [];
const createdUserIds: string[] = [];

async function createInvoice(options: { status?: "draft" | "issued"; totalMinor?: number } = {}) {
  const suffix = randomUUID();
  const client = await Client.create({
    name: `Payment Test Client ${suffix}`,
    email: `payment-test-${suffix}@example.test`,
    status: "active",
  });
  createdClientIds.push(String(client._id));

  const totalMinor = options.totalMinor ?? 100_000;
  const invoice = await Invoice.create({
    clientId: client._id,
    number: `PAY-TEST-${suffix}`,
    currency: "NPR",
    issueDate: new Date(),
    dueDate: new Date(Date.now() + 86_400_000),
    lineItems: [
      {
        description: "Payment test line",
        quantity: "1",
        unitPriceMinor: totalMinor,
        amountMinor: totalMinor,
      },
    ],
    subtotalMinor: totalMinor,
    discountMinor: 0,
    taxRatePercent: "0",
    taxMinor: 0,
    totalMinor,
    amountPaidMinor: 0,
    balanceMinor: totalMinor,
    status: options.status ?? "issued",
  });
  createdInvoiceIds.push(String(invoice._id));
  return invoice;
}

beforeAll(async () => {
  await connectDatabase();
});

afterAll(async () => {
  await Payment.deleteMany({ invoiceId: { $in: createdInvoiceIds } });
  await Invoice.deleteMany({ _id: { $in: createdInvoiceIds } });
  await Client.deleteMany({ _id: { $in: createdClientIds } });
  await Payment.deleteMany({ _id: { $in: createdPaymentIds } });
  await Session.deleteMany({ userId: { $in: createdUserIds } });
  await User.deleteMany({ _id: { $in: createdUserIds } });
  await disconnectDatabase();
});

describe("payment recording", () => {
  it("records the amount in minor units, links the client, and applies it to the invoice", async () => {
    const invoice = await createInvoice();

    const payment = await recordPayment(
      {
        invoiceId: String(invoice._id),
        amount: "500.25",
        method: "bank_transfer",
        receivedAt: "2026-10-29",
      },
      actor
    );
    createdPaymentIds.push(String(payment._id));

    expect(payment.amountMinor).toBe(50_025);
    expect(String(payment.clientId)).toBe(String(invoice.clientId));
    expect(payment.verificationStatus).toBe("verified");

    const updated = await Invoice.findById(invoice._id).lean();
    expect(updated?.amountPaidMinor).toBe(50_025);
    expect(updated?.balanceMinor).toBe(49_975);
    expect(updated?.status).toBe("partially_paid");
  });

  it("marks an invoice paid when the final balance is cleared", async () => {
    const invoice = await createInvoice();

    const payment = await recordPayment(
      {
        invoiceId: String(invoice._id),
        amount: "1000.00",
        method: "cash",
      },
      actor
    );
    createdPaymentIds.push(String(payment._id));

    const updated = await Invoice.findById(invoice._id).lean();
    expect(updated?.amountPaidMinor).toBe(100_000);
    expect(updated?.balanceMinor).toBe(0);
    expect(updated?.status).toBe("paid");

    await expect(
      recordPayment(
        {
          invoiceId: String(invoice._id),
          amount: "1.00",
          method: "cash",
        },
        actor
      )
    ).rejects.toThrow("already fully paid");
  });

  it("rejects overpayments and payments against draft invoices", async () => {
    const invoice = await createInvoice();
    const draft = await createInvoice({ status: "draft" });

    await expect(
      recordPayment(
        {
          invoiceId: String(invoice._id),
          amount: "1000.01",
          method: "bank_transfer",
        },
        actor
      )
    ).rejects.toThrow("remaining invoice balance");

    await expect(
      recordPayment(
        {
          invoiceId: String(draft._id),
          amount: "10.00",
          method: "bank_transfer",
        },
        actor
      )
    ).rejects.toThrow("Issue this invoice");

    expect(await Payment.countDocuments({ invoiceId: invoice._id })).toBe(0);
    expect(await Payment.countDocuments({ invoiceId: draft._id })).toBe(0);
  });

  it("verifies a pending payment exactly once", async () => {
    const invoice = await createInvoice();
    const payment = await Payment.create({
      invoiceId: invoice._id,
      clientId: invoice.clientId,
      number: `PAY-TEST-${randomUUID()}`,
      amountMinor: 25_000,
      currency: invoice.currency,
      method: "bank_transfer",
      receivedAt: new Date(),
      verificationStatus: "pending",
    });
    createdPaymentIds.push(String(payment._id));

    const verified = await verifyPayment(String(payment._id), actor);
    expect(verified.verificationStatus).toBe("verified");

    const updated = await Invoice.findById(invoice._id).lean();
    expect(updated?.amountPaidMinor).toBe(25_000);
    expect(updated?.balanceMinor).toBe(75_000);
    expect(updated?.status).toBe("partially_paid");

    await expect(verifyPayment(String(payment._id), actor)).rejects.toThrow(
      "already processed"
    );
  });

  it("records a payment through the authenticated HTTP API", async () => {
    const invoice = await createInvoice();
    const suffix = randomUUID();
    const password = "PaymentTestPassword1";
    const user = await User.create({
      name: "Payment Route Admin",
      email: `payment-route-${suffix}@example.test`,
      passwordHash: await hashPassword(password),
      role: "admin",
      active: true,
      passwordChangedAt: new Date(),
    });
    createdUserIds.push(String(user._id));

    const agent = request.agent(createApp());
    const loginCsrf = await agent.get("/api/v1/auth/csrf").expect(200);
    await agent
      .post("/api/v1/auth/login")
      .set("x-csrf-token", loginCsrf.body.data.csrfToken)
      .send({ email: user.email, password })
      .expect(200);

    const paymentCsrf = await agent.get("/api/v1/auth/csrf").expect(200);
    const response = await agent
      .post("/api/v1/payments")
      .set("x-csrf-token", paymentCsrf.body.data.csrfToken)
      .send({
        invoiceId: String(invoice._id),
        amount: "125.50",
        method: "bank_transfer",
        receivedAt: "2026-10-29",
      })
      .expect(201);

    createdPaymentIds.push(response.body.data.id);
    expect(response.body.data.amountMinor).toBe(12_550);
    expect(response.body.data.clientId).toBe(String(invoice.clientId));
    expect(response.body.data.verificationStatus).toBe("verified");

    const updated = await Invoice.findById(invoice._id).lean();
    expect(updated?.amountPaidMinor).toBe(12_550);
    expect(updated?.balanceMinor).toBe(87_450);
    expect(updated?.status).toBe("partially_paid");
  });
});
