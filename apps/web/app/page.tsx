import {
  BeforeAfterSection,
  BenefitsSection,
  FaqSection,
  FinalCta,
  GallerySection,
  GuaranteesSection,
  Hero,
  HowItWorksSection,
  ReviewsSection,
  SpecsSection,
  TestimonialsSection,
} from "@/components/landing/sections";
import { Container, Section } from "@/components/layout/container";
import { getPrimaryProduct } from "@/lib/catalog";
import { getMessages } from "@/lib/i18n";
import { getReviewSummary, getReviews } from "@/lib/reviews";

export default async function HomePage() {
  const product = await getPrimaryProduct();
  if (!product) {
    return (
      <Section>
        <Container className="text-center">
          <p className="text-lead">{getMessages().home.noProduct}</p>
        </Container>
      </Section>
    );
  }
  const [summary, reviews] = await Promise.all([getReviewSummary(product.slug), getReviews(product.slug)]);

  return (
    <>
      <Hero product={product} reviews={summary} />
      <BenefitsSection product={product} />
      <SpecsSection product={product} />
      <HowItWorksSection product={product} />
      <GallerySection product={product} />
      <BeforeAfterSection product={product} />
      <ReviewsSection summary={summary} reviews={reviews} />
      <TestimonialsSection product={product} />
      <FaqSection product={product} />
      <GuaranteesSection />
      <FinalCta product={product} />
    </>
  );
}
