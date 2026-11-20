import { prisma } from "@maison/database";
import { REVIEWS_PAGE_SIZE, type Paginated, type ReviewItem, type ReviewSummary } from "@maison/shared";

/** Seuls les avis APPROVED comptent. Aucune valeur par défaut inventée. */
export async function getReviewSummary(slug: string): Promise<ReviewSummary> {
  const groups = await prisma.review.groupBy({
    by: ["rating"],
    where: { status: "APPROVED", product: { slug } },
    _count: { _all: true },
  });

  const distribution: ReviewSummary["distribution"] = [0, 0, 0, 0, 0];
  let count = 0;
  let sum = 0;
  for (const g of groups) {
    if (g.rating < 1 || g.rating > 5) continue;
    distribution[g.rating - 1] = g._count._all;
    count += g._count._all;
    sum += g.rating * g._count._all;
  }
  return { average: count ? Math.round((sum / count) * 10) / 10 : null, count, distribution };
}

export async function listReviews(slug: string, page: number, pageSize = REVIEWS_PAGE_SIZE): Promise<Paginated<ReviewItem>> {
  const where = { status: "APPROVED" as const, product: { slug } };
  const [total, rows] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
  ]);
  return {
    total,
    page,
    pageSize,
    items: rows.map((r) => ({
      id: r.id,
      rating: r.rating,
      title: r.title,
      body: r.body,
      authorName: r.authorName,
      createdAt: r.createdAt.toISOString(),
      verifiedPurchase: r.isVerifiedPurchase,
    })),
  };
}
