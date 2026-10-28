import type { StaffRole } from "../constants/status.js";

export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: PaginationMeta;
};

export type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
};

export type SessionResponse = {
  user: SessionUser;
  session: {
    expiresAt: string;
  };
};

export type PublicSettings = {
  company: {
    name: string;
    slogan: string;
    description: string;
    email: string;
    phone?: string;
    location?: string;
    website?: string;
  };
  currency: { default: string };
  discovery: {
    budgetRanges: string[];
    timelines: string[];
    currencies: string[];
  };
};

export type DashboardOverview = {
  activeClients: number;
  newClients: number;
  activeProjects: number;
  proposalsAwaiting: number;
  unpaidInvoices: { count: number; balanceMinor: number };
  overdueInvoices: { count: number; balanceMinor: number };
  verifiedPayments: { count: number; amountMinor: number };
  maintenanceDue: number;
  openTickets: number;
  revenueTrend: {
    month: string;
    invoicedMinor: number;
    collectedMinor: number;
  }[];
  proposalPipeline: { status: string; count: number }[];
  projectMix: { status: string; count: number }[];
  recentClients: {
    id: string;
    name: string;
    contactName?: string;
    email: string;
    country?: string;
    createdAt: string;
  }[];
  upcomingInvoices: {
    id: string;
    number: string;
    clientName: string;
    dueDate: string;
    totalMinor: number;
    balanceMinor: number;
    currency: string;
    status: string;
  }[];
  recentActivity: {
    id: string;
    action: string;
    actorName: string;
    createdAt: string;
  }[];
};
