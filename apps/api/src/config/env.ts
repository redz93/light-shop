import path from "node:path";
import { config as loadEnv } from "dotenv";
import { z } from "zod";

// .env à la racine du monorepo (cwd = apps/api quand lancé via pnpm), sans écraser l'existant.
loadEnv({ path: path.resolve(process.cwd(), "../../.env") });
loadEnv();

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  API_URL: z.string().url().default("http://localhost:4000"),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  /** Origines supplémentaires autorisées (séparées par des virgules), ex. un domaine de préproduction. */
  CORS_ORIGINS: z.string().optional(),
  DATABASE_URL: z.string().min(1, "DATABASE_URL est requis"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("❌ Variables d'environnement invalides :", parsed.error.flatten().fieldErrors);
  throw new Error("Configuration invalide");
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === "production";

const normalize = (url: string) => url.trim().replace(/\/+$/, "");
export const allowedOrigins = new Set(
  [env.FRONTEND_URL, ...(env.CORS_ORIGINS?.split(",") ?? [])].filter(Boolean).map(normalize),
);
