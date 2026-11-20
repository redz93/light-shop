import { describe, expect, it } from "vitest";
import { computeShipping, quoteCart, type VariantSnapshot } from "../src/modules/cart/pricing";

const shipping = { flatRate: { EUR: 490 }, freeThreshold: { EUR: 7500 }, countries: ["FR", "BE"] };

const snap = (over: Partial<VariantSnapshot> = {}): VariantSnapshot => ({
  variantId: "v1",
  productName: "Produit",
  variantName: "Noir",
  sku: "SKU1",
  imageUrl: null,
  unitAmount: 4990,
  available: 5,
  isActive: true,
  ...over,
});

describe("computeShipping", () => {
  it("est gratuite pour un panier vide", () => expect(computeShipping(0, "EUR", shipping)).toBe(0));
  it("applique le tarif forfaitaire sous le seuil", () => expect(computeShipping(4990, "EUR", shipping)).toBe(490));
  it("est offerte à partir du seuil", () => expect(computeShipping(7500, "EUR", shipping)).toBe(0));
  it("retourne null si aucun tarif pour la devise", () => expect(computeShipping(1000, "USD", shipping)).toBeNull());
});

describe("quoteCart", () => {
  const run = (quantity: number, s: VariantSnapshot | undefined, country?: string) =>
    quoteCart({
      items: [{ variantId: "v1", quantity }],
      snapshots: new Map(s ? [["v1", s]] : []),
      currency: "EUR",
      shipping,
      country,
    });

  it("calcule les montants depuis les données serveur", () => {
    const q = run(1, snap());
    expect(q.subtotal).toBe(4990);
    expect(q.shipping).toBe(490);
    expect(q.total).toBe(5480);
    expect(q.ok).toBe(true);
  });

  it("offre la livraison au-delà du seuil", () => {
    const q = run(2, snap());
    expect(q.subtotal).toBe(9980);
    expect(q.shipping).toBe(0);
    expect(q.ok).toBe(true);
  });

  it("plafonne la quantité au stock et signale l'ajustement", () => {
    const q = run(9, snap({ available: 3 }));
    expect(q.lines[0]).toMatchObject({ quantity: 3, requestedQuantity: 9, maxQuantity: 3, issues: ["QUANTITY_REDUCED"] });
    expect(q.ok).toBe(false);
  });

  it("signale une rupture de stock", () => {
    const q = run(1, snap({ available: 0 }));
    expect(q.lines[0]?.issues).toEqual(["OUT_OF_STOCK"]);
    expect(q.subtotal).toBe(0);
    expect(q.ok).toBe(false);
  });

  it("signale une variante inconnue", () => {
    const q = run(1, undefined);
    expect(q.lines[0]?.issues).toEqual(["UNKNOWN_VARIANT"]);
    expect(q.ok).toBe(false);
  });

  it("signale l'absence de prix dans la devise", () => {
    expect(run(1, snap({ unitAmount: null })).lines[0]?.issues).toEqual(["UNAVAILABLE_CURRENCY"]);
  });

  it("refuse un pays non desservi", () => {
    const q = run(1, snap(), "US");
    expect(q.issues).toContain("COUNTRY_NOT_SERVED");
    expect(q.ok).toBe(false);
  });

  it("un panier vide n'est pas payable", () => {
    const q = quoteCart({ items: [], snapshots: new Map(), currency: "EUR", shipping });
    expect(q.issues).toContain("EMPTY_CART");
    expect(q.ok).toBe(false);
  });
});
