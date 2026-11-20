import { cn } from "@/lib/cn";
import type { GalleryView } from "@/lib/catalog";

const viewBoxes: Record<GalleryView, string> = {
  full: "0 0 320 400",
  ring: "40 0 240 220",
  tripod: "50 170 220 230",
  detail: "110 50 100 110",
};

/** Illustration vectorielle provisoire (aucune image externe). À remplacer par les photos du produit. */
export function RingLightIllustration({
  className,
  view = "full",
  label = "Illustration d’une ring light sur trépied (visuel provisoire)",
}: {
  className?: string;
  view?: GalleryView;
  label?: string;
}) {
  return (
    <svg
      viewBox={viewBoxes[view]}
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      className={cn("h-full w-full", className)}
      fill="none"
    >
      <g className="stroke-muted/60" strokeWidth="5" strokeLinecap="round">
        <line x1="160" y1="196" x2="160" y2="262" />
        <line x1="160" y1="262" x2="84" y2="388" />
        <line x1="160" y1="262" x2="236" y2="388" />
        <line x1="160" y1="262" x2="160" y2="392" />
      </g>
      <circle
        cx="160"
        cy="108"
        r="86"
        className="stroke-accent"
        strokeWidth="14"
        style={{ filter: "drop-shadow(0 0 14px rgb(var(--accent) / 0.85))" }}
      />
      <circle cx="160" cy="108" r="70" className="stroke-accent/30" strokeWidth="1" />
      <rect x="138" y="76" width="44" height="64" rx="8" className="fill-surface-2 stroke-border-strong" strokeWidth="2" />
      <circle cx="160" cy="88" r="3" className="fill-accent-2" />
    </svg>
  );
}
