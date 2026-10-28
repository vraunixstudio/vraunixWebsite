import { connectDatabase, disconnectDatabase } from "../database/connect.js";
import { ensureSettings } from "../services/settings.service.js";
import { Client } from "../database/models/client.js";
import { Inquiry } from "../database/models/inquiry.js";
import { Proposal } from "../database/models/proposal.js";
import { Project } from "../database/models/project.js";
import { Invoice } from "../database/models/invoice.js";
import { Payment } from "../database/models/payment.js";
import { User } from "../database/models/user.js";
import { hashPassword } from "../services/password.service.js";
import { logger } from "../utils/logger.js";

async function main(): Promise<void> {
  await connectDatabase();
  await ensureSettings();

  const admin = await User.findOne({ email: "admin@vraunix.example" });
  if (!admin) {
    await User.create({
      name: "Vraunix Administrator",
      email: "admin@vraunix.example",
      passwordHash: await hashPassword("VraunixAdmin2026!"),
      role: "admin",
      active: true,
    });
  }

  const clientDocs = Array.from({ length: 100 }, (_, i) => ({
    name: `Client ${i + 1}`,
    contactName: `Contact ${i + 1}`,
    email: `client${i + 1}@example.com`,
    phone: `+977 98${String(i + 1).padStart(8, "0")}`,
    country: i % 2 === 0 ? "Nepal" : "India",
    status: "active" as const,
  }));
  const clients = await Client.insertMany(clientDocs);

  const inquiryDocs = Array.from({ length: 100 }, (_, i) => ({
    name: `Inquirer ${i + 1}`,
    email: `inquiry${i + 1}@example.com`,
    businessName: `Business ${i + 1}`,
    message: `Need website ${i + 1}`,
    source: i % 2 === 0 ? ("contact" as const) : ("discovery" as const),
    status: (["new", "contacted", "qualified", "converted", "closed"] as const)[i % 5],
  }));
  await Inquiry.insertMany(inquiryDocs);

  const proposalDocs = Array.from({ length: 100 }, (_, i) => ({
    clientId: clients[i % clients.length]!._id,
    number: `PROP-${String(i + 1).padStart(4, "0")}`,
    title: `Proposal ${i + 1}`,
    description: `Proposal description ${i + 1}`,
    scope: [`Scope item ${i + 1}`],
    pricing: { currency: "NPR", totalMinor: (i + 1) * 100000, lines: [{ description: `Line ${i + 1}`, quantity: "1", unitPriceMinor: (i + 1) * 100000 }] },
    status: (["draft", "sent", "accepted", "declined", "expired"] as const)[i % 5],
  }));
  const proposals = await Proposal.insertMany(proposalDocs);

  const projectDocs = Array.from({ length: 100 }, (_, i) => ({
    clientId: clients[i % clients.length]!._id,
    proposalId: proposals[i % proposals.length]!._id,
    name: `Project ${i + 1}`,
    description: `Project description ${i + 1}`,
    status: (["planning", "in_progress", "client_review", "completed", "on_hold"] as const)[i % 5],
    priceMinor: (i + 1) * 100000,
    currency: "NPR",
    deliverables: [`Deliverable ${i + 1}`],
    milestones: [{ name: `Milestone ${i + 1}`, status: "pending" as const }],
  }));
  const projects = await Project.insertMany(projectDocs);

  const invoiceDocs = Array.from({ length: 100 }, (_, i) => {
    const total = (i + 1) * 100000;
    return {
      clientId: clients[i % clients.length]!._id,
      projectId: projects[i % projects.length]!._id,
      number: `INV-${String(i + 1).padStart(4, "0")}`,
      currency: "NPR",
      issueDate: new Date(),
      dueDate: new Date(Date.now() + (i + 1) * 86400000),
      lineItems: [{ description: `Invoice line ${i + 1}`, quantity: "1", unitPriceMinor: total, amountMinor: total }],
      subtotalMinor: total,
      discountMinor: 0,
      taxRatePercent: "0",
      taxMinor: 0,
      totalMinor: total,
      amountPaidMinor: i % 2 === 0 ? total : 0,
      balanceMinor: i % 2 === 0 ? 0 : total,
      status: (i % 2 === 0 ? "paid" : "issued") as "paid" | "issued",
    };
  });
  const invoices = await Invoice.insertMany(invoiceDocs);

  const paymentDocs = Array.from({ length: 100 }, (_, i) => ({
    invoiceId: invoices[i % invoices.length]!._id,
    clientId: clients[i % clients.length]!._id,
    number: `PAY-${String(i + 1).padStart(4, "0")}`,
    amountMinor: (i + 1) * 100000,
    currency: "NPR",
    method: "bank_transfer",
    receivedAt: new Date(),
    verificationStatus: "verified" as const,
  }));
  await Payment.insertMany(paymentDocs);

  logger.info("Seeded 100 records for each entity");
}

main()
  .catch((error) => {
    logger.fatal({ err: error }, "Demo seed failed");
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase().catch(() => undefined);
  });