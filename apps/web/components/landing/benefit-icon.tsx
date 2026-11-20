import { Package, Ruler, Smartphone, SlidersHorizontal, Sparkles, type LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  sliders: SlidersHorizontal,
  smartphone: Smartphone,
  tripod: Ruler,
  package: Package,
};

/** Icône inconnue (autre produit) => icône neutre, jamais d'erreur. */
export function BenefitIconView({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name] ?? Sparkles;
  return <Icon className={className} aria-hidden />;
}
