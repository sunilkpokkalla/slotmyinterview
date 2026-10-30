import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import swaggerUi from "swagger-ui-express";

import { config } from "./config/env.js";
import { logger } from "./config/logger.js";
import { standardLimiter } from "./middleware/rateLimiter.js";
import { errorHandler, AppError } from "./middleware/errorHandler.js";
import { openApiSpec } from "./docs/openapi.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import taxonomyRoutes from "./routes/taxonomy.routes.js";
import seekerRoutes from "./routes/seeker.routes.js";
import providerRoutes from "./routes/provider.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import { seekerController } from "./controllers/seeker.controller.js";

export const createApp = (): Express => {
  const app = express();

  // Basic Security & Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  // CORS
  app.use(
    cors({
      origin: [config.frontendUrl, "http://localhost:3000", "https://slotmyinterview.com"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
  );

  // Body Parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // HTTP Request Logging
  const morganFormat = config.env === "production" ? "combined" : "dev";
  app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => logger.http(message.trim()),
      },
    })
  );

  // Serve static uploaded files (photos, avatars)
  app.use("/uploads", express.static(config.storage.uploadDir));

  // Swagger Documentation
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
  app.get("/api-docs/json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(openApiSpec);
  });

  // Healthcheck endpoint
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: "slotmyinterview-backend",
      environment: config.env,
    });
  });

  // Apply rate limiter to standard API endpoints
  app.use("/api", standardLimiter());

  // Mount API v1 Routes
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/taxonomy", taxonomyRoutes);
  app.use("/api/v1/seekers", seekerRoutes);
  app.use("/api/v1/providers", providerRoutes);
  app.use("/api/v1/submissions", submissionRoutes);

  // Direct vanity URL endpoint: /u/:username
  app.get("/u/:username", (req: Request, res: Response, next: NextFunction) => {
    seekerController.getPublicProfile(req, res, next);
  });

  // 404 Handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Endpoint not found: ${req.method} ${req.originalUrl}`, 404));
  });

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
};
