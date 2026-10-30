import { createApp } from "./app.js";
import { config } from "./config/env.js";
import { logger } from "./config/logger.js";
import { checkDatabaseConnection, prisma } from "./config/prisma.js";
import { getRedisClient } from "./config/redis.js";

async function bootstrap() {
  logger.info("Starting SlotMyInterview Backend Server...");

  // Verify database connection
  const dbOk = await checkDatabaseConnection();
  if (!dbOk) {
    logger.warn("Database connection could not be verified at startup; queries will attempt connection on demand.");
  }

  // Initialize Redis client
  getRedisClient();

  const app = createApp();

  const server = app.listen(config.port, () => {
    logger.info(`🚀 Server running in [${config.env}] mode on port ${config.port}`);
    logger.info(`📖 Interactive API Docs available at: http://localhost:${config.port}/api-docs`);
    logger.info(`🌐 Health check available at: http://localhost:${config.port}/health`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      logger.info("HTTP server closed.");
      try {
        await prisma.$disconnect();
        logger.info("Database connection closed.");
      } catch (err: any) {
        logger.error(`Error during database disconnect: ${err.message}`);
      }
      process.exit(0);
    });

    // Force shutdown if taking longer than 10s
    setTimeout(() => {
      logger.error("Could not close connections in time, forcefully shutting down");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

bootstrap().catch((error) => {
  logger.error("Fatal startup error:", { error });
  process.exit(1);
});

