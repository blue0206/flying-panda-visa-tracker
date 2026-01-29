import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GetAlertsResponseSchema } from "../types/api";
import type {
  ApiResponse,
  GetAlertsResponseDTO,
  AlertType,
  AlertRequestDTO,
  UpdateAlertType,
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
    createAlert: build.mutation<AlertType, AlertRequestDTO>({
      query: (data: AlertRequestDTO) => ({
        url: `/alerts`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Alerts"],
    }),
    updateAlert: build.mutation<AlertType, UpdateAlertType>({
      query: ({ body, id }: UpdateAlertType) => ({
        url: `/alerts/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Alerts"],
    }),
  }),
});

export const { useGetAlertsQuery } = apiSlice;
