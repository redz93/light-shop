import { Prisma, prisma } from "@maison/database";
import type { Product } from "@maison/shared";
import { benefitsSchema, faqSchema, specsSchema, stepsSchema, type CatalogQuery } from "./catalog.schemas";

const productInclude = {
  translations: true,
  variants: {
    where: { isActive: true },
    orderBy: { position: "asc" },
    include: { prices: true, inventory: true },
  },
  images: { orderBy: { position: "asc" } },
} satisfies Prisma.ProductInclude;

type ProductRow = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

const lines = (value: string | null | undefined, separator: string) =>
  (value ?? "")
    .split(separator)
    .map((s) => s.trim())
    .filter(Boolean);

function toDto(p: ProductRow, { locale, currency }: CatalogQuery): Product | null {
  const tr = p.translations.find((t) => t.locale === locale) ?? p.translations.find((t) => t.locale === "fr") ?? p.translations[0];
  if (!tr) return null;

  const variants = p.variants.flatMap((v) => {
    const price = v.prices.find((pr) => pr.currency === currency);
    if (!price) return []; // pas de prix de référence dans cette devise => non vendable
    const options = z_record(v.options);
    return [
      {
        id: v.id,
        sku: v.sku,
        name: v.name,
        options,
        price: price.amount,
        compareAt: price.compareAtAmount && price.compareAtAmount > price.amount ? price.compareAtAmount : null,
        stock: v.inventory ? Math.max(0, v.inventory.onHand - v.inventory.reserved) : 0,
        lowStockAt: v.inventory?.lowStockAt ?? 5,
      },
    ];
  });

  return {
    id: p.id,
    slug: p.slug,
    name: tr.name,
    tagline: tr.tagline ?? "",
    summary: tr.summary ?? tr.tagline ?? "",
    description: lines(tr.description, "\n\n"),
    benefits: benefitsSchema.catch([]).parse(tr.benefits),
    specs: specsSchema.catch([]).parse(p.specs),
    steps: stepsSchema.catch([]).parse(tr.steps),
    usageTips: lines(tr.usageTips, "\n"),
    careTips: lines(tr.careTips, "\n"),
    faq: faqSchema.catch([]).parse(tr.faq),
    currency,
    variants,
    images: p.images.map((img, i) => ({
      id: img.id,
      src: img.url,
      alt: img.alt ?? tr.name,
      view: (["full", "ring", "tripod", "detail"] as const)[i % 4] ?? "full",
    })),
    videoUrl: p.videoUrl,
    testimonials: [], // alimenté par une table dédiée si besoin (jamais de faux témoignages)
    beforeAfter: null,
    isDemo: p.isDemo,
  };
}

function z_record(value: Prisma.JsonValue): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([, v]) => typeof v === "string")) as Record<string, string>;
}

export async function getPrimaryProduct(query: CatalogQuery): Promise<Product | null> {
  const p = await prisma.product.findFirst({ where: { isPrimary: true, status: "ACTIVE" }, include: productInclude });
  return p ? toDto(p, query) : null;
}

export async function getProductBySlug(slug: string, query: CatalogQuery): Promise<Product | null> {
  const p = await prisma.product.findFirst({ where: { slug, status: "ACTIVE" }, include: productInclude });
  return p ? toDto(p, query) : null;
}
