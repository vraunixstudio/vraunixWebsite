import { CURRENCIES, DEFAULT_CURRENCY } from "../constants/currency.js";

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
