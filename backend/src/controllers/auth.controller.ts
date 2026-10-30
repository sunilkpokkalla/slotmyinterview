import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { prisma } from "../config/prisma.js";
import { AuthenticatedRequest, ApiResponse } from "../types/index.js";
import { AppError } from "../middleware/errorHandler.js";

export const authController = {
  async registerSeeker(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.registerSeeker(req.body);
      res.status(201).json({
        success: true,
        message: "Job seeker registered successfully",
        data: result,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async registerProvider(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.registerProvider(req.body);
      res.status(201).json({
        success: true,
        message: "Job provider registered successfully",
        data: result,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async oauthLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { provider, token, role, username } = req.body;
      
      // In production, exchange provider code/token with GitHub/Google/LinkedIn OAuth API
      // Here we simulate provider profile payload or verify access token
      const simulatedProviderEmail = `${provider.toLowerCase()}_user_${Date.now()}@example.com`;
      const simulatedProviderId = `oauth_${provider.toLowerCase()}_${Math.random().toString(36).substring(7)}`;

      const result = await authService.handleOAuthLogin({
        provider,
        providerId: simulatedProviderId,
        email: simulatedProviderEmail,
        fullName: `${provider} Verified User`,
        role: role || "JOB_SEEKER",
        username,
      });

      res.status(200).json({
        success: true,
        message: `${provider} OAuth login successful`,
        data: result,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshAccessToken(refreshToken);
      res.status(200).json({
        success: true,
        message: "Tokens refreshed successfully",
        data: result,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("Authentication required", 401);
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          seekerProfile: {
            include: {
              skills: { include: { skill: { include: { category: true } } }, orderBy: { displayOrder: "asc" } },
              experiences: { orderBy: { startDate: "desc" } },
              portfolioLinks: true,
              socialProfiles: true,
              endorsements: { include: { endorser: { select: { fullName: true, username: true } } } },
            },
          },
          providerProfile: {
            include: {
              jobs: { where: { isActive: true } },
            },
          },
        },
      });

      if (!user) {
        throw new AppError("User not found", 404);
      }

      const { passwordHash, ...safeUser } = user;

      res.status(200).json({
        success: true,
        data: safeUser,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },
};

