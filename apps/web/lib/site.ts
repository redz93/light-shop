export const site = {
  name: "Maison", // ← nom de marque provisoire
  description: "Boutique de démonstration.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "fr",
  currency: "EUR",
  /** Liens légaux : à remplir quand les pages existent (Phase 9), pour éviter les liens morts. */
  legalLinks: [] as { label: string; href: string }[],
};
