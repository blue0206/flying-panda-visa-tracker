import z from "zod";
import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { ApiError } from "../types/api.js";

interface ValidationArgsType {
  bodySchema?: ZodType | null;
  paramsSchema?: ZodType;
  querySchema?: ZodType;
}

const validateRequest =
  (args: ValidationArgsType) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    // Parse all in parallel.
    const [body, params, query] = await Promise.all([
      args.bodySchema ? args.bodySchema.safeParseAsync(req.body) : null,
      args.paramsSchema ? args.paramsSchema.safeParseAsync(req.params) : null,
      args.querySchema ? args.querySchema.safeParseAsync(req.query) : null,
    ]);

    // We update req.body with validated body as Zod
    // also handles type conversions.
    if (body) {
      if (body.success) {
        req.body = body.data;
      } else {
        throw new ApiError(400, z.prettifyError(body.error));
      }
    }

    if (params && !params.success) {
      throw new ApiError(400, z.prettifyError(params.error));
    }

    if (query && !query.success) {
      throw new ApiError(400, z.prettifyError(query.error));
    }

    next();
  };

export default validateRequest;
