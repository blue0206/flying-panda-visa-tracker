import { AlertQueryDTO } from "../models/alert.dto.js";
import { alertService } from "../services/alert.service.js";
import {
  ApiError,
  ApiResponse,
  GetAlertResponsePayload,
} from "../types/api.js";
import type { Request, Response } from "express";

export const getAlerts = async (
  req: Request<unknown, unknown, unknown, AlertQueryDTO>,
  res: Response,
): Promise<void> => {
  const { page, limit, ...filters } = req.query;

  try {
    const { alerts, total } =
      await alertService.getAlertsWithPaginationAndFilter(page, limit, filters);

    const data: ApiResponse<GetAlertResponsePayload> = {
      success: true,
      statusCode: 200,
      payload: {
        data: alerts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };

    res.status(200).json(data);
  } catch (error: unknown) {
    throw new ApiError(500, error);
  }
};
