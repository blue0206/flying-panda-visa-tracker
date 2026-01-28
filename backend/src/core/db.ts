import mongoose from "mongoose";
import { MongooseError } from "mongoose";
import { envConfig } from "./config.js";
import { logger } from "./logger.js";

const connectMongo = async () => {
  try {
    await mongoose.connect(envConfig.DATABASE_URL);
    logger.info("MongoDB client connected.");
  } catch (err: unknown) {
    if (err instanceof MongooseError) {
      logger.error(err.message);
    } else {
      logger.error(err);
    }
    process.exit(1);
  }
};

const disconnectMongo = async () => {
  try {
    await mongoose.connection.close(false);
    logger.info("MongoDB client disconnected.");
  } catch (err: unknown) {
    if (err instanceof MongooseError) {
      logger.error(err.message);
    } else {
      logger.error(err);
    }
  }
};

export { connectMongo, disconnectMongo };
