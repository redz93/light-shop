import { prisma } from "@maison/database";
import type { CartQuote, CartQuoteRequest } from "@maison/shared";
import { getStoreSettings } from "../store/store.service";
import { quoteCart, type VariantSnapshot } from "./pricing";

/**
 * Le client n'envoie que des identifiants et des quantités.
 * Prix, stock et livraison viennent de la base : c'est l'unique source de vérité.
 */
export async function quote(input: CartQuoteRequest): Promise<CartQuote> {
  const { items, currency, locale, country } = input;
  const settings = await getStoreSettings();

  const snapshots = new Map<string, VariantSnapshot>();
  if (items.length > 0) {
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: items.map((i) => i.variantId) } },
      include: {
        prices: { where: { currency } },
        inventory: true,
        imageLinks: { orderBy: { position: "asc" }, take: 1 },
        product: { include: { translations: true, images: { orderBy: { position: "asc" }, take: 1 } } },
      },
    });

    for (const v of variants) {
      const tr = v.product.translations.find((t) => t.locale === locale) ?? v.product.translations[0];
      snapshots.set(v.id, {
        variantId: v.id,
        productName: tr?.name ?? v.product.slug,
        variantName: v.name,
        sku: v.sku,
        imageUrl: v.imageLinks[0]?.url ?? v.product.images[0]?.url ?? null,
        unitAmount: v.prices[0]?.amount ?? null,
        available: v.inventory ? Math.max(0, v.inventory.onHand - v.inventory.reserved) : 0,
        isActive: v.isActive && v.product.status === "ACTIVE",
      });
    }
  }

  return quoteCart({ items, snapshots, currency, shipping: settings.shipping, country });
}
