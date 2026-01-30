import "dotenv/config";
import { envConfig } from "./core/config.js";
import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { ApiResponse } from "./types/api.js";
import { connectMongo, disconnectMongo } from "./core/db.js";
import assignRequestId from "./middlewares/assignRequestId.js";
import { loggerMiddleware } from "./middlewares/loggerMiddleware.js";
import { logger } from "./core/logger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import alertRouter from "./routes/alert.routes.js";
import { Server } from "http";

const app = express();

app.use(assignRequestId);
app.use(loggerMiddleware);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/alerts", alertRouter);
app.use("/api/v1/healthcheck", (_req: Request, res: Response) => {
  const data: ApiResponse<string> = {
    success: true,
    statusCode: 200,
    payload: "The visa status API is up and running!",
  };

  res.status(200).json(data);
});

// Error Middleware
app.use(errorHandler);

const server: Server = app.listen(envConfig.PORT, async () => {
  await connectMongo();
  logger.info(`Server running on port: ${envConfig.PORT}`);
});

let shuttingDown = false;

async function gracefulShutdown(signal: NodeJS.Signals): Promise<void> {
  if (shuttingDown) {
    logger.warn(`Already shutting down. Ignoring signal: ${signal}`);
    return;
  }
  shuttingDown = true;
  logger.warn(`Received signal: ${signal}. Gracefully shutting down.`);

  server.close(async (err) => {
    if (err) {
      logger.error({ err }, "Error shutting down the server.");
      process.exitCode = 1;
    } else {
      logger.info("Server shut down successfully.");
    }

    await disconnectMongo();

    logger.info("Graceful shutdown complete. Exiting.");
    process.exit();
  });

  const shutdownTimeout = 11000;
  setTimeout(() => {
    logger.error(`Graceful shutdown timed out after 11 seconds. Forcing exit.`);
    process.exit(1);
  }, shutdownTimeout).unref();
}

process.on("SIGINT", async () => {
  await gracefulShutdown("SIGINT");
});
process.on("SIGTERM", async () => {
  await gracefulShutdown("SIGTERM");
});

// Global Exception/Rejection Handlers
process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Uncaught exception.");
  process.exit(1);
});
process.on("unhandledRejection", async (reason, promise) => {
  logger.fatal({ reason, promise }, "Unhandled rejection.");

  await gracefulShutdown("SIGTERM");
  process.exit(1);
});
