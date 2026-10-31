import { Response, NextFunction } from "express";
import * as jose from "jose";
import { config } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import { verifyToken } from "../config/supabase.js";
import { AuthenticatedRequest, Role } from "../types/index.js";
import { AppError } from "./errorHandler.js";

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

    // 1. Try Supabase Auth verification
    const supabaseUser = await verifyToken(token);
    if (supabaseUser) {
      // Find or provision user in Prisma
      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { authUserId: supabaseUser.authUserId },
            { email: supabaseUser.email.toLowerCase() },
          ],
        },
        include: {
          seekerProfile: { select: { id: true, username: true } },
          providerProfile: { select: { id: true } },
        },
      });

      if (!user) {
        // Auto-provision new Supabase OAuth / email user in local database
        const baseUsername = (supabaseUser.fullName || supabaseUser.email.split("@")[0])
          .toLowerCase()
          .replace(/[^a-z0-9_-]/g, "");
        const username = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;

        user = await prisma.user.create({
          data: {
            authUserId: supabaseUser.authUserId,
            email: supabaseUser.email.toLowerCase(),
            role: Role.JOB_SEEKER,
            isEmailVerified: true,
            avatarUrl: supabaseUser.avatarUrl,
            seekerProfile: {
              create: {
                username,
                fullName: supabaseUser.fullName || baseUsername,
                photoUrl: supabaseUser.avatarUrl,
                headline: "Software Engineer",
              },
            },
          },
          include: {
            seekerProfile: { select: { id: true, username: true } },
            providerProfile: { select: { id: true } },
          },
        });
      } else if (!user.authUserId) {
        // Link Supabase authUserId
        await prisma.user.update({
          where: { id: user.id },
          data: { authUserId: supabaseUser.authUserId },
        });
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        seekerProfileId: user.seekerProfile?.id,
        providerProfileId: user.providerProfile?.id,
        username: user.seekerProfile?.username,
      };

      return next();
    }

    // 2. Fallback to local / demo token verification via jose
    try {
      const secret = new TextEncoder().encode(config.jwt.accessSecret);
      const { payload } = await jose.jwtVerify(token, secret);
      const userId = (payload.userId || payload.sub) as string;

      const user = await prisma.user.findUnique({
        where: { id: userId },
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

      return next();
    } catch (err: any) {
      if (err instanceof AppError) throw err;
      throw new AppError("Invalid or expired access token", 401);
    }
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
      
      // Try Supabase verification
      const supabaseUser = await verifyToken(token);
      if (supabaseUser) {
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { authUserId: supabaseUser.authUserId },
              { email: supabaseUser.email.toLowerCase() },
            ],
          },
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
          return next();
        }
      }

      // Try local token
      const secret = new TextEncoder().encode(config.jwt.accessSecret);
      const { payload } = await jose.jwtVerify(token, secret);
      const userId = (payload.userId || payload.sub) as string;

      const user = await prisma.user.findUnique({
        where: { id: userId },
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
