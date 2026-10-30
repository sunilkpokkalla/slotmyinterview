import { Redis } from "ioredis";
import { config } from "./env.js";
import { logger } from "./logger.js";

let redisClient: Redis | null = null;
let isRedisAvailable = false;

export function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;

  try {
    const client = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: true,
      retryStrategy(times) {
        if (times > 3) {
          logger.warn("Redis connection failed multiple times. Caching and BullMQ will operate with memory/in-process fallbacks.");
          return null; // Stop retrying to avoid spamming logs
        }
        return Math.min(times * 200, 2000);
      },
    });

    client.on("connect", () => {
      isRedisAvailable = true;
      logger.info(`Redis connected successfully at ${config.redis.host}:${config.redis.port}`);
    });

    client.on("error", (err) => {
      isRedisAvailable = false;
      logger.warn(`Redis connection error: ${err.message}`);
    });

    redisClient = client;
    return redisClient;
  } catch (error) {
    logger.warn("Redis client initialization failed; using in-memory fallbacks.");
    return null;
  }
}

export function isRedisConnected(): boolean {
  return isRedisAvailable;
}

// In-memory fallback cache for development or when Redis is unavailable
const memoryCache = new Map<string, { value: string; expiresAt?: number }>();

export const cacheService = {
  async get(key: string): Promise<string | null> {
    const client = getRedisClient();
    if (isRedisAvailable && client) {
      try {
        return await client.get(key);
      } catch {
        // Fallback to memory
      }
    }

    const item = memoryCache.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      memoryCache.delete(key);
      return null;
    }
    return item.value;
  },

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const client = getRedisClient();
    if (isRedisAvailable && client) {
      try {
        if (ttlSeconds) {
          await client.set(key, value, "EX", ttlSeconds);
        } else {
          await client.set(key, value);
        }
        return;
      } catch {
        // Fallback to memory
      }
    }

    memoryCache.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
    });
  },

  async del(key: string): Promise<void> {
    const client = getRedisClient();
    if (isRedisAvailable && client) {
      try {
        await client.del(key);
      } catch {
        // Fallback to memory
      }
    }
    memoryCache.delete(key);
  },

  async flushPattern(patternPrefix: string): Promise<void> {
    for (const key of memoryCache.keys()) {
      if (key.startsWith(patternPrefix)) {
        memoryCache.delete(key);
      }
    }
    const client = getRedisClient();
    if (isRedisAvailable && client) {
      try {
        const keys = await client.keys(`${patternPrefix}*`);
        if (keys.length > 0) {
          await client.del(...keys);
        }
      } catch {
        // Ignore
      }
    }
  }
};

