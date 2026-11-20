import Image from "next/image";
import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { BuyNowButton } from "@/components/cart/buy-buttons";
import { RingLightIllustration } from "@/components/brand/ring-light-illustration";
import { Container, Section } from "@/components/layout/container";
import { DeliveryInfo } from "@/components/product/delivery-info";
import { GalleryVisual } from "@/components/product/gallery-visual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Halo } from "@/components/ui/halo";
import { Price } from "@/components/ui/price";
import { Rating } from "@/components/ui/rating";
import { Reveal } from "@/components/ui/reveal";
import { BenefitIconView } from "./benefit-icon";
import { getMessages } from "@/lib/i18n";
import type { Product } from "@/lib/catalog";
import type { ReviewItem, ReviewSummary } from "@/lib/reviews";
import { cn } from "@/lib/cn";

function SectionHeading({ title, subtitle, className }: { title: string; subtitle?: string; className?: string }) {
  return (
    <Reveal className={cn("mb-10 max-w-2xl space-y-3", className)}>
      <h2 className="text-headline">{title}</h2>
      {subtitle && <p className="text-lead">{subtitle}</p>}
    </Reveal>
  );
}

export function Hero({ product, reviews }: { product: Product; reviews: ReviewSummary }) {
  const t = getMessages();
  const variant = product.variants.find((v) => v.stock > 0) ?? product.variants[0];
  return (
    <section className="relative overflow-hidden">
      <Container className="grid items-center gap-10 py-12 sm:py-20 lg:grid-cols-2 lg:gap-16">
        <Reveal className="min-w-0 space-y-6">
          {product.isDemo && <Badge variant="outline">{t.hero.eyebrow}</Badge>}
          <h1 className="text-display">{product.name}</h1>
          <p className="text-lead max-w-md">{product.tagline}</p>
          <Rating value={reviews.average} count={reviews.count} />
          {variant && <Price amount={variant.price} compareAt={variant.compareAt} currency={product.currency} />}
          <div className="flex flex-col gap-3 sm:flex-row">
            <BuyNowButton product={product} size="lg" />
            <Button asChild size="lg" variant="outline">
              <Link href={`/produit/${product.slug}`}>{t.hero.discover}</Link>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="relative isolate mx-auto aspect-[4/5] w-full max-w-sm">
          <Halo />
          <RingLightIllustration />
        </Reveal>
      </Container>
    </section>
  );
}

