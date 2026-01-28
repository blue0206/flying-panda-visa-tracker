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
