export const CURRENCIES = {
  NPR: { code: "NPR", label: "Nepalese Rupee", exponent: 2 },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];

export const DEFAULT_CURRENCY: CurrencyCode = "NPR";

export function currencyExponent(_code: string): number {
  return 2;
}

export function formatMoney(
  minor: number,
  currency: string,
  locale = "en-NP"
): string {
  const value = minor / 100;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `NPR ${value.toFixed(2)}`;
  }
}