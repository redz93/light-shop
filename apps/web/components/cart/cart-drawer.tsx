"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogDescription, DialogTitle, SheetContent } from "@/components/ui/dialog";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { Skeleton } from "@/components/ui/skeleton";
import { RingLightIllustration } from "@/components/brand/ring-light-illustration";
import { useCartStore } from "@/store/cart";
import { useCartQuote } from "@/lib/use-cart-quote";
import { checkoutEnabled } from "@/lib/store-config";
import { formatPrice } from "@/lib/format";
import { getMessages } from "@/lib/i18n";
import { useHydrated } from "@/lib/use-hydrated";

export function CartButton() {
  const t = getMessages();
  const hydrated = useHydrated();
  const open = useCartStore((s) => s.open);
  const count = useCartStore((s) => s.lines.reduce((n, l) => n + l.quantity, 0));
  const shown = hydrated ? count : 0;

  return (
    <Button variant="ghost" size="icon" className="relative" aria-label={t.nav.cart(shown)} onClick={open}>
      <ShoppingBag className="h-5 w-5" />
      {shown > 0 && (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-fg">
          {shown}
        </span>
      )}
    </Button>
  );
}

export function CartDrawer() {
  const t = getMessages().cart;
  const hydrated = useHydrated();
  const { lines, isOpen, setOpen, setQuantity, remove, close } = useCartStore();
  const { quote, loading, error, retry } = useCartQuote(lines, isOpen && hydrated);

  // Aligne le panier local sur la réponse du serveur (stock réduit, variante supprimée…).
  useEffect(() => {
    if (!quote) return;
    const current = useCartStore.getState().lines;
    for (const l of quote.lines) {
      const mine = current.find((c) => c.variantId === l.variantId);
      if (!mine) continue;
      if (l.issues.includes("UNKNOWN_VARIANT") || l.issues.includes("UNAVAILABLE_CURRENCY")) {
        remove(l.variantId);
      } else if (l.quantity > 0 && l.quantity < mine.quantity) {
        setQuantity(l.variantId, l.quantity, l.maxQuantity);
      }
    }
  }, [quote, remove, setQuantity]);

  const empty = hydrated && lines.length === 0;
  const currency = quote?.currency ?? "EUR";

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <SheetContent>
        <header className="flex items-center justify-between border-b px-5 py-4">
          <DialogTitle className="text-title">{t.title}</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" aria-label={getMessages().common.close}>
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>
        </header>
        <DialogDescription className="sr-only">{t.description}</DialogDescription>

        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-muted" aria-hidden />
            <div className="space-y-1">
              <p className="font-medium">{t.empty}</p>
              <p className="text-sm text-muted">{t.emptyHint}</p>
            </div>
            <Button variant="outline" onClick={close}>
              {t.continue}
            </Button>
          </div>
        ) : error ? (
          <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-sm text-muted">{t.loadError}</p>
            <Button variant="outline" onClick={retry}>
              {t.retry}
            </Button>
          </div>
        ) : !quote ? (
          <div className="flex-1 space-y-4 px-5 py-5" aria-busy={loading}>
            {lines.map((l) => (
              <Skeleton key={l.variantId} className="h-24 w-full" />
            ))}
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y overflow-y-auto px-5">
              {quote.lines.map((l) => {
                const outOfStock = l.issues.includes("OUT_OF_STOCK");
                const stored = lines.find((c) => c.variantId === l.variantId)?.quantity ?? l.quantity;
                return (
                  <li key={l.variantId} className="flex gap-4 py-5">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-surface p-1.5">
                      {l.imageUrl ? (
                        <Image src={l.imageUrl} alt="" fill sizes="80px" className="object-cover" />
                      ) : (
                        <RingLightIllustration view="full" label="" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{l.productName}</p>
                          <p className="text-sm text-muted">{l.variantName}</p>
                        </div>
                        <p className="shrink-0 font-medium tabular-nums">{formatPrice(l.lineTotal, currency)}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        {outOfStock ? (
                          <span className="text-sm text-danger">{t.outOfStock}</span>
                        ) : (
                          <QuantityStepper
                            value={Math.min(stored, l.maxQuantity)}
                            max={l.maxQuantity}
                            onChange={(q) => setQuantity(l.variantId, q, l.maxQuantity)}
                          />
                        )}
                        <Button variant="ghost" size="icon" aria-label={t.remove(l.productName)} onClick={() => remove(l.variantId)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <footer className="space-y-3 border-t px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">{t.subtotal}</dt>
                  <dd className="tabular-nums">{formatPrice(quote.subtotal, currency)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">{t.shipping}</dt>
                  <dd className="tabular-nums">
                    {quote.shipping === null ? "—" : quote.shipping === 0 ? t.free : formatPrice(quote.shipping, currency)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-t pt-3">
                  <dt className="font-medium">{t.total}</dt>
                  <dd className="font-display text-xl font-semibold tabular-nums">{formatPrice(quote.total, currency)}</dd>
                </div>
              </dl>
              {quote.issues.includes("SHIPPING_UNAVAILABLE") && <p className="text-xs text-danger">{t.shippingUnavailable}</p>}
              {checkoutEnabled ? (
                <Button asChild size="lg" className="w-full" aria-disabled={!quote.ok}>
                  <Link href="/checkout">{t.checkout}</Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" className="w-full" disabled>
                    {t.checkout}
                  </Button>
                  <p className="text-center text-xs text-muted">{t.checkoutSoon}</p>
                </>
              )}
            </footer>
          </>
        )}
      </SheetContent>
    </Dialog>
  );
}
