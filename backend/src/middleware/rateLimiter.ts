import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { getRedisClient, isRedisConnected } from "../config/redis.js";
import { logger } from "../config/logger.js";

// Standard API rate limiter
export const standardLimiter = () => {
  const redis = getRedisClient();
  const useRedis = isRedisConnected() && redis !== null;

  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    store: useRedis
      ? new RedisStore({
          sendCommand: (...args: string[]) => (redis as any).call(...args),
          prefix: "rl:std:",
        })
      : undefined,
    message: {
      success: false,
      message: "Too many requests from this IP, please try again after 15 minutes",
    },
  });
};

// Strict rate limiter for Authentication and Password endpoints
export const authLimiter = () => {
  const redis = getRedisClient();
  const useRedis = isRedisConnected() && redis !== null;

  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 25, // Limit each IP to 25 attempts
    standardHeaders: true,
    legacyHeaders: false,
    store: useRedis
      ? new RedisStore({
          sendCommand: (...args: string[]) => (redis as any).call(...args),
          prefix: "rl:auth:",
        })
      : undefined,
    message: {
      success: false,
      message: "Too many authentication attempts, please try again after 15 minutes",
    },
  });
};

