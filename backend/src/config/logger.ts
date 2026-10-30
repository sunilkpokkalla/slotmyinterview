import winston from "winston";
import { config } from "./env.js";

const { combine, timestamp, printf, colorize, json } = winston.format;

const customFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

export const logger = winston.createLogger({
  level: config.env === "development" ? "debug" : "info",
  format: config.env === "production" 
    ? combine(timestamp(), json()) 
    : combine(colorize(), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), customFormat),
  transports: [
    new winston.transports.Console(),
    ...(config.env === "production" 
      ? [
          new winston.transports.File({ filename: "logs/error.log", level: "error" }),
          new winston.transports.File({ filename: "logs/combined.log" })
        ] 
      : [])
  ],
  exceptionHandlers: [
    new winston.transports.Console()
  ]
});

