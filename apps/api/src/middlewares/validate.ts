import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";

/** Valide et remplace body / query / params par la version parsée (types et valeurs par défaut). */
export const validate =
  (schema: ZodTypeAny, source: "body" | "query" | "params"): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) return next(result.error);
    (req as unknown as Record<string, unknown>)[source] = result.data;
    next();
  };
