import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js";
import {
  AlertParamsSchema,
  AlertQuerySchema,
  AlertSchema,
} from "../models/alert.dto.js";
import {
  createAlert,
  deleteAlert,
  getAlerts,
  updateAlert,
} from "../controllers/alert.controller.js";

const alertRouter = Router();

alertRouter.get(
  "/",
  validateRequest({ querySchema: AlertQuerySchema }),
  getAlerts,
);

alertRouter.post(
  "/",
  validateRequest({ bodySchema: AlertSchema }),
  createAlert,
);

alertRouter.put(
  "/:alertId",
  validateRequest({ bodySchema: AlertSchema, paramsSchema: AlertParamsSchema }),
  updateAlert,
);

alertRouter.delete(
  "/:alertId",
  validateRequest({ paramsSchema: AlertParamsSchema }),
  deleteAlert,
);

export default alertRouter;
