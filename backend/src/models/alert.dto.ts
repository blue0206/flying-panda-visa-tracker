import z from "zod";

const AlertSchema = z.object({
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
