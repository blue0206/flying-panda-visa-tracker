import pino from "pino";
import { envConfig } from "./config.js";
import type { LoggerOptions } from "pino";

const level = envConfig.LOG_LEVEL;
const pinoOptions: LoggerOptions = {
  level,
};

if (envConfig.NODE_ENV === "development") {
  pinoOptions.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      ignore: "pid,hostname",
    },
  };
} else {
  pinoOptions.transport = undefined;
}

pinoOptions.formatters = {
  level: (label): object => ({ level: label }),
};
pinoOptions.timestamp = pino.stdTimeFunctions.isoTime;

export const logger = pino(pinoOptions);

logger.info(`Logger initialized with level: ${level}`);
