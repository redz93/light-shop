import { randomUUID } from "node:crypto";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { allowedOrigins } from "./config/env";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler";
import { v1Router } from "./routes";
import { logger } from "./utils/logger";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1); // derrière le proxy Railway / Render : IP réelle pour le rate limiting

  app.use(
    pinoHttp({
      logger,
      genReqId: (req, res) => {
        const incoming = req.headers["x-request-id"];
        const id = typeof incoming === "string" && /^[\w-]{8,64}$/.test(incoming) ? incoming : randomUUID();
        res.setHeader("X-Request-Id", id);
        return id;
      },
      autoLogging: { ignore: (req) => req.url?.startsWith("/api/v1/health") ?? false },
    }),
  );
  app.use(helmet());
  app.use(
    cors({
      // CORS strict : uniquement le frontend (et les origines explicitement listées).
      origin: (origin, cb) => cb(null, !origin || allowedOrigins.has(origin.replace(/\/+$/, ""))),
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      maxAge: 600,
    }),
  );
  app.use(compression());

  // Phase 7 : le webhook Stripe sera monté ICI, avant express.json(), pour recevoir le corps brut
  // (la vérification de signature en dépend).

  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());

  app.use(
    "/api/v1",
    rateLimit({
      windowMs: 60_000,
      limit: 240,
      standardHeaders: "draft-7",
      legacyHeaders: false,
      skip: (req) => req.path.startsWith("/health"),
      message: { error: { code: "RATE_LIMITED", message: "Trop de requêtes, réessayez dans un instant." } },
    }),
    v1Router,
  );

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
