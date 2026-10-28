import type { PaginationMeta } from "@vraunix/shared";

export function resolveSort<T extends string>(
  requested: string | undefined,
  allowed: readonly T[],
  fallback = "-createdAt"
): Record<string, 1 | -1> {
  const value = requested || fallback;
  const descending = value.startsWith("-");
  const field = descending ? value.slice(1) : value;
  if (!allowed.includes(field as T)) {
    const fbDesc = fallback.startsWith("-");
    const fbField = fbDesc ? fallback.slice(1) : fallback;
    return { [fbField]: fbDesc ? -1 : 1 };
  }
  return { [field]: descending ? -1 : 1 };
}

export function paginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function searchRegex(search: string): RegExp {
  return new RegExp(escapeRegex(search.trim()), "i");
}

export function dateRangeFilter(
  from?: string,
  to?: string
): { $gte?: Date; $lte?: Date } | undefined {
  if (!from && !to) return undefined;
  const range: { $gte?: Date; $lte?: Date } = {};
  if (from) range.$gte = new Date(`${from}T00:00:00.000Z`);
  if (to) range.$lte = new Date(`${to}T23:59:59.999Z`);
  return range;
}
