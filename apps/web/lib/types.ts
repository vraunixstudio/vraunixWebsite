import type { StaffRole } from "@vraunix/shared";

export type JsonRecord = Record<string, unknown>;

export type RefRecord = {
  id: string;
  name?: string;
  email?: string;
  number?: string;
  title?: string;
  status?: string;
  totalMinor?: number;
  balanceMinor?: number;
  currency?: string;
  role?: StaffRole;
};

export type LeadActivity = {
  id?: string;
  kind: string;
  message: string;
  actorName?: string;
  at: string;
};

export type Lead = {
  id: string;
  reference: string;
  source: "discovery" | "contact";
  status: string;
  assignedTo?: RefRecord | null;
  clientId?: RefRecord | null;
  contact: {
    fullName: string;
    businessName?: string;
    email: string;
    phone?: string;
    country?: string;
    existingWebsite?: string;
  };
  projectTypes: string[];
  goals?: JsonRecord;
  requirements?: JsonRecord;
  budget?: JsonRecord;
  timeline?: JsonRecord;
  maintenance?: JsonRecord;
  additional?: JsonRecord;
  enquiryMessage?: string;
  preferredContactMethod?: string;
  reviewed?: JsonRecord;
  activities: LeadActivity[];
  createdAt: string;
  updatedAt: string;
};

export type Client = {
  id: string;
  name: string;
  contactName?: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  country?: string;
  taxId?: string;
  billing?: { name?: string; email?: string; address?: string };
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  businessName?: string;
  phone?: string;
  message?: string;
  source: "discovery" | "contact";
  status: "new" | "contacted" | "qualified" | "converted" | "closed";
  clientId?: string;
  createdAt: string;
  updatedAt: string;
};

export type Proposal = {
  id: string;
  number: string;
  clientId: string;
  title: string;
  description?: string;
  scope?: string[];
  pricing: {
    currency: string;
    totalMinor: number;
    lines?: { description: string; quantity: string; unitPriceMinor: number }[];
  };
  status: "draft" | "sent" | "accepted" | "declined" | "expired";
  sentAt?: string;
  acceptedAt?: string;
  declinedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type Project = {
  id: string;
  clientId: string;
  proposalId?: string;
  name: string;
  description?: string;
  status: "planning" | "in_progress" | "client_review" | "completed" | "on_hold" | "cancelled";
  priceMinor?: number;
  currency: string;
  startDate?: string;
  targetDate?: string;
  deliverables: string[];
  milestones: { name: string; dueDate?: string; status: "pending" | "in_progress" | "completed" }[];
  createdAt: string;
  updatedAt: string;
};

export type Invoice = {
  id: string;
  number: string;
  clientId: string;
  projectId?: string;
  status: "draft" | "issued" | "partially_paid" | "paid" | "overdue" | "void";
  currency: string;
  issueDate: string;
  dueDate: string;
  lineItems: { description: string; quantity: string; unitPriceMinor: number; amountMinor: number }[];
  subtotalMinor: number;
  discountMinor: number;
  taxRatePercent: string;
  taxMinor: number;
  totalMinor: number;
  amountPaidMinor: number;
  balanceMinor: number;
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt: string;
};

export type Payment = {
  id: string;
  number: string;
  invoiceId: string;
  clientId: string;
  amountMinor: number;
  currency: string;
  method: string;
  reference?: string;
  receivedAt: string;
  verificationStatus: "pending" | "verified" | "rejected";
  notes?: string;
  createdAt: string;
};
export type Maintenance = {
  id: string;
  clientId?: RefRecord | null;
  projectId?: RefRecord | null;
  websiteUrl?: string;
  planName: string;
  coveredServices: string[];
  startDate: string;
  endDate?: string;
  billingFrequency: string;
  currency: string;
  priceMinor: number;
  nextBillingDate?: string;
  renewalReminderDays: number;
  supportScope?: string;
  serviceStatus: string;
  scheduledTasks: {
    id: string;
    title: string;
    description?: string;
    frequency: string;
    dueDate?: string;
    status: string;
    notes?: string;
    completedAt?: string;
  }[];
  history: {
    id: string;
    type: string;
    message: string;
    at: string;
  }[];
  linkedInvoiceIds?: RefRecord[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Ticket = {
  id: string;
  number: string;
  clientId?: RefRecord | null;
  projectId?: RefRecord | null;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  assignedTo?: RefRecord | null;
  resolution?: string;
  activity: {
    id: string;
    kind: string;
    message: string;
    minutesSpent?: number;
    followUpRequired?: boolean;
    actorName?: string;
    at: string;
  }[];
  statusHistory: {
    from: string;
    to: string;
    at: string;
  }[];
  createdAt: string;
  updatedAt: string;
};

export type DocumentRecord = {
  id: string;
  type: string;
  title: string;
  fileName: string;
  version: number;
  status: string;
  size: number;
  sha256: string;
  clientId?: RefRecord | null;
  createdBy?: RefRecord | null;
  createdAt: string;
};

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  active: boolean;
  lastLoginAt?: string;
  createdAt: string;
};

export type AuditLog = {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  actorName: string;
  actorEmail: string;
  metadata?: JsonRecord;
  createdAt: string;
};

export type Settings = {
  id: string;
  company: {
    name: string;
    slogan: string;
    description: string;
    email: string;
    phone?: string;
    location?: string;
    website?: string;
    legalName?: string;
  };
  branding: {
    documentFooter?: string;
    primaryContactName?: string;
    primaryContactTitle?: string;
  };
  currency: { default: string };
  tax: { defaultRatePercent: string; label: string };
  invoice: {
    prefix: string;
    dueDays: number;
    paymentTerms?: string;
    footerNote?: string;
  };
  proposal: {
    prefix: string;
    validityDays: number;
    defaultTerms?: string;
    nextSteps?: string;
    defaultAbout?: string;
  };
  email: {
    fromName: string;
    fromEmail: string;
    replyTo?: string;
  };
  security: {
    sessionTtlHours: number;
    allowMarketerPaymentRecording: boolean;
  };
  maintenancePlans: {
    id?: string;
    name: string;
    description: string;
    priceMinor: number;
    currency: string;
    frequency: string;
    features: string[];
  }[];
  updatedAt: string;
};

export type ServiceRecord = {
  id: string;
  slug: string;
  title: string;
  icon: string;
  tagline: string;
  summary: string;
  description: string[];
  benefits: string[];
  deliverables: string[];
  approach: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  startingFromMinor?: number;
  active: boolean;
  order: number;
};

export type TemplateRecord = {
  id: string;
  key: string;
  title: string;
  content: string;
  version: number;
  updatedAt: string;
};
