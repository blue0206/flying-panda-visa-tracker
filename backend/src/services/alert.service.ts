import alertModel from "../models/alert.model.js";
import type { AlertInDB } from "../types/alert.js";
import { ApiError } from "../types/api.js";

export class AlertService {
  async getAllAlerts(): Promise<AlertInDB[]> {
    return await alertModel.find();
  }

  async addAlert(data: Partial<AlertInDB>): Promise<AlertInDB> {
    const newEntry = new alertModel(data);

    return await newEntry.save();
  }

  async updateAlert(id: string, data: Partial<AlertInDB>): Promise<AlertInDB> {
    const updatedData = await alertModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedData) {
      throw new ApiError<string>(404, "Alert not found in database.");
    }
    return updatedData;
  }

  async deleteAlert(id: string): Promise<void> {
    const data = await alertModel.findByIdAndDelete(id);

    if (!data) {
      throw new ApiError<string>(404, "Alert not found in database.");
    }
  }
}
