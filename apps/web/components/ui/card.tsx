import { cn } from "@/lib/cn";

export function Card({
  className,
  glow = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { glow?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-surface p-6 shadow-soft",
        glow && "border-accent/30 shadow-glow",
        className,
      )}
      {...props}
    />
  );
}
