import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  GetAlertsResponseSchema,
  type ApiResponse,
  type GetAlertsResponseDTO,
} from "../types/api";
import z from "zod";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  }),
  tagTypes: ["Alerts"],
  endpoints: (build) => ({
    getAlerts: build.query<GetAlertsResponseDTO, string>({
      query: (queryArgs) => ({
        url: `/alerts${queryArgs}`,
        method: "GET",
      }),
      transformResponse: (result: ApiResponse<GetAlertsResponseDTO>) => {
        const parsedResult = GetAlertsResponseSchema.safeParse(result.payload);

        if (!parsedResult.success) {
          throw new Error(z.prettifyError(parsedResult.error));
        }

        return parsedResult.data;
      },
      providesTags: ["Alerts"],
    }),
  }),
});

export const { useGetAlertsQuery } = apiSlice;
