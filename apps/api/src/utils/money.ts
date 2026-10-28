import Decimal from "decimal.js";
import { currencyExponent } from "@vraunix/shared";

Decimal.set({ precision: 40, rounding: Decimal.ROUND_HALF_UP });

export type MoneyLineInput = {
  description: string;
  quantity: string | number;
  unitPrice: string | number;
};

export type CalculatedLine = {
  description: string;
  quantity: string;
  unitPriceMinor: number;
  amountMinor: number;
};

export type DiscountInput = {
  type: "fixed" | "percent";
  value: string | number;
};

export type CalculatedTotals = {
  currency: string;
  lineItems: CalculatedLine[];
  subtotalMinor: number;
  discount: { type: "fixed" | "percent"; value: string; amountMinor: number } | null;
  discountMinor: number;
  taxRatePercent: string;
  taxMinor: number;
  totalMinor: number;
};

export function toMinor(
  value: string | number,
  currency: string
): number {
  const exponent = currencyExponent(currency);
  const amount = new Decimal(value);
  if (!amount.isFinite() || amount.isNegative()) {
    throw new Error("Invalid monetary amount");
  }
  return amount
    .mul(new Decimal(10).pow(exponent))
    .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
    .toNumber();
}

export function fromMinor(minor: number, currency: string): string {
  const exponent = currencyExponent(currency);
  return new Decimal(minor).div(new Decimal(10).pow(exponent)).toFixed(exponent);
}

export function calculateTotals(params: {
  currency: string;
  lineItems: MoneyLineInput[];
  discount?: DiscountInput | null;
  taxRatePercent?: string | number | null;
}): CalculatedTotals {
  const { currency } = params;
  const exponent = currencyExponent(currency);
  const scale = new Decimal(10).pow(exponent);

  const lineItems = params.lineItems.map((item) => {
    const unitPriceMinor = new Decimal(item.unitPrice)
      .mul(scale)
      .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
      .toNumber();
    const amountMinor = new Decimal(unitPriceMinor)
      .mul(new Decimal(item.quantity))
      .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
      .toNumber();
    return {
      description: item.description,
      quantity: new Decimal(item.quantity).toString(),
      unitPriceMinor,
      amountMinor,
    };
  });

  const subtotalMinor = lineItems.reduce((sum, item) => sum + item.amountMinor, 0);

  let discountMinor = 0;
  let discount: CalculatedTotals["discount"] = null;
  const rawDiscount = params.discount;
  if (rawDiscount && new Decimal(rawDiscount.value).gt(0)) {
    if (rawDiscount.type === "percent") {
      const percent = new Decimal(rawDiscount.value);
      if (percent.gt(100)) {
        throw new Error("Discount percentage cannot exceed 100");
      }
      discountMinor = new Decimal(subtotalMinor)
        .mul(percent)
        .div(100)
        .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
        .toNumber();
    } else {
      discountMinor = toMinor(rawDiscount.value, currency);
    }
    discountMinor = Math.min(discountMinor, subtotalMinor);
    discount = {
      type: rawDiscount.type,
      value: new Decimal(rawDiscount.value).toString(),
      amountMinor: discountMinor,
    };
  }

  const taxableMinor = subtotalMinor - discountMinor;
  const taxRatePercent = new Decimal(params.taxRatePercent ?? 0).toString();
  if (new Decimal(taxRatePercent).lt(0) || new Decimal(taxRatePercent).gt(100)) {
    throw new Error("Tax rate must be between 0 and 100");
  }
  const taxMinor = new Decimal(taxableMinor)
    .mul(taxRatePercent)
    .div(100)
    .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
    .toNumber();
  const totalMinor = taxableMinor + taxMinor;

  return {
    currency,
    lineItems,
    subtotalMinor,
    discount,
    discountMinor,
    taxRatePercent,
    taxMinor,
    totalMinor,
  };
}
