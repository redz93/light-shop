import { Router } from "express";
import { prisma } from "@maison/database";

export const healthRouter = Router();

/** Liveness : le processus répond. */
healthRouter.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

/** Readiness : la base de données répond (utilisé par Railway / Render). */
healthRouter.get("/ready", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ready" });
  } catch (err) {
    req.log.error({ err }, "Base de données indisponible");
    res.status(503).json({ status: "unavailable" });
  }
});
