import * as React from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

/** text-base sur mobile (16 px) : évite le zoom automatique d'iOS au focus. */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "h-11 w-full rounded-md border bg-surface px-3.5 text-base text-fg sm:text-sm",
        "placeholder:text-muted/70 transition-colors",
        "hover:border-border-strong",
        "focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        invalid && "border-danger focus-visible:border-danger focus-visible:ring-danger/30",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-medium text-fg", className)} {...props} />;
}

/**
 * Champ de formulaire : label + contrôle + message.
 * Le message a l'id `${htmlFor}-msg` : le passer à `aria-describedby` du contrôle.
 */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  const message = error ?? hint;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {message && (
        <p
          id={`${htmlFor}-msg`}
          role={error ? "alert" : undefined}
          className={cn("text-sm", error ? "text-danger" : "text-muted")}
        >
          {message}
        </p>
      )}
    </div>
  );
}
