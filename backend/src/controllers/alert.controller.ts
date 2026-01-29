import { alertService } from "../services/alert.service.js";
import {
  ApiError,
  ApiResponse,
  GetAlertResponsePayload,
} from "../types/api.js";
import type { Alert } from "../types/alert.js";
import type {
  AlertDTO,
  AlertParamsDTO,
  AlertQueryDTO,
} from "../models/alert.dto.js";
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

export const createAlert = async (
  req: Request<unknown, unknown, AlertDTO>,
  res: Response,
): Promise<void> => {
  try {
    const data = await alertService.addAlert(req.body);

    const response: ApiResponse<Alert> = {
      success: true,
      statusCode: 201,
      payload: { ...data },
    };

    res.status(201).json(response);
  } catch (error) {
    throw new ApiError(500, error);
  }
};

export const updateAlert = async (
  req: Request<AlertParamsDTO, unknown, AlertDTO>,
  res: Response,
): Promise<void> => {
  try {
    const data = await alertService.updateAlert(req.params.alertId, req.body);

    const response: ApiResponse<Alert> = {
      success: true,
      statusCode: 200,
      payload: { ...data },
    };

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      // For the error we threw from service.
      throw error;
    }
    // For other DB-related errors.
    throw new ApiError(500, error);
  }
};

export const deleteAlert = async (
  req: Request<AlertParamsDTO>,
  res: Response,
): Promise<void> => {
  try {
    await alertService.deleteAlert(req.params.alertId);

    const response: ApiResponse<null> = {
      success: true,
      statusCode: 204,
      payload: null,
    };

    res.status(204).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      // For the error we threw from service.
      throw error;
    }

    // For other DB-related errors.
    throw new ApiError(500, error);
  }
};
