import { CURRENCIES, DEFAULT_CURRENCY } from "@vraunix/shared";

export function money(
  minor: number | undefined | null,
  currency: string = DEFAULT_CURRENCY
): string {
  const exponent = CURRENCIES[currency as keyof typeof CURRENCIES]?.exponent ?? 2;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: exponent,
    maximumFractionDigits: exponent,
  }).format((minor ?? 0) / 10 ** exponent);
}

export function fromMinor(
  minor: number,
  currency: string = DEFAULT_CURRENCY
): string {
  const exponent = CURRENCIES[currency as keyof typeof CURRENCIES]?.exponent ?? 2;
  return (minor / 10 ** exponent).toFixed(exponent);
}

export function date(value: string | Date | undefined | null): string {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export function dateTime(value: string | Date | undefined | null): string {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

export function titleCase(value: string | undefined | null): string {
  if (!value) return "—";
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function initials(name: string | undefined | null): string {
  if (!name) return "VX";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function truncate(value: string | undefined | null, length = 120): string {
  if (!value) return "";
  return value.length > length ? `${value.slice(0, length).trim()}…` : value;
}

export function statusTone(
  status: string | undefined
): "neutral" | "accent" | "success" | "warning" | "danger" | "info" {
  switch (status) {
    case "paid":
    case "accepted":
    case "completed":
    case "verified":
    case "won":
    case "approved":
      return "success";
    case "overdue":
    case "cancelled":
    case "declined":
    case "rejected":
    case "lost":
    case "void":
      return "danger";
    case "pending":
    case "reviewing":
    case "changes_requested":
    case "in_progress":
    case "partially_paid":
      return "warning";
    case "sent":
    case "issued":
    case "new":
    case "open":
      return "info";
    case "deployed":
    case "maintenance":
      return "accent";
    default:
      return "neutral";
  }
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysIso(days: number): string {
  const next = new Date();
  next.setDate(next.getDate() + days);
  return next.toISOString().slice(0, 10);
}
