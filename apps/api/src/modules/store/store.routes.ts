import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { getStoreSettings } from "./store.service";

export const storeRouter = Router();

/** Réglages publics (aucun secret). */
storeRouter.get(
  "/settings",
  asyncHandler(async (_req, res) => {
    res.set("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    res.json(await getStoreSettings());
  }),
);
