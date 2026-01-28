import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { ApiResponse } from "./types/api.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/healthcheck", (_req: Request, res: Response) => {
  const data: ApiResponse<string> = {
    success: true,
    statusCode: 200,
    payload: "The visa status API is up and running!",
  };

  res.status(200).json(data);
});

app.listen(8000, async () => {
  console.log("Server running on port: ", 8000);
});
