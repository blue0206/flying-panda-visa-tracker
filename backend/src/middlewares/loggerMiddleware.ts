import { pinoHttp } from "pino-http";
import { logger } from "../core/logger.js";
import type { Request } from "express";

// Logs at start of req and return of res.
export const loggerMiddleware = pinoHttp({
  logger,
  customProps: (req: Request) => ({
    requestId: req.requestId,
  }),
});
