import type { Paginated, ReviewItem, ReviewSummary } from "@maison/shared";
import { apiGet } from "./api";

export type { ReviewItem, ReviewSummary } from "@maison/shared";

/** Avis approuvés uniquement, calculés côté serveur. Aucun avis fictif. */
export const getReviewSummary = (slug: string) =>
  apiGet<ReviewSummary>(`/products/${encodeURIComponent(slug)}/reviews/summary`);

export async function getReviews(slug: string, page = 1): Promise<ReviewItem[]> {
  return (await apiGet<Paginated<ReviewItem>>(`/products/${encodeURIComponent(slug)}/reviews?page=${page}`)).items;
}
