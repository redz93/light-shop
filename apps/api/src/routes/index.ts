import { Router } from "express";
import { cartRouter } from "../modules/cart/cart.routes";
import { catalogRouter } from "../modules/catalog/catalog.routes";
import { healthRouter } from "../modules/health/health.routes";
import { storeRouter } from "../modules/store/store.routes";

export const v1Router = Router();

v1Router.use("/health", healthRouter);
v1Router.use("/products", catalogRouter);
v1Router.use("/store", storeRouter);
v1Router.use("/cart", cartRouter);
// Phases suivantes : /auth, /me, /orders, /checkout, /admin, /reviews (écriture)
