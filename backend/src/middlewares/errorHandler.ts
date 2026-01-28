import { ApiError, ApiResponse } from "../types/api.js";
import { envConfig } from "../core/config.js";
import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  req.log.error(
    { err, url: req.url, method: req.method },
    err.message || "Error encountered in Error Middleware.",
  );

  const errorResponse: ApiResponse<string> = {
    success: false,
    statusCode: 500,
    payload: "Internal Server Error",
  };

  if (err instanceof ApiError) {
    errorResponse.statusCode = err.statusCode;
    errorResponse.payload = err.payload;
  }

  if (envConfig.NODE_ENV === "production" && errorResponse.statusCode >= 500) {
    // We don't show detailed server errors to client in production.
    errorResponse.payload = "Internal Server Error";
  }

  res.status(errorResponse.statusCode).json(errorResponse);
};
