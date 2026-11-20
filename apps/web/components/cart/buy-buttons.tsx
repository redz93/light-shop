"use client";

import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { getMessages } from "@/lib/i18n";
import { MAX_QUANTITY_PER_LINE } from "@maison/shared";
import type { Product, Variant } from "@/lib/catalog";

export function defaultVariant(product: Product): Variant | undefined {
  return product.variants.find((v) => v.stock > 0) ?? product.variants[0];
}

/** Ajoute une variante au panier avec les garde-fous de stock. Retourne la quantité ajoutée. */
export function useAddToCart() {
  const t = getMessages();
  const add = useCartStore((s) => s.add);
  return (product: Product, variant: Variant, quantity = 1, { silent = false } = {}) => {
    const limit = Math.min(variant.stock, MAX_QUANTITY_PER_LINE);
    const added = add(variant.id, quantity, limit);
    if (added === 0) {
      toast.error(variant.stock === 0 ? getMessages().buy.outOfStock : t.buy.maxReached);
    } else if (!silent) {
      toast.success(t.buy.addedToCart(product.name));
    }
    return added;
  };
}

/** « Acheter maintenant » : ajoute la variante par défaut puis ouvre le panier. */
export function BuyNowButton({ product, ...props }: { product: Product } & Omit<ButtonProps, "onClick" | "children">) {
  const t = getMessages();
  const addToCart = useAddToCart();
  const open = useCartStore((s) => s.open);
  const variant = defaultVariant(product);

  return (
    <Button
      {...props}
      disabled={!variant || variant.stock === 0}
      onClick={() => {
        if (!variant) return;
        if (addToCart(product, variant, 1, { silent: true }) > 0) open();
      }}
    >
      <ShoppingBag className="h-4 w-4" aria-hidden />
      {t.buy.buyNow}
    </Button>
  );
}
