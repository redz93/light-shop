"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Share2, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { Rating } from "@/components/ui/rating";
import { BuyNowButtonInline } from "./buy-now-inline";
import { defaultVariant, useAddToCart } from "@/components/cart/buy-buttons";
import { useCartStore } from "@/store/cart";
import { getMessages } from "@/lib/i18n";
import type { Product } from "@/lib/catalog";
import type { ReviewSummary } from "@/lib/reviews";
import { MAX_QUANTITY_PER_LINE } from "@maison/shared";
import { cn } from "@/lib/cn";

export function ProductPurchase({ product, reviews, delivery }: { product: Product; reviews: ReviewSummary; delivery: React.ReactNode }) {
  const t = getMessages();
  const addToCart = useAddToCart();
  const openCart = useCartStore((s) => s.open);

  const [variantId, setVariantId] = useState(defaultVariant(product)?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const variant = product.variants.find((v) => v.id === variantId) ?? defaultVariant(product);

  const ctaRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      setShowBar(!!entry && !entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!variant) return null;

  const limit = Math.min(variant.stock, MAX_QUANTITY_PER_LINE);
  const available = variant.stock > 0;
  const lowStock = available && variant.stock <= variant.lowStockAt;

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success(t.buy.linkCopied);
      }
    } catch {
      /* partage annulé par l'utilisateur */
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-headline">{product.name}</h1>
        <p className="text-lead">{product.tagline}</p>
        <Rating value={reviews.average} count={reviews.count} />
      </div>

      <Price amount={variant.price} compareAt={variant.compareAt} currency={product.currency} />

      {product.variants.length > 1 && (
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">
            {Object.keys(variant.options)[0] ?? "Option"} : <span className="text-muted">{variant.name}</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <label key={v.id} className="relative">
                <input
                  type="radio"
                  name="variant"
                  value={v.id}
                  checked={v.id === variant.id}
                  disabled={v.stock === 0}
                  onChange={() => {
                    setVariantId(v.id);
                    setQuantity((q) => Math.max(1, Math.min(q, Math.min(v.stock, MAX_QUANTITY_PER_LINE))));
                  }}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    "flex h-11 min-w-20 cursor-pointer items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors",
                    "hover:border-border-strong peer-checked:border-accent peer-checked:bg-accent/10",
                    "peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-disabled:cursor-not-allowed peer-disabled:opacity-40",
                  )}
                >
                  {v.name}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {available ? <Badge variant="success">{t.buy.inStock}</Badge> : <Badge variant="danger">{t.buy.outOfStock}</Badge>}
        {lowStock && <Badge variant="accent">{t.buy.lowStock(variant.stock)}</Badge>}
      </div>

      <div ref={ctaRef} className="space-y-3">
        <div className="flex items-center gap-3">
          <QuantityStepper value={quantity} max={Math.max(limit, 1)} onChange={setQuantity} />
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            disabled={!available}
            onClick={() => addToCart(product, variant, quantity)}
          >
            {t.buy.addToCart}
          </Button>
          <Button variant="outline" size="icon" aria-label={t.buy.share} onClick={share}>
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
        <BuyNowButtonInline
          disabled={!available}
          onClick={() => {
            if (addToCart(product, variant, quantity, { silent: true }) > 0) openCart();
          }}
        />
      </div>

      <div className="border-t pt-6">{delivery}</div>

      <AnimatePresence>
        {showBar && (
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 z-30 border-t bg-bg/90 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-lg md:hidden"
          >
            <div className="mx-auto flex max-w-xl items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{product.name}</p>
                <Price amount={variant.price} compareAt={variant.compareAt} currency={product.currency} className="[&_span]:!text-lg" />
              </div>
              <Button disabled={!available} onClick={() => addToCart(product, variant, quantity)}>
                <ShoppingBag className="h-4 w-4" aria-hidden />
                {t.buy.addToCart}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
