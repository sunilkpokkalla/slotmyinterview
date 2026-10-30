import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../config/prisma.js";
import { config } from "../config/env.js";
import { AppError } from "../middleware/errorHandler.js";
import { Role, AuthProvider, AvailabilityStatus } from "@prisma/client";
import { scoringService } from "./scoring.service.js";

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: Role;
    seekerProfileId?: string;
    providerProfileId?: string;
    username?: string;
  };
}

export const authService = {
  generateTokens(userId: string, email: string, role: Role): { accessToken: string; rawRefreshToken: string } {
    const accessToken = jwt.sign(
      { userId, email, role },
      config.jwt.accessSecret,
      { expiresIn: config.jwt.accessExpiresIn as any }
    );

    const rawRefreshToken = uuidv4();
    return { accessToken, rawRefreshToken };
  },

  async saveRefreshToken(userId: string, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  },

  async registerSeeker(data: {
    email: string;
    password: string;
    fullName: string;
    username: string;
    headline?: string;
  }): Promise<TokenPair> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      throw new AppError("An account with this email already exists", 409);
    }

    const existingUsername = await prisma.seekerProfile.findUnique({
      where: { username: data.username.toLowerCase() },
    });

    if (existingUsername) {
      throw new AppError("This username is already taken. Please choose another.", 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        role: Role.JOB_SEEKER,
        authProvider: AuthProvider.LOCAL,
        isEmailVerified: true, // Auto-verify for seamless onboarding
        seekerProfile: {
          create: {
            username: data.username.toLowerCase(),
            fullName: data.fullName,
            headline: data.headline || "Software Engineer",
            availability: AvailabilityStatus.ACTIVELY_LOOKING,
            alertFrequencyMaxPerWeek: 3,
            alertsPaused: false,
          },
        },
      },
      include: {
        seekerProfile: true,
      },
    });

    // Compute initial profile score
    if (user.seekerProfile) {
      await scoringService.computeSeekerTalentScore(user.seekerProfile.id);
    }

    const { accessToken, rawRefreshToken } = this.generateTokens(user.id, user.email, user.role);
    await this.saveRefreshToken(user.id, rawRefreshToken);

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        seekerProfileId: user.seekerProfile?.id,
        username: user.seekerProfile?.username,
      },
    };
  },

  async registerProvider(data: {
    email: string;
    password: string;
    companyName: string;
    website: string;
    description: string;
    logoUrl?: string;
    location?: string;
  }): Promise<TokenPair> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      throw new AppError("An account with this email already exists", 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        role: Role.JOB_PROVIDER,
        authProvider: AuthProvider.LOCAL,
        isEmailVerified: true,
        providerProfile: {
          create: {
            companyName: data.companyName,
            website: data.website,
            description: data.description,
            logoUrl: data.logoUrl,
            location: data.location,
          },
        },
      },
      include: {
        providerProfile: true,
      },
    });

    const { accessToken, rawRefreshToken } = this.generateTokens(user.id, user.email, user.role);
    await this.saveRefreshToken(user.id, rawRefreshToken);

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        providerProfileId: user.providerProfile?.id,
      },
    };
  },

  async login(email: string, password: string): Promise<TokenPair> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        seekerProfile: true,
        providerProfile: true,
      },
    });

    if (!user || !user.passwordHash) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const { accessToken, rawRefreshToken } = this.generateTokens(user.id, user.email, user.role);
    await this.saveRefreshToken(user.id, rawRefreshToken);

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        seekerProfileId: user.seekerProfile?.id,
        providerProfileId: user.providerProfile?.id,
        username: user.seekerProfile?.username,
      },
    };
  },

  async handleOAuthLogin(data: {
    provider: AuthProvider;
    providerId: string;
    email: string;
    fullName?: string;
    avatarUrl?: string;
    role: Role;
    username?: string;
  }): Promise<TokenPair> {
    const cleanEmail = data.email.toLowerCase();

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { authProvider: data.provider, providerId: data.providerId },
        ],
      },
      include: {
        seekerProfile: true,
        providerProfile: true,
      },
    });

    if (!user) {
      // Create fresh user account with OAuth provider
      const baseUsername = data.username || cleanEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
      const finalUsername = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;

      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          role: data.role,
          authProvider: data.provider,
          providerId: data.providerId,
          avatarUrl: data.avatarUrl,
          isEmailVerified: true,
          ...(data.role === Role.JOB_SEEKER
            ? {
                seekerProfile: {
                  create: {
                    username: finalUsername,
                    fullName: data.fullName || baseUsername,
                    photoUrl: data.avatarUrl,
                    headline: "Software Engineer",
                    availability: AvailabilityStatus.ACTIVELY_LOOKING,
                  },
                },
              }
            : {
                providerProfile: {
                  create: {
                    companyName: data.fullName || "Tech Company",
                    website: "https://slotmyinterview.com",
                    description: "Hiring engineering talent",
                    logoUrl: data.avatarUrl,
                  },
                },
              }),
        },
        include: {
          seekerProfile: true,
          providerProfile: true,
        },
      });

      if (user.seekerProfile) {
        await scoringService.computeSeekerTalentScore(user.seekerProfile.id);
      }
    }

    const { accessToken, rawRefreshToken } = this.generateTokens(user.id, user.email, user.role);
    await this.saveRefreshToken(user.id, rawRefreshToken);

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        seekerProfileId: user.seekerProfile?.id,
        providerProfileId: user.providerProfile?.id,
        username: user.seekerProfile?.username,
      },
    };
  },

  async refreshAccessToken(refreshTokenStr: string): Promise<{ accessToken: string; refreshToken: string }> {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshTokenStr },
      include: {
        user: {
          include: {
            seekerProfile: { select: { id: true, username: true } },
            providerProfile: { select: { id: true } },
          },
        },
      },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      if (storedToken) {
        await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      }
      throw new AppError("Invalid or expired refresh token. Please sign in again.", 401);
    }

    // Rotate refresh token
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    const { accessToken, rawRefreshToken } = this.generateTokens(
      storedToken.user.id,
      storedToken.user.email,
      storedToken.user.role
    );

    await this.saveRefreshToken(storedToken.user.id, rawRefreshToken);

    return {
      accessToken,
      refreshToken: rawRefreshToken,
    };
  },

  async logout(refreshTokenStr: string): Promise<void> {
    try {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshTokenStr },
      });
    } catch {
      // Ignore if token already revoked
    }
  },
};

