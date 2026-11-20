/**
 * Seed de DÉMONSTRATION. Le produit est marqué isDemo = true.
 * Aucun faux avis, aucune fausse statistique. Rejouable sans erreur (upserts).
 */
import "dotenv/config";
import argon2 from "argon2";
import { PrismaClient, Role, CouponType } from "@prisma/client";

const prisma = new PrismaClient();

const fr = {
  name: "Ring Light Aura",
  tagline: "Une lumière douce pour des vidéos nettes.",
  summary:
    "Un anneau lumineux réglable avec support smartphone et trépied, pour filmer, photographier ou visioconférer avec un éclairage flatteur.",
  description: [
    "La Ring Light Aura entoure votre objectif d’une lumière uniforme qui adoucit les ombres et met votre visage en valeur.",
    "Réglez l’intensité et la température de couleur selon la pièce, fixez votre smartphone au centre de l’anneau et ajustez la hauteur du trépied : tout est prêt en quelques instants.",
  ].join("\n\n"),
  benefits: [
    { icon: "sliders", title: "Lumière réglable", text: "Intensité et température de couleur ajustables selon la scène." },
    { icon: "smartphone", title: "Support smartphone", text: "Cadrez-vous au centre de l’anneau, sans les mains." },
    { icon: "tripod", title: "Trépied modulable", text: "Hauteur réglable, stable sur table comme au sol." },
    { icon: "package", title: "Rangement compact", text: "Se replie pour se glisser dans un sac ou un tiroir." },
  ],
  steps: [
    { title: "Installez", text: "Dépliez le trépied et fixez l’anneau sur le mât." },
    { title: "Placez votre smartphone", text: "Insérez-le dans le support, au centre de l’anneau." },
    { title: "Réglez la lumière", text: "Choisissez l’intensité et la teinte adaptées à votre pièce." },
  ],
  usageTips: [
    "Placez l’anneau face à vous, légèrement au-dessus du niveau des yeux.",
    "Atténuez les autres sources de lumière pour une teinte homogène.",
    "Utilisez une teinte chaude en intérieur le soir, plus froide en journée.",
  ].join("\n"),
  careTips: [
    "Essuyez l’anneau avec un chiffon doux et sec, appareil débranché.",
    "Évitez l’humidité et les projections d’eau.",
    "Repliez le trépied avant de ranger l’appareil.",
  ].join("\n"),
  faq: [
    { q: "Est-ce compatible avec mon smartphone ?", a: "Le support accueille les smartphones de 4,7 à 7 pouces, avec ou sans coque fine." },
    { q: "Comment l’alimenter ?", a: "Par USB-C, avec le câble fourni, depuis un adaptateur secteur ou une batterie externe." },
    {
      q: "Puis-je retourner le produit ?",
      a: "Oui : vous disposez de 14 jours après réception pour exercer votre droit de rétractation. Les conditions détaillées figureront dans la politique de remboursement.",
    },
  ],
};

// Valeurs de démonstration : à remplacer par celles de la fiche réelle du fournisseur.
const specs = [
  { label: "Diamètre de l’anneau", value: "26 cm" },
  { label: "Hauteur du trépied", value: "50 à 160 cm" },
  { label: "Températures de couleur", value: "3 000 K à 6 500 K" },
  { label: "Niveaux d’intensité", value: "10" },
  { label: "Alimentation", value: "USB-C (câble inclus)" },
  { label: "Compatibilité", value: "Smartphones de 4,7 à 7 pouces" },
];

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (adminPassword) {
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        passwordHash: await argon2.hash(adminPassword, { type: argon2.argon2id }),
        firstName: "Admin",
        role: Role.SUPER_ADMIN,
        emailVerifiedAt: new Date(),
      },
    });
    console.log(`✔ Admin : ${adminEmail}`);
  } else {
    console.log("• SEED_ADMIN_PASSWORD absent : admin non créé.");
  }

  await prisma.supplier.upsert({ where: { code: "cj" }, update: {}, create: { code: "cj", name: "CJdropshipping" } });

  const product = await prisma.product.upsert({
    where: { slug: "ring-light-aura" },
    update: { specs, isDemo: true },
    create: { slug: "ring-light-aura", status: "ACTIVE", isPrimary: true, isDemo: true, brand: "Maison", specs },
  });

  await prisma.productTranslation.upsert({
    where: { productId_locale: { productId: product.id, locale: "fr" } },
    update: fr,
    create: { productId: product.id, locale: "fr", ...fr },
  });
  const en = {
    name: "Ring Light Aura",
    tagline: "Soft light for sharp videos.",
    summary: "An adjustable ring light with phone holder and tripod.",
    description: "Demo content. Replace it from the admin panel.",
  };
  await prisma.productTranslation.upsert({
    where: { productId_locale: { productId: product.id, locale: "en" } },
    update: en,
    create: { productId: product.id, locale: "en", ...en },
  });

  const variants = [
    { sku: "DEMO-BLK", name: "Noir", options: { Couleur: "Noir" } },
    { sku: "DEMO-WHT", name: "Blanc", options: { Couleur: "Blanc" } },
  ];
  for (const [i, v] of variants.entries()) {
    const variant = await prisma.productVariant.upsert({
      where: { sku: v.sku },
      update: { name: v.name, options: v.options, position: i },
      create: { productId: product.id, sku: v.sku, name: v.name, options: v.options, position: i },
    });
    await prisma.variantPrice.upsert({
      where: { variantId_currency: { variantId: variant.id, currency: "EUR" } },
      update: { amount: 4990 },
      create: { variantId: variant.id, currency: "EUR", amount: 4990 },
    });
    await prisma.inventory.upsert({
      where: { variantId: variant.id },
      update: {},
      create: { variantId: variant.id, onHand: 25 },
    });
  }

  await prisma.coupon.upsert({
    where: { code: "DEMO10" },
    update: {},
    create: { code: "DEMO10", type: CouponType.PERCENTAGE, value: 10, maxRedemptions: 100 },
  });

  const settings: Record<string, unknown> = {
    "store.name": "Maison",
    "store.defaultCurrency": "EUR",
    "store.currencies": ["EUR"],
    "store.withdrawalDays": 14,
    "shipping.freeThreshold": { EUR: 7500 },
    "shipping.flatRate": { EUR: 490 },
    "shipping.countries": ["FR", "BE", "DE", "ES", "IT", "NL", "LU", "PT"],
    // "shipping.estimateDays": { "min": 7, "max": 12 }  ← à définir quand le délai réel est connu
    "legal.company": { name: "À RENSEIGNER", siret: "À RENSEIGNER", address: "À RENSEIGNER" },
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({ where: { key }, update: { value: value as object }, create: { key, value: value as object } });
  }

  console.log("✔ Seed de démonstration terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
