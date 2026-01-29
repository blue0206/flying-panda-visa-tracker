import z from "zod";

// Request Body Schema.
export const AlertSchema = z.object({
  country: z.string().min(1, { error: "Country is required." }),
  city: z.string().min(1, { error: "City is required." }),
  visaType: z.enum(["Tourist", "Business", "Student"], {
    error: "Visa type must be one of: Tourist, Business, Student.",
  }),
  status: z.enum(["Active", "Booked", "Expired"], {
    error: "Status must be one of: Active, Booked, Expired.",
  }),
});
export type AlertDTO = z.infer<typeof AlertSchema>;

// Request Params Schema.
export const AlertParamsSchema = z.object({
  alertId: z.string().min(1, { error: "Alert ID is missing." }),
});
export type AlertParamsDTO = z.infer<typeof AlertParamsSchema>;

// Request Query Schema.
export const AlertQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  country: z.string().optional(),
  city: z.string().optional(),
  visaType: z.enum(["Tourist", "Business", "Student"]).optional(),
  status: z.enum(["Active", "Booked", "Expired"]).optional(),
});
export type AlertQueryDTO = z.infer<typeof AlertQuerySchema>;
