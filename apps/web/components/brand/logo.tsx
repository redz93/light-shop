import Link from "next/link";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — accueil`}
      className={cn("inline-flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight", className)}
    >
      <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6" fill="none">
        <circle cx="12" cy="12" r="8" className="stroke-accent" strokeWidth="3" />
      </svg>
      {site.name}
    </Link>
  );
}
