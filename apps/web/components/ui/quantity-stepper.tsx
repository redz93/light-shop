"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "./button";
import { getMessages } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export function QuantityStepper({
  value,
  min = 1,
  max,
  onChange,
  className,
}: {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  className?: string;
}) {
  const t = getMessages();
  return (
    <div role="group" aria-label={t.buy.quantity} className={cn("inline-flex items-center rounded-md border", className)}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={t.buy.decrease}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <output aria-live="polite" className="w-10 text-center text-sm font-medium tabular-nums">
        {value}
      </output>
      <Button
        variant="ghost"
        size="icon"
        aria-label={t.buy.increase}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
