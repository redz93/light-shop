import pino from "pino";
import { env, isProd } from "../config/env";

export const logger = pino({
  level: env.LOG_LEVEL,
  // Jamais de secrets dans les logs.
  redact: ["req.headers.authorization", "req.headers.cookie", "res.headers['set-cookie']"],
  ...(isProd || env.NODE_ENV === "test"
    ? {}
    : { transport: { target: "pino-pretty", options: { colorize: true, translateTime: "HH:MM:ss" } } }),
});
