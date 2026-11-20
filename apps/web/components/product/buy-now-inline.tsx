"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMessages } from "@/lib/i18n";

export function BuyNowButtonInline({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <Button size="lg" className="w-full" disabled={disabled} onClick={onClick}>
      <ShoppingBag className="h-4 w-4" aria-hidden />
      {getMessages().buy.buyNow}
    </Button>
  );
}
