import { Spinner } from "@/components/ui/spinner";
import { getMessages } from "@/lib/i18n";

export default function Loading() {
  const t = getMessages();
  return (
    <div role="status" className="flex min-h-[50dvh] flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="halo-glow absolute inset-0 -m-6 animate-halo rounded-full blur-xl" aria-hidden />
        <Spinner className="relative h-10 w-10 text-accent" />
      </div>
      <span className="sr-only">{t.common.loading}</span>
    </div>
  );
}
