import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Container, Section } from "@/components/layout/container";
import { FaqSection, ReviewsSection, SpecsList } from "@/components/landing/sections";
import { BenefitIconView } from "@/components/landing/benefit-icon";
import { JsonLd } from "@/components/product/json-ld";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchase } from "@/components/product/product-purchase";
import { Badge } from "@/components/ui/badge";
import { getMessages } from "@/lib/i18n";
import { DeliveryInfo } from "@/components/product/delivery-info";
import { getProductBySlug } from "@/lib/catalog";
import { getReviewSummary, getReviews } from "@/lib/reviews";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const url = `/produit/${product.slug}`;
  return {
    title: product.name,
    description: product.tagline,
    alternates: { canonical: url },
    openGraph: { title: product.name, description: product.tagline, url, type: "website" },
    twitter: { card: "summary_large_image", title: product.name, description: product.tagline },
  };
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 text-muted marker:text-accent">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const t = getMessages();
  const [summary, reviews] = await Promise.all([getReviewSummary(product.slug), getReviews(product.slug)]);
  const first = product.variants[0];
  const inStock = product.variants.some((v) => v.stock > 0);
  const url = `${site.url}/produit/${product.slug}`;

  const productLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    sku: first?.sku,
    url,
    offers: first && {
      "@type": "Offer",
      url,
      priceCurrency: product.currency,
      price: (first.price / 100).toFixed(2),
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    // Jamais de note inventée : uniquement s'il existe de vrais avis.
    ...(summary.count > 0 && summary.average != null
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: summary.average, reviewCount: summary.count } }
      : {}),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.product.home, item: site.url },
      { "@type": "ListItem", position: 2, name: product.name, item: url },
    ],
  };

  return (
    <>
      <JsonLd data={productLd} />
      <JsonLd data={breadcrumbLd} />

      <Container className="pt-6">
        <nav aria-label="Fil d’Ariane" className="flex items-center gap-1.5 text-sm text-muted">
          <Link href="/" className="hover:text-fg">
            {t.product.home}
          </Link>
          <ChevronRight className="h-4 w-4" aria-hidden />
          <span aria-current="page" className="text-fg">
            {product.name}
          </span>
        </nav>
      </Container>

      <Container className="grid gap-10 py-8 lg:grid-cols-2 lg:gap-16 lg:py-12">
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <ProductGallery images={product.images} productName={product.name} />
        </div>
        <div className="min-w-0 space-y-4">
          {product.isDemo && <Badge variant="outline">{t.hero.eyebrow}</Badge>}
          <ProductPurchase product={product} reviews={summary} delivery={<DeliveryInfo />} />
        </div>
      </Container>

      <Section className="border-t bg-surface">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <h2 className="text-title">{t.product.description}</h2>
            {product.description.map((p) => (
              <p key={p} className="text-muted">
                {p}
              </p>
            ))}
            {product.isDemo && <p className="text-xs text-muted">{t.demoNotice}</p>}
          </div>
          <div className="space-y-4">
            <h2 className="text-title">{t.product.benefits}</h2>
            <ul className="space-y-4">
              {product.benefits.map((b) => (
                <li key={b.title} className="flex gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent">
                    <BenefitIconView name={b.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-medium">{b.title}</p>
                    <p className="text-sm text-muted">{b.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-3 lg:gap-10">
          <div className="space-y-4 lg:col-span-1">
            <h2 className="text-title">{t.product.specs}</h2>
            <SpecsList specs={product.specs} />
          </div>
          <div className="space-y-4">
            <h2 className="text-title">{t.product.usage}</h2>
            <List items={product.usageTips} />
          </div>
          <div className="space-y-4">
            <h2 className="text-title">{t.product.care}</h2>
            <List items={product.careTips} />
          </div>
        </Container>
      </Section>

      <ReviewsSection summary={summary} reviews={reviews} />
      <FaqSection product={product} title={t.product.qa} />
    </>
  );
}