export function BenefitsSection({ product }: { product: Product }) {
  const t = getMessages().sections.benefits;
  return (
    <Section id="avantages" className="border-t bg-surface">
      <Container>
        <SectionHeading title={t.title} subtitle={t.subtitle} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {product.benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.06}>
              <Card className="h-full space-y-3 bg-bg">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-accent/15 text-accent">
                  <BenefitIconView name={b.icon} className="h-5 w-5" />
                </span>
                <h3 className="text-title">{b.title}</h3>
                <p className="text-sm text-muted">{b.text}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function SpecsSection({ product }: { product: Product }) {
  const t = getMessages().sections.specs;
  return (
    <Section id="caracteristiques">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <SectionHeading title={t.title} subtitle={product.summary} className="mb-0" />
        <Reveal>
          <SpecsList specs={product.specs} />
        </Reveal>
      </Container>
    </Section>
  );
}

export function SpecsList({ specs }: { specs: Product["specs"] }) {
  return (
    <dl className="divide-y rounded-lg border bg-surface">
      {specs.map((s) => (
        <div key={s.label} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:justify-between sm:gap-6">
          <dt className="text-sm text-muted">{s.label}</dt>
          <dd className="text-sm font-medium sm:text-right">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function HowItWorksSection({ product }: { product: Product }) {
  const t = getMessages().sections.how;
  return (
    <Section className="border-t bg-surface">
      <Container>
        <SectionHeading title={t.title} />
        {product.videoUrl ? (
          <Reveal>
            <video
              controls
              preload="none"
              playsInline
              aria-label={t.videoLabel}
              className="aspect-video w-full rounded-xl border bg-bg"
              src={product.videoUrl}
            />
          </Reveal>
        ) : (
          <ol className="grid gap-4 md:grid-cols-3">
            {product.steps.map((s, i) => (
              <li key={s.title} className="h-full">
                <Reveal delay={i * 0.08} className="h-full">
                  <Card className="h-full space-y-3 bg-bg">
                    <span className="font-display text-4xl font-semibold text-accent">{i + 1}</span>
                    <h3 className="text-title">{s.title}</h3>
                    <p className="text-sm text-muted">{s.text}</p>
                  </Card>
                </Reveal>
              </li>
            ))}
          </ol>
        )}
      </Container>
    </Section>
  );
}

export function GallerySection({ product }: { product: Product }) {
  const t = getMessages().sections.gallery;
  return (
    <Section>
      <Container>
        <SectionHeading title={t.title} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {product.images.map((img, i) => (
            <Reveal key={img.id} delay={i * 0.05}>
              <div className="relative isolate aspect-square overflow-hidden rounded-lg border bg-surface">
                <GalleryVisual image={img} sizes="(min-width: 768px) 25vw, 50vw" />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/** Rendue uniquement si des photos avant/après vérifiables sont fournies. */
export function BeforeAfterSection({ product }: { product: Product }) {
  const t = getMessages().sections.beforeAfter;
  const ba = product.beforeAfter;
  if (!ba) return null;
  return (
    <Section className="border-t bg-surface">
      <Container>
        <SectionHeading title={t.title} subtitle={ba.caption} />
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { src: ba.beforeSrc, label: t.before },
            { src: ba.afterSrc, label: t.after },
          ].map((item) => (
            <figure key={item.label} className="relative aspect-[4/3] overflow-hidden rounded-lg border">
              <Image src={item.src} alt={item.label} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
              <figcaption className="absolute left-3 top-3">
                <Badge>{item.label}</Badge>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5 text-accent" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={cn("h-4 w-4", i < value ? "fill-current" : "text-border-strong")} />
      ))}
    </div>
  );
}

export function ReviewsSection({ summary, reviews }: { summary: ReviewSummary; reviews: ReviewItem[] }) {
  const t = getMessages().sections.reviews;
  const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" });

  return (
    <Section id="avis" className="border-t">
      <Container>
        <SectionHeading title={t.title} />
        {summary.count === 0 ? (
          <Card className="space-y-1 text-center">
            <p className="font-medium">{t.empty}</p>
            <p className="text-sm text-muted">{t.emptyHint}</p>
          </Card>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="font-display text-5xl font-semibold">{summary.average?.toFixed(1)}</p>
                <Rating value={summary.average} count={summary.count} />
              </div>
              <div className="space-y-2" aria-label={t.distribution}>
                {[5, 4, 3, 2, 1].map((star) => {
                  const n = summary.distribution[star - 1] ?? 0;
                  const pct = summary.count ? (n / summary.count) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3 text-sm">
                      <span className="w-16 shrink-0 text-muted">{t.stars(star)}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right tabular-nums text-muted">{n}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <ul className="space-y-4">
              {reviews.map((r) => (
                <li key={r.id}>
                  <Card className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Stars value={r.rating} />
                      <span className="sr-only">Note : {r.rating} sur 5</span>
                      <time dateTime={r.createdAt} className="text-xs text-muted">
                        {date.format(new Date(r.createdAt))}
                      </time>
                    </div>
                    {r.title && <p className="font-medium">{r.title}</p>}
                    <p className="text-sm text-muted">{r.body}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{r.authorName}</span>
                      {r.verifiedPurchase && <Badge variant="success">{t.verified}</Badge>}
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </Section>
  );
}

/** Rendue uniquement s'il existe de vrais témoignages. */
export function TestimonialsSection({ product }: { product: Product }) {
  const t = getMessages().sections.testimonials;
  if (product.testimonials.length === 0) return null;
  return (
    <Section className="border-t bg-surface">
      <Container>
        <SectionHeading title={t.title} />
        <div className="grid gap-4 md:grid-cols-3">
          {product.testimonials.map((item) => (
            <Card key={item.id} className="space-y-4 bg-bg">
              <blockquote className="text-sm">{item.text}</blockquote>
              <p className="text-sm font-medium">{item.author}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function FaqSection({ product, title }: { product: Product; title?: string }) {
  const t = getMessages().sections.faq;
  return (
    <Section id="faq" className="border-t">
      <Container className="max-w-3xl">
        <SectionHeading title={title ?? t.title} />
        <div className="border-t">
          {product.faq.map((item) => (
            <details key={item.q} className="group border-b">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus className="h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-45" aria-hidden />
              </summary>
              <p className="pb-5 text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function GuaranteesSection() {
  const t = getMessages().sections.guarantees;
  return (
    <Section className="border-t bg-surface">
      <Container className="grid gap-8 lg:grid-cols-2">
        <SectionHeading title={t.title} className="mb-0" />
        <Reveal>
          <DeliveryInfo />
        </Reveal>
      </Container>
    </Section>
  );
}

export function FinalCta({ product }: { product: Product }) {
  const t = getMessages().sections.finalCta;
  return (
    <Section>
      <Container>
        <Reveal>
          <Card glow className="relative isolate flex flex-col items-center gap-6 overflow-hidden px-6 py-14 text-center sm:py-20">
            <Halo />
            <h2 className="text-headline max-w-xl">{t.title}</h2>
            <p className="text-lead max-w-md">{t.text}</p>
            <BuyNowButton product={product} size="lg" />
          </Card>
        </Reveal>
      </Container>
    </Section>
  );
}
