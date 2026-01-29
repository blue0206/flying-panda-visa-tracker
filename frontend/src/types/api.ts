import z from "zod";

export interface ApiResponse<PayloadType> {
  success: boolean;
  statusCode: number;
  payload: PayloadType;
}

// Request Body Schema. Sent with POST /alerts and PUT /alerts/:alertId
export const AlertRequestSchema = z.object({
  country: z.string().min(1, { error: "Country is required." }),
  city: z.string().min(1, { error: "City is required." }),
  visaType: z.enum(["Tourist", "Business", "Student"], {
    error: "Visa type must be one of: Tourist, Business, Student.",
  }),
  status: z.enum(["Active", "Booked", "Expired"], {
    error: "Status must be one of: Active, Booked, Expired.",
  }),
});
export type AlertRequestDTO = z.infer<typeof AlertRequestSchema>;

// Alert Schema for alert object returned from backend.
export const AlertSchema = z.object({
  id: z.string().min(1, { error: "Alert id is missing." }),
  country: z.string().min(1, { error: "Country is missing." }),
  city: z.string().min(1, { error: "City is missing." }),
  visaType: z.enum(["Tourist", "Business", "Student"], {
    error: "Visa type is invalid.",
  }),
  status: z.enum(["Active", "Booked", "Expired"], {
    error: "Status is invalid.",
  }),
});
export type AlertType = z.infer<typeof AlertSchema>;

// Pagination details schema (returned from GET /alerts)
const PaginationSchema = z.object({
  page: z.coerce.number().int(),
  limit: z.coerce.number().int(),
  total: z.coerce.number().int(),
  totalPages: z.coerce.number().int(),
});

// Response payload schema for GET /alerts
export const GetAlertsResponseSchema = z.object({
  data: z.array(AlertSchema),
  pagination: PaginationSchema,
});
export type GetAlertsResponseDTO = z.infer<typeof GetAlertsResponseSchema>;

// Query type for updateAlert endpoint.
export interface UpdateAlertType {
  body: AlertRequestDTO;
  id: string;
}
