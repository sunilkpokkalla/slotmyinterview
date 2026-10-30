import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";
import { AuthenticatedRequest, ApiResponse } from "../types/index.js";
import { AppError } from "../middleware/errorHandler.js";
import { storageService } from "../services/storage.service.js";
import { techDetectorService } from "../services/techDetector.service.js";
import { scoringService } from "../services/scoring.service.js";
import { queues } from "../queues/index.js";

export const seekerController = {
  // Helper to ensure seeker profile exists for logged-in user
  async getSeekerProfile(userId: string) {
    const profile = await prisma.seekerProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new AppError("Job seeker profile not found", 404);
    }
    return profile;
  },

  // ====================================================
  // Section 1: Identity
  // ====================================================
  async updateIdentity(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const seeker = await seekerController.getSeekerProfile(req.user!.id);
      const { fullName, headline, photoUrl, location, workAuthType } = req.body;

      const updated = await prisma.seekerProfile.update({
        where: { id: seeker.id },
        data: {
          fullName: fullName !== undefined ? fullName : seeker.fullName,
          headline: headline !== undefined ? headline : seeker.headline,
          photoUrl: photoUrl !== undefined ? photoUrl : seeker.photoUrl,
          location: location !== undefined ? location : seeker.location,
          workAuthType: workAuthType !== undefined ? workAuthType : seeker.workAuthType,
        },
      });

      await queues.enqueueTalentScoring(seeker.id);

      res.status(200).json({
        success: true,
        message: "Identity updated successfully",
        data: updated,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async uploadPhoto(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError("No photo uploaded", 400);
      }

      const seeker = await seekerController.getSeekerProfile(req.user!.id);
      const photoUrl = await storageService.saveFile(req.file);

      const updated = await prisma.seekerProfile.update({
        where: { id: seeker.id },
        data: { photoUrl },
      });

      await queues.enqueueTalentScoring(seeker.id);

      res.status(200).json({
        success: true,
        message: "Professional photo uploaded successfully",
        data: { photoUrl, profile: updated },
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // ====================================================
  // Section 2: Skills (Categorized, Draggable & Non-tech)
  // ====================================================
  async updateSkills(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const seeker = await seekerController.getSeekerProfile(req.user!.id);
      const { skills, nonTechSkills } = req.body; // skills: [{ skillId, displayOrder, yearsExp }]

      // Update skills in transaction
      await prisma.$transaction(async (tx) => {
        // Clear previous skills
        await tx.seekerSkill.deleteMany({
          where: { seekerId: seeker.id },
        });

        // Insert new draggable categorized technical skills
        if (skills && skills.length > 0) {
          await tx.seekerSkill.createMany({
            data: skills.map((s: any) => ({
              seekerId: seeker.id,
              skillId: s.skillId,
              displayOrder: s.displayOrder ?? 0,
              yearsExp: s.yearsExp ?? null,
            })),
          });
        }

        // Update non-technical free text skills
        if (nonTechSkills !== undefined) {
          await tx.seekerProfile.update({
            where: { id: seeker.id },
            data: { nonTechSkills },
          });
        }
      });

      await queues.enqueueTalentScoring(seeker.id);

      const updatedProfile = await prisma.seekerProfile.findUnique({
        where: { id: seeker.id },
        include: {
          skills: {
            include: { skill: { include: { category: true } } },
            orderBy: { displayOrder: "asc" },
          },
        },
      });

      res.status(200).json({
        success: true,
        message: "Skills updated successfully",
        data: updatedProfile,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // ====================================================
  // Section 3: Experience (Repeatable Entries)
  // ====================================================
  async addExperience(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const seeker = await seekerController.getSeekerProfile(req.user!.id);
      const { company, role, startDate, endDate, isCurrent, description, link } = req.body;

      const experience = await prisma.experience.create({
        data: {
          seekerId: seeker.id,
          company,
          role,
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
          isCurrent: isCurrent || false,
          description,
          link,
        },
      });

      await queues.enqueueTalentScoring(seeker.id);

      res.status(201).json({
        success: true,
        message: "Experience entry added",
        data: experience,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async updateExperience(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const seeker = await seekerController.getSeekerProfile(req.user!.id);
      const { id } = req.params;
      const { company, role, startDate, endDate, isCurrent, description, link } = req.body;

      const existing = await prisma.experience.findFirst({
        where: { id, seekerId: seeker.id },
      });

      if (!existing) {
        throw new AppError("Experience entry not found", 404);
      }

      const updated = await prisma.experience.update({
        where: { id },
        data: {
          company: company ?? existing.company,
          role: role ?? existing.role,
          startDate: startDate ? new Date(startDate) : existing.startDate,
          endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : existing.endDate,
          isCurrent: isCurrent ?? existing.isCurrent,
          description: description ?? existing.description,
          link: link !== undefined ? link : existing.link,
        },
      });

      await queues.enqueueTalentScoring(seeker.id);

      res.status(200).json({
        success: true,
        message: "Experience updated successfully",
        data: updated,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async deleteExperience(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const seeker = await seekerController.getSeekerProfile(req.user!.id);
      const { id } = req.params;

      await prisma.experience.deleteMany({
        where: { id, seekerId: seeker.id },
      });

      await queues.enqueueTalentScoring(seeker.id);

      res.status(200).json({
        success: true,
        message: "Experience entry removed",
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // ====================================================
  // Section 4: Portfolio (Auto-grouped by detected technology)
  // ====================================================
  async addPortfolioLink(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const seeker = await seekerController.getSeekerProfile(req.user!.id);
      const { platform, url, title, detectedTechStack } = req.body;

      // Auto-detect tech stack if not manually specified
      const autoTechStack = detectedTechStack && detectedTechStack.length > 0
        ? detectedTechStack
        : techDetectorService.detectTechnologiesFromUrlAndTitle(url, title, platform);

      const portfolioLink = await prisma.portfolioLink.create({
        data: {
          seekerId: seeker.id,
          platform,
          url,
          title: title || `${platform} Portfolio`,
          detectedTechStack: autoTechStack,
        },
      });

      await queues.enqueueTalentScoring(seeker.id);

      res.status(201).json({
        success: true,
        message: "Portfolio project link added and technology stack auto-detected",
        data: portfolioLink,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async deletePortfolioLink(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const seeker = await seekerController.getSeekerProfile(req.user!.id);
      const { id } = req.params;

      await prisma.portfolioLink.deleteMany({
        where: { id, seekerId: seeker.id },
      });

      await queues.enqueueTalentScoring(seeker.id);

      res.status(200).json({
        success: true,
        message: "Portfolio link removed",
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // ====================================================
  // Section 5: Social Profiles & Bio
  // ====================================================
  async updateSocialsAndBio(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const seeker = await seekerController.getSeekerProfile(req.user!.id);
      const { bio, socialProfiles } = req.body;

      await prisma.$transaction(async (tx) => {
        if (bio !== undefined) {
          await tx.seekerProfile.update({
            where: { id: seeker.id },
            data: { bio },
          });
        }

        if (socialProfiles) {
          await tx.socialProfile.deleteMany({
            where: { seekerId: seeker.id },
          });

          if (socialProfiles.length > 0) {
            await tx.socialProfile.createMany({
              data: socialProfiles.map((s: any) => ({
                seekerId: seeker.id,
                platform: s.platform,
                url: s.url,
              })),
            });
          }
        }
      });

      await queues.enqueueTalentScoring(seeker.id);

      const updated = await prisma.seekerProfile.findUnique({
        where: { id: seeker.id },
        include: { socialProfiles: true },
      });

      res.status(200).json({
        success: true,
        message: "Social profiles and bio updated",
        data: updated,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // ====================================================
  // Availability Toggle (Green / Orange / Red)
  // ====================================================
  async updateAvailability(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const seeker = await seekerController.getSeekerProfile(req.user!.id);
      const { availability } = req.body;

      const updated = await prisma.seekerProfile.update({
        where: { id: seeker.id },
        data: { availability },
      });

      res.status(200).json({
        success: true,
        message: `Availability updated to ${availability}`,
        data: {
          availability: updated.availability,
          badgeColor:
            availability === "ACTIVELY_LOOKING"
              ? "green"
              : availability === "OPEN_TO_OPPORTUNITIES"
              ? "orange"
              : "red",
        },
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // ====================================================
  // Alert Settings Tuning (Cap 3/week, Pause toggle)
  // ====================================================
  async updateAlertSettings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const seeker = await seekerController.getSeekerProfile(req.user!.id);
      const { alertFrequencyMaxPerWeek, alertsPaused } = req.body;

      const updated = await prisma.seekerProfile.update({
        where: { id: seeker.id },
        data: {
          alertFrequencyMaxPerWeek: alertFrequencyMaxPerWeek ?? seeker.alertFrequencyMaxPerWeek,
          alertsPaused: alertsPaused ?? seeker.alertsPaused,
        },
      });

      res.status(200).json({
        success: true,
        message: "Alert settings updated",
        data: {
          alertFrequencyMaxPerWeek: updated.alertFrequencyMaxPerWeek,
          alertsPaused: updated.alertsPaused,
        },
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // ====================================================
  // Public Profile View (/u/:username)
  // ====================================================
  async getPublicProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username } = req.params;

      const profile = await prisma.seekerProfile.findUnique({
        where: { username: username.toLowerCase() },
        include: {
          skills: {
            include: { skill: { include: { category: true } } },
            orderBy: { displayOrder: "asc" },
          },
          experiences: { orderBy: { startDate: "desc" } },
          portfolioLinks: true,
          socialProfiles: true,
          endorsements: {
            include: {
              endorser: {
                select: { fullName: true, username: true, photoUrl: true, headline: true },
              },
            },
          },
        },
      });

      if (!profile) {
        throw new AppError(`User profile @${username} not found`, 404);
      }

      // Group portfolio links by detected technology
      const portfolioByTechnology: Record<string, any[]> = {};
      profile.portfolioLinks.forEach((link) => {
        link.detectedTechStack.forEach((tech) => {
          if (!portfolioByTechnology[tech]) {
            portfolioByTechnology[tech] = [];
          }
          portfolioByTechnology[tech].push(link);
        });
      });

      // Availability color indicator mapping
      const availabilityBadge = {
        status: profile.availability,
        color:
          profile.availability === "ACTIVELY_LOOKING"
            ? "green"
            : profile.availability === "OPEN_TO_OPPORTUNITIES"
            ? "orange"
            : "red",
        label:
          profile.availability === "ACTIVELY_LOOKING"
            ? "Actively Looking"
            : profile.availability === "OPEN_TO_OPPORTUNITIES"
            ? "Open to Opportunities"
            : "Not Looking",
      };

      res.status(200).json({
        success: true,
        data: {
          ...profile,
          availabilityBadge,
          portfolioByTechnology,
          publicUrl: `https://slotmyinterview.com/u/${profile.username}`,
        },
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // ====================================================
  // Search & Filter Public Profiles (Recruiter Search)
  // ====================================================
  async searchProfiles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        query,
        skill,
        skills,
        category,
        location,
        workAuthType,
        availability,
        minScore,
        sortBy = "compositeScore",
        sortOrder = "desc",
        page = 1,
        limit = 20,
      } = req.query as any;

      const whereClause: any = {};

      // General query match across name, headline, bio
      if (query) {
        whereClause.OR = [
          { fullName: { contains: String(query), mode: "insensitive" } },
          { headline: { contains: String(query), mode: "insensitive" } },
          { bio: { contains: String(query), mode: "insensitive" } },
        ];
      }

      // Filter by skill (single or multiple)
      const skillFilterList: string[] = [];
      if (skill) skillFilterList.push(String(skill));
      if (skills) {
        if (Array.isArray(skills)) skillFilterList.push(...skills.map(String));
        else skillFilterList.push(String(skills));
      }

      if (skillFilterList.length > 0) {
        whereClause.skills = {
          some: {
            skill: {
              OR: [
                { name: { in: skillFilterList, mode: "insensitive" } },
                { slug: { in: skillFilterList.map((s) => s.toLowerCase()) } },
              ],
            },
          },
        };
      }

      // Filter by category
      if (category) {
        whereClause.skills = {
          ...whereClause.skills,
          some: {
            skill: {
              category: {
                OR: [
                  { name: { equals: String(category), mode: "insensitive" } },
                  { slug: { equals: String(category).toLowerCase() } },
                ],
              },
            },
          },
        };
      }

      // Filter by location
      if (location) {
        whereClause.location = {
          contains: String(location),
          mode: "insensitive",
        };
      }

      // Filter by work authorization type
      if (workAuthType) {
        whereClause.workAuthType = {
          equals: String(workAuthType),
          mode: "insensitive",
        };
      }

      // Filter by availability
      if (availability) {
        whereClause.availability = availability;
      }

      // Filter by minimum composite talent score
      if (minScore) {
        whereClause.compositeScore = {
          gte: parseFloat(String(minScore)),
        };
      }

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const [profiles, total] = await Promise.all([
        prisma.seekerProfile.findMany({
          where: whereClause,
          skip,
          take,
          orderBy: { [String(sortBy)]: sortOrder },
          include: {
            skills: {
              include: { skill: { include: { category: true } } },
              orderBy: { displayOrder: "asc" },
            },
            portfolioLinks: true,
            _count: {
              select: { endorsements: true, experiences: true },
            },
          },
        }),
        prisma.seekerProfile.count({ where: whereClause }),
      ]);

      res.status(200).json({
        success: true,
        data: profiles,
        meta: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / take),
        },
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // ====================================================
  // Peer Endorsements
  // ====================================================
  async endorsePeer(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const endorserSeeker = await seekerController.getSeekerProfile(req.user!.id);
      const { seekerId, skillName, comment } = req.body;

      if (endorserSeeker.id === seekerId) {
        throw new AppError("You cannot endorse yourself", 400);
      }

      const endorsement = await prisma.endorsement.upsert({
        where: {
          seekerId_endorserId_skillName: {
            seekerId,
            endorserId: endorserSeeker.id,
            skillName,
          },
        },
        update: { comment },
        create: {
          seekerId,
          endorserId: endorserSeeker.id,
          skillName,
          comment,
        },
      });

      // Recompute target seeker's talent score
      await queues.enqueueTalentScoring(seekerId);

      res.status(201).json({
        success: true,
        message: `Endorsement recorded for ${skillName}`,
        data: endorsement,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // ====================================================
  // Talent Score Recalculation
  // ====================================================
  async recalculateScore(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const seeker = await seekerController.getSeekerProfile(req.user!.id);
      const score = await scoringService.computeSeekerTalentScore(seeker.id);

      res.status(200).json({
        success: true,
        message: "Talent score computed and refreshed successfully",
        data: score,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },
};

