import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import { AuthenticatedRequest, AuthenticatedUser, Role } from "../types/index.js";
import { AppError } from "./errorHandler.js";

interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

export const authenticateJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authorization token required", 401);
    }

    const token = authHeader.split(" ")[1];
    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        throw new AppError("Access token expired", 401);
      }
      throw new AppError("Invalid or malformed access token", 401);
    }

    // Verify user still exists in DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        seekerProfile: { select: { id: true, username: true } },
        providerProfile: { select: { id: true } },
      },
    });

    if (!user) {
      throw new AppError("User account no longer exists", 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      seekerProfileId: user.seekerProfile?.id,
      providerProfileId: user.providerProfile?.id,
      username: user.seekerProfile?.username,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (...allowedRoles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access forbidden: requires one of [${allowedRoles.join(", ")}] roles`,
          403
        )
      );
    }

    next();
  };
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          seekerProfile: { select: { id: true, username: true } },
          providerProfile: { select: { id: true } },
        },
      });

      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          seekerProfileId: user.seekerProfile?.id,
          providerProfileId: user.providerProfile?.id,
          username: user.seekerProfile?.username,
        };
      }
    }
  } catch {
    // Silently continue for optional auth
  }
  next();
};

