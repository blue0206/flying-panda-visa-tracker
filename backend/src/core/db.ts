import mongoose from "mongoose";
import { MongooseError } from "mongoose";
import { envConfig } from "./config.js";

const connectMongo = async () => {
  try {
    await mongoose.connect(envConfig.DATABASE_URL);
    console.log("MongoDB client connected.");
  } catch (err: unknown) {
    if (err instanceof MongooseError) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    process.exit(1);
  }
};

const disconnectMongo = async () => {
  try {
    await mongoose.connection.close(false);
    console.log("MongoDB client disconnected.");
  } catch (err: unknown) {
    if (err instanceof MongooseError) {
      console.error(err.message);
    } else {
      console.error(err);
    }
  }
};

export { connectMongo, disconnectMongo };
