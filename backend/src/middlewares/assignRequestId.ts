import { v4 as uuidv4 } from "uuid";
import type { Request, Response, NextFunction } from "express";
import { logger } from "../core/logger.js";

export default function assignRequestIdAndChildLogger(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  req.requestId = uuidv4();
  req.log = logger.child({ requestId: req.requestId });
  next();
}
