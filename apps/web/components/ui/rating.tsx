import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Affiche UNIQUEMENT une moyenne réelle calculée à partir d'avis approuvés.
 * Sans avis : aucun score n'est affiché (pas de fausse note).
 */
export function Rating({
  value,
  count,
  className,
}: {
  value?: number | null;
  count: number;
  className?: string;
}) {
  if (!count || value == null) {
    return <span className={cn("text-sm text-muted", className)}>Aucun avis pour le moment</span>;
  }

  const percent = Math.max(0, Math.min(100, (value / 5) * 100));
  const stars = (
    <div className="flex w-max gap-0.5 [&_svg]:fill-current">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className="h-4 w-4" aria-hidden />
      ))}
    </div>
  );

  return (
    <div
      role="img"
      aria-label={`Note moyenne ${value.toFixed(1)} sur 5, ${count} avis`}
      className={cn("inline-flex items-center gap-2", className)}
    >
      <div className="relative">
        <div className="text-border-strong">{stars}</div>
        <div className="absolute inset-y-0 left-0 overflow-hidden text-accent" style={{ width: `${percent}%` }}>
          {stars}
        </div>
      </div>
      <span className="text-sm text-muted">
        {value.toFixed(1)} · {count} avis
      </span>
    </div>
  );
}
