import { Router } from "express";
import { z } from "zod";
import { REVIEWS_PAGE_SIZE } from "@maison/shared";
import { asyncHandler } from "../../utils/async-handler";
import { AppError } from "../../utils/app-error";
import { validate } from "../../middlewares/validate";
import { catalogQuerySchema, slugParamSchema, type CatalogQuery } from "./catalog.schemas";
import { getPrimaryProduct, getProductBySlug } from "./catalog.service";
import { getReviewSummary, listReviews } from "../reviews/reviews.service";

export const catalogRouter = Router();

const cacheShort = (res: { set: (k: string, v: string) => unknown }) =>
  res.set("Cache-Control", "public, max-age=30, stale-while-revalidate=120");

// Important : "primary" avant ":slug".
catalogRouter.get(
  "/primary",
  validate(catalogQuerySchema, "query"),
  asyncHandler(async (req, res) => {
    const product = await getPrimaryProduct(req.query as unknown as CatalogQuery);
    if (!product) throw AppError.notFound("Aucun produit actif");
    cacheShort(res);
    res.json(product);
  }),
);

catalogRouter.get(
  "/:slug",
  validate(slugParamSchema, "params"),
  validate(catalogQuerySchema, "query"),
  asyncHandler(async (req, res) => {
    const product = await getProductBySlug(req.params.slug as string, req.query as unknown as CatalogQuery);
    if (!product) throw AppError.notFound("Produit introuvable");
    cacheShort(res);
    res.json(product);
  }),
);

catalogRouter.get(
  "/:slug/reviews/summary",
  validate(slugParamSchema, "params"),
  asyncHandler(async (req, res) => {
    cacheShort(res);
    res.json(await getReviewSummary(req.params.slug as string));
  }),
);

const pageQuery = z.object({ page: z.coerce.number().int().min(1).max(1000).default(1) });

catalogRouter.get(
  "/:slug/reviews",
  validate(slugParamSchema, "params"),
  validate(pageQuery, "query"),
  asyncHandler(async (req, res) => {
    const { page } = req.query as unknown as z.infer<typeof pageQuery>;
    cacheShort(res);
    res.json(await listReviews(req.params.slug as string, page, REVIEWS_PAGE_SIZE));
  }),
);
