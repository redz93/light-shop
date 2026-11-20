import type { NextFunction, Request, RequestHandler, Response } from "express";

/** Express 4 ne capte pas les promesses rejetées : on les transmet au gestionnaire d'erreurs. */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
