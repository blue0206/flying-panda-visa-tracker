import { Document } from "mongoose";

export interface Alert {
  id: string;
  country: string;
  city: string;
  visaType: "Tourist" | "Business" | "Student";
  status: "Active" | "Booked" | "Expired";
}

export interface AlertInDB extends Alert, Document {}

export interface AlertsWithPaginationAndFilter {
  alerts: AlertInDB[];
  total: number;
}
