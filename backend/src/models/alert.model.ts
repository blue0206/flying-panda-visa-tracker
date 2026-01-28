import mongoose, { Schema } from "mongoose";
import type { AlertInDB } from "../types/alert.js";

const AlertSchema: Schema = new Schema(
  {
    country: { type: String, required: true },
    city: { type: String, required: true },
    visaType: {
      type: String,
      enum: ["Tourist", "Business", "Student"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Booked", "Expired"],
      default: "Active",
    },
  },
  { timestamps: true },
);

export default mongoose.model<AlertInDB>("Alert", AlertSchema);
