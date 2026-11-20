import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Badge } from "./badge";

/**
 * L'ancien prix et le badge de remise ne s'affichent QUE si compareAt > amount
 * (promotion réelle renseignée côté serveur).
 */
export function Price({
  amount,
  compareAt,
  currency = "EUR",
  className,
}: {
  amount: number;
  compareAt?: number | null;
  currency?: string;
  className?: string;
}) {
  const previous = compareAt != null && compareAt > amount ? compareAt : null;
  const discount = previous ? Math.round((1 - amount / previous) * 100) : 0;

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-3 gap-y-1", className)}>
      <span className="font-display text-3xl font-semibold tracking-tight">
        {formatPrice(amount, currency)}
      </span>
      {previous && (
        <>
          <s className="text-base text-muted">{formatPrice(previous, currency)}</s>
          <Badge variant="accent">−{discount} %</Badge>
        </>
      )}
    </div>
  );
}
