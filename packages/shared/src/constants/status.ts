export const STAFF_ROLES = ["admin"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export const LEAD_STATUSES = [
  "new",
  "reviewing",
  "contacted",
  "qualified",
  "proposal_draft",
  "proposal_sent",
  "won",
  "lost",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  new: ["reviewing", "lost"],
  reviewing: ["contacted", "qualified", "lost"],
  contacted: ["qualified", "reviewing", "lost"],
  qualified: ["proposal_draft", "contacted", "lost"],
  proposal_draft: ["proposal_sent", "qualified", "lost"],
  proposal_sent: ["won", "lost", "proposal_draft"],
  won: [],
  lost: ["reviewing"],
};

export const PROJECT_STATUSES = [
  "not_started",
  "ready_to_start",
  "in_progress",
  "client_review",
  "changes_requested",
  "approved",
  "deployed",
  "completed",
  "on_hold",
  "cancelled",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  not_started: ["ready_to_start", "on_hold", "cancelled"],
  ready_to_start: ["in_progress", "on_hold", "cancelled"],
  in_progress: ["client_review", "on_hold", "cancelled"],
  client_review: ["changes_requested", "approved", "on_hold", "cancelled"],
  changes_requested: ["in_progress", "client_review", "on_hold", "cancelled"],
  approved: ["deployed", "on_hold", "cancelled"],
  deployed: ["completed", "on_hold"],
  completed: [],
  on_hold: ["not_started", "ready_to_start", "in_progress", "cancelled"],
  cancelled: [],
};

export const PROPOSAL_STATUSES = [
  "draft",
  "sent",
  "accepted",
  "declined",
  "superseded",
] as const;
export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number];

export const INVOICE_STATUSES = [
  "draft",
  "issued",
  "partially_paid",
  "paid",
  "overdue",
  "void",
] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "pending",
  "verified",
  "rejected",
  "reversed",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_METHODS = [
  "bank_transfer",
  "cash",
  "card",
  "mobile_money",
  "cheque",
  "other",
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  bank_transfer: "Bank transfer",
  cash: "Cash",
  card: "Card",
  mobile_money: "Mobile money",
  cheque: "Cheque",
  other: "Other",
};

export const MAINTENANCE_FREQUENCIES = [
  "monthly",
  "quarterly",
  "annual",
  "custom",
] as const;
export type MaintenanceFrequency = (typeof MAINTENANCE_FREQUENCIES)[number];

export const MAINTENANCE_SERVICE_STATUSES = [
  "active",
  "paused",
  "cancelled",
  "expired",
] as const;
export type MaintenanceServiceStatus =
  (typeof MAINTENANCE_SERVICE_STATUSES)[number];

export const TICKET_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export const TICKET_STATUSES = [
  "open",
  "assigned",
  "in_progress",
  "waiting_for_client",
  "resolved",
  "closed",
] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const TICKET_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  open: ["assigned", "in_progress", "closed"],
  assigned: ["in_progress", "waiting_for_client", "resolved", "closed"],
  in_progress: ["waiting_for_client", "resolved", "assigned", "closed"],
  waiting_for_client: ["in_progress", "resolved", "closed"],
  resolved: ["closed", "in_progress"],
  closed: ["open"],
};

export const CHANGE_REQUEST_STATUSES = [
  "requested",
  "approved",
  "declined",
  "implemented",
] as const;
export type ChangeRequestStatus = (typeof CHANGE_REQUEST_STATUSES)[number];

export const DOCUMENT_TYPES = [
  "company_proposal",
  "project_proposal",
  "scope_of_work",
  "agreement",
  "invoice",
  "receipt",
  "handover_report",
  "maintenance_agreement",
  "maintenance_report",
] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  company_proposal: "Company proposal",
  project_proposal: "Project proposal",
  scope_of_work: "Scope of Work",
  agreement: "Development agreement",
  invoice: "Invoice",
  receipt: "Payment receipt",
  handover_report: "Website handover report",
  maintenance_agreement: "Maintenance agreement",
  maintenance_report: "Maintenance report",
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  not_started: "Not started",
  ready_to_start: "Ready to start",
  in_progress: "In progress",
  client_review: "Client review",
  changes_requested: "Changes requested",
  approved: "Approved",
  deployed: "Deployed",
  completed: "Completed",
  on_hold: "On hold",
  cancelled: "Cancelled",
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal_draft: "Proposal draft",
  proposal_sent: "Proposal sent",
  won: "Won",
  lost: "Lost",
};

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  open: "Open",
  assigned: "Assigned",
  in_progress: "In progress",
  waiting_for_client: "Waiting for client",
  resolved: "Resolved",
  closed: "Closed",
};
