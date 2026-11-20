import { getMessages } from "@/lib/i18n";

/** Texte provisoire. Plus tard : piloté par SiteSetting pour ne jamais afficher d'offre inexistante. */
export function AnnouncementBar() {
  const t = getMessages();
  return (
    <div className="border-b bg-surface-2 px-4 py-2 text-center text-xs text-muted sm:text-sm">
      {t.announcement}
    </div>
  );
}
