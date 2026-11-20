import { Router } from "express";
import rateLimit from "express-rate-limit";
import { cartQuoteRequestSchema, type CartQuoteRequest } from "@maison/shared";
import { asyncHandler } from "../../utils/async-handler";
import { validate } from "../../middlewares/validate";
import { quote } from "./cart.service";

export const cartRouter = Router();

const quoteLimiter = rateLimit({
  windowMs: 60_000,
  limit: 60,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: { code: "RATE_LIMITED", message: "Trop de requêtes, réessayez dans un instant." } },
});

cartRouter.post(
  "/quote",
  quoteLimiter,
  validate(cartQuoteRequestSchema, "body"),
  asyncHandler(async (req, res) => {
    res.set("Cache-Control", "no-store");
    res.json(await quote(req.body as CartQuoteRequest));
  }),
);
