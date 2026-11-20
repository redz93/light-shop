import type { ErrorRequestHandler, RequestHandler } from "express";
import { Prisma } from "@maison/database";
import { ZodError } from "zod";
import { AppError } from "../utils/app-error";
import { isProd } from "../config/env";

export const notFoundHandler: RequestHandler = (_req, _res, next) => {
  next(AppError.notFound("Route introuvable"));
};

function send(
  res: Parameters<ErrorRequestHandler>[2],
  requestId: string,
  status: number,
  code: string,
  message: string,
  details?: unknown,
) {
  res.status(status).json({ error: { code, message, details, requestId } });
}

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const requestId = String(req.id);

  if (err instanceof ZodError) {
    const details = err.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
    return send(res, requestId, 400, "VALIDATION_ERROR", "Données invalides", details);
  }
  if (err instanceof AppError) {
    return send(res, requestId, err.status, err.code, err.message, err.details);
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") return send(res, requestId, 409, "CONFLICT", "Cette ressource existe déjà");
    if (err.code === "P2025") return send(res, requestId, 404, "NOT_FOUND", "Ressource introuvable");
  }
  // Erreurs de body-parser
  const e = err as { type?: string; status?: number };
  if (e.type === "entity.too.large") return send(res, requestId, 413, "PAYLOAD_TOO_LARGE", "Corps de requête trop volumineux");
  if (e.type === "entity.parse.failed") return send(res, requestId, 400, "INVALID_JSON", "JSON invalide");

  req.log.error({ err }, "Erreur non gérée");
  send(res, requestId, 500, "INTERNAL_ERROR", isProd ? "Erreur interne du serveur" : String((err as Error)?.message ?? err));
};
