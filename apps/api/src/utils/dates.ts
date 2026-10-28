export function parseDateOnly(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

export function formatDateOnly(date: Date | string | null | undefined): string {
  if (!date) return "";
  const parsed = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
}

export function startOfTodayUtc(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date.getTime());
  const originalDay = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  const daysInTargetMonth = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)
  ).getUTCDate();
  result.setUTCDate(Math.min(originalDay, daysInTargetMonth));
  return result;
}

export function addFrequency(
  date: Date,
  frequency: "monthly" | "quarterly" | "annual" | "custom"
): Date {
  switch (frequency) {
    case "monthly":
      return addMonths(date, 1);
    case "quarterly":
      return addMonths(date, 3);
    case "annual":
      return addMonths(date, 12);
    default:
      return addMonths(date, 1);
  }
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export function isOverdue(dueDate: Date | string | null | undefined): boolean {
  if (!dueDate) return false;
  const due = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  return due.getTime() < startOfTodayUtc().getTime();
}

export function daysBetween(from: Date, to: Date): number {
  return Math.ceil((to.getTime() - from.getTime()) / 86_400_000);
}
