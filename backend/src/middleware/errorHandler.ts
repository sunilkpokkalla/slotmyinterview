import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger.js";
import { ApiResponse } from "../types/index.js";

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public details?: any;

  constructor(message: string, statusCode = 500, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));

    logger.warn(`Validation error on ${req.method} ${req.originalUrl}:`, {
      errors: formattedErrors,
    });

    res.status(400).json({
      success: false,
      message: "Validation Error",
      error: formattedErrors,
    } as ApiResponse);
    return;
  }

  // Known Operational Application Errors
  if (err instanceof AppError) {
    logger.warn(`Operational error: ${err.message} (${err.statusCode}) on ${req.method} ${req.originalUrl}`);

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.details,
    } as ApiResponse);
    return;
  }

  // Prisma Specific Errors
  if (err.code === "P2002") {
    const target = (err.meta?.target as string[])?.join(", ") || "field";
    logger.warn(`Prisma unique constraint failure on ${target}`);

    res.status(409).json({
      success: false,
      message: `A record with this ${target} already exists.`,
    } as ApiResponse);
    return;
  }

  if (err.code === "P2025") {
    res.status(404).json({
      success: false,
      message: "Requested record was not found.",
    } as ApiResponse);
    return;
  }

  // Unhandled / Internal Server Errors
  logger.error(`Unhandled internal error on ${req.method} ${req.originalUrl}:`, {
    error: err.message,
    stack: err.stack,
  });

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "production" 
      ? "Internal server error" 
      : err.message || "Something went wrong",
  } as ApiResponse);
};

