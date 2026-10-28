import type { DashboardOverview } from "@vraunix/shared";
import { Client } from "../database/models/client.js";
import { Proposal } from "../database/models/proposal.js";
import { Project } from "../database/models/project.js";
import { Invoice } from "../database/models/invoice.js";
import { Payment } from "../database/models/payment.js";

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const activeClients = await Client.countDocuments({ status: "active" });
  const newClients = await Client.countDocuments({ createdAt: { $gte: monthStart } });
  const activeProjects = await Project.countDocuments({ status: { $in: ["planning", "in_progress", "client_review"] } });
  const proposalsAwaiting = await Proposal.countDocuments({ status: "sent" });

  const unpaidAgg = await Invoice.aggregate<{ count: number; balance: number }>([
    { $match: { balanceMinor: { $gt: 0 }, status: { $ne: "void" } } },
    { $group: { _id: null, count: { $sum: 1 }, balance: { $sum: "$balanceMinor" } } },
  ]);
  const overdueAgg = await Invoice.aggregate<{ count: number; balance: number }>([
    { $match: { status: "overdue" } },
    { $group: { _id: null, count: { $sum: 1 }, balance: { $sum: "$balanceMinor" } } },
  ]);
  const paymentAgg = await Payment.aggregate<{ count: number; amount: number }>([
    { $match: { verificationStatus: "verified" } },
    { $group: { _id: null, count: { $sum: 1 }, amount: { $sum: "$amountMinor" } } },
  ]);

  const invoiceMonths = await Invoice.aggregate<{ _id: string; total: number }>([
    { $match: { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } } },
    { $group: { _id: { $dateToString: { format: "%b", date: "$createdAt" } }, total: { $sum: "$totalMinor" } } },
  ]);
  const paymentMonths = await Payment.aggregate<{ _id: string; total: number }>([
    { $match: { verificationStatus: "verified", createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } } },
    { $group: { _id: { $dateToString: { format: "%b", date: "$createdAt" } }, total: { $sum: "$amountMinor" } } },
  ]);

  const proposalPipeline = await Proposal.aggregate<{ _id: string; count: number }>([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const projectMix = await Project.aggregate<{ _id: string; count: number }>([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const recentClients = await Client.find().sort({ createdAt: -1 }).limit(5).lean();
  const upcomingInvoices = await Invoice.find({ balanceMinor: { $gt: 0 }, status: { $ne: "void" } })
    .sort({ dueDate: 1 })
    .limit(6)
    .populate("clientId", "name")
    .lean();

  const recentProposals = await Proposal.find().sort({ updatedAt: -1 }).limit(5).lean();
  const recentInvoiceList = await Invoice.find().sort({ updatedAt: -1 }).limit(5).lean();

  const revenueTrend = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const key = months[date.getMonth()] ?? "";
    const invoiced = invoiceMonths.find((row) => row._id === key)?.total ?? 0;
    const collected = paymentMonths.find((row) => row._id === key)?.total ?? 0;
    return { month: key, invoicedMinor: invoiced, collectedMinor: collected };
  });

  return {
    activeClients,
    newClients,
    activeProjects,
    proposalsAwaiting,
    unpaidInvoices: { count: unpaidAgg[0]?.count ?? 0, balanceMinor: unpaidAgg[0]?.balance ?? 0 },
    overdueInvoices: { count: overdueAgg[0]?.count ?? 0, balanceMinor: overdueAgg[0]?.balance ?? 0 },
    verifiedPayments: { count: paymentAgg[0]?.count ?? 0, amountMinor: paymentAgg[0]?.amount ?? 0 },
    maintenanceDue: 0,
    openTickets: 0,
    revenueTrend,
    proposalPipeline: proposalPipeline.map((row) => ({ status: row._id, count: row.count })),
    projectMix: projectMix.map((row) => ({ status: row._id, count: row.count })),
    recentClients: recentClients.map((client) => ({
      id: String(client._id),
      name: client.name,
      contactName: client.contactName,
      email: client.email,
      country: client.country,
      createdAt: client.createdAt.toISOString(),
    })),
    upcomingInvoices: upcomingInvoices.map((invoice) => {
      const client = invoice.clientId as unknown as { name?: string } | null;
      return {
        id: String(invoice._id),
        number: invoice.number,
        clientName: client?.name ?? "Client",
        dueDate: invoice.dueDate.toISOString(),
        totalMinor: invoice.totalMinor,
        balanceMinor: invoice.balanceMinor,
        currency: invoice.currency,
        status: invoice.status,
      };
    }),
    recentActivity: [
      ...recentProposals.map((proposal) => ({
        id: `proposal-${proposal._id}`,
        action: `Proposal ${proposal.number} · ${proposal.title}`,
        actorName: proposal.status,
        createdAt: proposal.updatedAt.toISOString(),
      })),
      ...recentInvoiceList.map((invoice) => ({
        id: `invoice-${invoice._id}`,
        action: `Invoice ${invoice.number} · ${invoice.status}`,
        actorName: "system",
        createdAt: invoice.updatedAt.toISOString(),
      })),
    ]
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 10),
  };
}