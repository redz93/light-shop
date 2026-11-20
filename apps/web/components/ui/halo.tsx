import { cn } from "@/lib/cn";

/** Halo lumineux décoratif (signature visuelle de la marque). À placer dans un parent `relative`. */
export function Halo({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10", className)}>
      <div className="halo-glow absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 animate-halo rounded-full blur-2xl" />
    </div>
  );
}
