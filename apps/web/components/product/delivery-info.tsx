import { RotateCcw, ShieldCheck, Truck, type LucideIcon } from "lucide-react";
import { getMessages } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { getStoreSettings } from "@/lib/store-config";
import { cn } from "@/lib/cn";

/** Informations lues depuis les réglages serveur : rien ne s'affiche si ce n'est pas configuré. */
export async function DeliveryInfo({ className }: { className?: string }) {
  const t = getMessages().sections.guarantees;
  const s = await getStoreSettings();

  const items: { icon: LucideIcon; text: string }[] = [];
  if (s) {
    const cur = s.defaultCurrency;
    const flat = s.shipping.flatRate[cur];
    const free = s.shipping.freeThreshold[cur];
    if (flat !== undefined && free !== undefined) {
      items.push({ icon: Truck, text: t.freeShipping(formatPrice(free, cur), formatPrice(flat, cur)) });
    } else if (flat !== undefined) {
      items.push({ icon: Truck, text: t.flatShipping(formatPrice(flat, cur)) });
    }
    if (s.shipping.estimateDays) {
      items.push({ icon: Truck, text: t.delivery(s.shipping.estimateDays.min, s.shipping.estimateDays.max) });
    }
  }
  items.push({ icon: ShieldCheck, text: t.payment });
  if (s) items.push({ icon: RotateCcw, text: t.withdrawal(s.withdrawalDays) });

  return (
    <ul className={cn("space-y-3", className)}>
      {items.map(({ icon: Icon, text }) => (
        <li key={text} className="flex items-start gap-3 text-sm text-muted">
          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}
