import * as jose from "jose";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../config/prisma.js";
import { config } from "../config/env.js";
import { supabase } from "../config/supabase.js";
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
  async generateTokens(userId: string, email: string, role: Role): Promise<{ accessToken: string; rawRefreshToken: string }> {
    const secret = new TextEncoder().encode(config.jwt.accessSecret);
    const accessToken = await new jose.SignJWT({ userId, email, role })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(config.jwt.accessExpiresIn || "7d")
      .sign(secret);

    const rawRefreshToken = uuidv4();
    return { accessToken, rawRefreshToken };
  },

  async registerSeeker(data: {
    email: string;
    password?: string;
    fullName: string;
    username: string;
    headline?: string;
    authUserId?: string;
  }): Promise<TokenPair> {
    const cleanEmail = data.email.toLowerCase();

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          ...(data.authUserId ? [{ authUserId: data.authUserId }] : []),
        ],
      },
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

    // If Supabase is connected and no authUserId passed, create in Supabase Auth
    let authUserId = data.authUserId;
    if (!authUserId && supabase && data.password) {
      try {
        const { data: suData, error: suError } = await supabase.auth.admin.createUser({
          email: cleanEmail,
          password: data.password,
          email_confirm: true,
          user_metadata: { full_name: data.fullName, role: "JOB_SEEKER" },
        });
        if (!suError && suData?.user) {
          authUserId = suData.user.id;
        }
      } catch {
        // Fall back to local account creation
      }
    }

    const user = await prisma.user.create({
      data: {
        authUserId,
        email: cleanEmail,
        role: Role.JOB_SEEKER,
        authProvider: AuthProvider.LOCAL,
        isEmailVerified: true,
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

    if (user.seekerProfile) {
      await scoringService.computeSeekerTalentScore(user.seekerProfile.id);
    }

    const { accessToken, rawRefreshToken } = await this.generateTokens(user.id, user.email, user.role);

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
    password?: string;
    companyName: string;
    website: string;
    description: string;
    logoUrl?: string;
    location?: string;
    authUserId?: string;
  }): Promise<TokenPair> {
    const cleanEmail = data.email.toLowerCase();

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          ...(data.authUserId ? [{ authUserId: data.authUserId }] : []),
        ],
      },
    });

    if (existingUser) {
      throw new AppError("An account with this email already exists", 409);
    }

    let authUserId = data.authUserId;
    if (!authUserId && supabase && data.password) {
      try {
        const { data: suData, error: suError } = await supabase.auth.admin.createUser({
          email: cleanEmail,
          password: data.password,
          email_confirm: true,
          user_metadata: { company_name: data.companyName, role: "JOB_PROVIDER" },
        });
        if (!suError && suData?.user) {
          authUserId = suData.user.id;
        }
      } catch {
        // Fall back to local account creation
      }
    }

    const user = await prisma.user.create({
      data: {
        authUserId,
        email: cleanEmail,
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

    const { accessToken, rawRefreshToken } = await this.generateTokens(user.id, user.email, user.role);

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

  async login(email: string, password?: string): Promise<TokenPair> {
    const cleanEmail = email.toLowerCase();

    // 1. If Supabase is active, try signing in with Supabase
    if (supabase && password) {
      try {
        const { data: suData, error: suError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (!suError && suData?.session) {
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { authUserId: suData.user.id },
                { email: cleanEmail },
              ],
            },
            include: {
              seekerProfile: true,
              providerProfile: true,
            },
          });

          if (user) {
            return {
              accessToken: suData.session.access_token,
              refreshToken: suData.session.refresh_token,
              user: {
                id: user.id,
                email: user.email,
                role: user.role,
                seekerProfileId: user.seekerProfile?.id,
                providerProfileId: user.providerProfile?.id,
                username: user.seekerProfile?.username,
              },
            };
          }
        }
      } catch {
        // Continue to local lookup
      }
    }

    // 2. Local lookup for demo / test accounts (e.g. sunil@slotmyinterview.com, recruiting@scale.ai)
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        seekerProfile: true,
        providerProfile: true,
      },
    });

    if (!user) {
      throw new AppError("Invalid email or user account not found", 401);
    }

    const { accessToken, rawRefreshToken } = await this.generateTokens(user.id, user.email, user.role);

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
          { authUserId: data.providerId },
        ],
      },
      include: {
        seekerProfile: true,
        providerProfile: true,
      },
    });

    if (!user) {
      const baseUsername = data.username || cleanEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
      const finalUsername = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;

      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          role: data.role,
          authProvider: data.provider,
          authUserId: data.providerId,
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

    const { accessToken, rawRefreshToken } = await this.generateTokens(user.id, user.email, user.role);

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
    // If Supabase is active and token is from Supabase
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshTokenStr });
        if (!error && data?.session) {
          return {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
          };
        }
      } catch {
        // Fall back to local token refresh
      }
    }

    // Local signed token refresh
    const secret = new TextEncoder().encode(config.jwt.accessSecret);
    const accessToken = await new jose.SignJWT({ refreshed: true })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(config.jwt.accessExpiresIn || "7d")
      .sign(secret);

    return {
      accessToken,
      refreshToken: uuidv4(),
    };
  },

  async logout(_refreshTokenStr?: string): Promise<void> {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Ignore
      }
    }
  },
};
