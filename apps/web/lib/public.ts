import {
  BUDGET_RANGES,
  COMPANY,
  CURRENCY_CODES,
  DEFAULT_CURRENCY,
  FAQS,
  SERVICES,
  TIMELINE_OPTIONS,
  type PublicSettings,
  type ServiceContent,
} from "@vraunix/shared";
import type { ServiceRecord } from "./types";
import { SERVER_API_TIMEOUT_MS, getApiInternalUrl } from "./server-api";

const API_INTERNAL_URL = getApiInternalUrl();

const fallbackSettings: PublicSettings = {
  company: {
    name: COMPANY.name,
    slogan: COMPANY.slogan,
    description: COMPANY.description,
    email: COMPANY.email,
    phone: COMPANY.phone,
    location: COMPANY.location,
    website: COMPANY.website,
  },
  currency: { default: DEFAULT_CURRENCY },
  discovery: {
    budgetRanges: [...BUDGET_RANGES],
    timelines: [...TIMELINE_OPTIONS],
    currencies: [...CURRENCY_CODES],
  },
};

async function getPublic<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_INTERNAL_URL}/api/v1/public${path}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(SERVER_API_TIMEOUT_MS),
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as
      | { success: true; data: T }
      | { success: false };
    return payload.success ? payload.data : null;
  } catch {
    return null;
  }
}

export async function getPublicSettings(): Promise<PublicSettings> {
  return (await getPublic<PublicSettings>("/settings")) ?? fallbackSettings;
}

export async function getServices(): Promise<ServiceContent[]> {
  const records = await getPublic<ServiceRecord[]>("/services");
  if (!records || records.length === 0) return SERVICES;
  return records
    .filter((record) => record.active)
    .map((record) => ({
      slug: record.slug,
      title: record.title,
      icon: record.icon,
      tagline: record.tagline,
      summary: record.summary,
      description: record.description,
      benefits: record.benefits,
      deliverables: record.deliverables,
      approach: record.approach,
      faqs: record.faqs,
      startingFromMinor: record.startingFromMinor,
    }));
}

export async function getService(slug: string): Promise<ServiceContent | null> {
  const services = await getServices();
  return services.find((service) => service.slug === slug) ?? null;
}

export async function getFaqs(): Promise<{ question: string; answer: string; category?: string }[]> {
  const records = await getPublic<{ question: string; answer: string; category?: string }[]>(
    "/faqs"
  );
  return records && records.length > 0 ? records : [...FAQS];
}
