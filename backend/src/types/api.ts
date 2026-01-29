import { Alert } from "./alert.js";

export interface ApiResponse<PayloadType> {
  success: boolean;
  statusCode: number;
  payload: PayloadType;
}

export class ApiError<PayloadType> extends Error {
  success: boolean = false;
  statusCode: number;
  payload: PayloadType;

  constructor(statusCode: number, payload: PayloadType) {
    super();
    this.statusCode = statusCode;
    this.payload = payload;
  }
}

// Response Payload interface for GET /alerts
export interface GetAlertResponsePayload {
  data: Alert[];
  pagination: Pagination;
}
type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
