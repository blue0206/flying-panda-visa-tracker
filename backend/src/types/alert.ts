import { Document } from "mongoose";

export interface AlertInDB extends Document {
  id: string;
  country: string;
  city: string;
  visaType: "Tourist" | "Business" | "Student";
  status: "Active" | "Booked" | "Expired";
}
