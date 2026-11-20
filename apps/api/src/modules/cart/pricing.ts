import { MAX_QUANTITY_PER_LINE } from "@maison/shared";
import type { CartQuote, LineIssue, QuoteIssue, QuoteLine } from "@maison/shared";

/** Fonctions pures (sans base de données) : faciles à tester, réutilisées par le checkout (Phase 6-7). */

export interface VariantSnapshot {
  variantId: string;
  productName: string;
  variantName: string;
  sku: string;
  imageUrl: string | null;
  /** null = aucun prix dans la devise demandée */
  unitAmount: number | null;
  /** stock en main − réservé */
  available: number;
  isActive: boolean;
}

export interface ShippingConfig {
  flatRate: Record<string, number>;
  freeThreshold: Record<string, number>;
  countries: string[];
}

export function computeShipping(subtotal: number, currency: string, cfg: Pick<ShippingConfig, "flatRate" | "freeThreshold">): number | null {
  if (subtotal <= 0) return 0;
  const free = cfg.freeThreshold[currency];
  if (free !== undefined && subtotal >= free) return 0;
  return cfg.flatRate[currency] ?? null;
}

const BLOCKING: LineIssue[] = ["UNKNOWN_VARIANT", "UNAVAILABLE_CURRENCY", "OUT_OF_STOCK", "QUANTITY_REDUCED"];

export function quoteCart(input: {
  items: { variantId: string; quantity: number }[];
  snapshots: Map<string, VariantSnapshot>;
  currency: string;
  shipping: ShippingConfig;
  country?: string;
}): CartQuote {
  const { items, snapshots, currency, shipping, country } = input;

  const lines: QuoteLine[] = items.map(({ variantId, quantity: requested }) => {
    const snap = snapshots.get(variantId);
    const base = { variantId, requestedQuantity: requested };

    if (!snap || !snap.isActive) {
      return { ...base, productName: "", variantName: "", sku: "", imageUrl: null, unitAmount: 0, quantity: 0, maxQuantity: 0, lineTotal: 0, issues: ["UNKNOWN_VARIANT"] };
    }
    const common = { ...base, productName: snap.productName, variantName: snap.variantName, sku: snap.sku, imageUrl: snap.imageUrl };

    if (snap.unitAmount === null) {
      return { ...common, unitAmount: 0, quantity: 0, maxQuantity: 0, lineTotal: 0, issues: ["UNAVAILABLE_CURRENCY"] };
    }
    const maxQuantity = Math.min(snap.available, MAX_QUANTITY_PER_LINE);
    if (maxQuantity <= 0) {
      return { ...common, unitAmount: snap.unitAmount, quantity: 0, maxQuantity: 0, lineTotal: 0, issues: ["OUT_OF_STOCK"] };
    }
    const quantity = Math.min(requested, maxQuantity);
    const issues: LineIssue[] = quantity < requested ? ["QUANTITY_REDUCED"] : [];
    return { ...common, unitAmount: snap.unitAmount, quantity, maxQuantity, lineTotal: snap.unitAmount * quantity, issues };
  });

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const shippingAmount = computeShipping(subtotal, currency, shipping);

  const issues: QuoteIssue[] = [];
  if (lines.length === 0) issues.push("EMPTY_CART");
  if (country && shipping.countries.length > 0 && !shipping.countries.includes(country)) issues.push("COUNTRY_NOT_SERVED");
  if (shippingAmount === null) issues.push("SHIPPING_UNAVAILABLE");

  const lineOk = lines.every((l) => !l.issues.some((i) => BLOCKING.includes(i)));
  return {
    currency,
    lines,
    subtotal,
    shipping: shippingAmount,
    total: subtotal + (shippingAmount ?? 0),
    ok: lines.length > 0 && lineOk && issues.length === 0 && subtotal > 0,
    issues,
  };
}
