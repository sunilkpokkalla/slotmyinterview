import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";
import { AuthenticatedRequest, ApiResponse, PipelineStage } from "../types/index.js";
import { AppError } from "../middleware/errorHandler.js";
import { queues } from "../queues/index.js";
import { emailService } from "../services/email.service.js";
import { config } from "../config/env.js";

export const providerController = {
  async getProviderProfile(userId: string) {
    const profile = await prisma.providerProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new AppError("Company / Job provider profile not found", 404);
    }
    return profile;
  },

  // ====================================================
  // Company Profile Management
  // ====================================================
  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const provider = await providerController.getProviderProfile(req.user!.id);
      res.status(200).json({
        success: true,
        data: provider,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const provider = await providerController.getProviderProfile(req.user!.id);
      const { companyName, logoUrl, website, description, location } = req.body;

      const updated = await prisma.providerProfile.update({
        where: { id: provider.id },
        data: {
          companyName: companyName ?? provider.companyName,
          logoUrl: logoUrl !== undefined ? logoUrl : provider.logoUrl,
          website: website ?? provider.website,
          description: description ?? provider.description,
          location: location !== undefined ? location : provider.location,
        },
      });

      res.status(200).json({
        success: true,
        message: "Company profile updated successfully",
        data: updated,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // ====================================================
  // Job Postings & Match Trigger
  // ====================================================
  async createJob(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const provider = await providerController.getProviderProfile(req.user!.id);
      const {
        title,
        description,
        categoryId,
        requiredSkillIds,
        preferredSkillIds,
        salaryMin,
        salaryMax,
        currency,
        location,
        workLocation,
        workType,
        isActive,
      } = req.body;

      const job = await prisma.job.create({
        data: {
          providerId: provider.id,
          title,
          description,
          categoryId,
          salaryMin,
          salaryMax,
          currency: currency || "USD",
          location,
          workLocation,
          workType,
          isActive: isActive !== undefined ? isActive : true,
          requiredSkills: {
            connect: (requiredSkillIds || []).map((id: string) => ({ id })),
          },
          preferredSkills: {
            connect: (preferredSkillIds || []).map((id: string) => ({ id })),
          },
        },
        include: {
          category: true,
          requiredSkills: true,
          preferredSkills: true,
        },
      });

      // Trigger asynchronous BullMQ job matching & personalized email alerts
      if (job.isActive) {
        await queues.enqueueJobMatch(job.id);
      }

      res.status(201).json({
        success: true,
        message: "Job posted successfully. Matching background worker alerted.",
        data: job,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async getMyJobs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const provider = await providerController.getProviderProfile(req.user!.id);

      const jobs = await prisma.job.findMany({
        where: { providerId: provider.id },
        include: {
          category: true,
          requiredSkills: true,
          preferredSkills: true,
          _count: {
            select: { submissions: true, interviewSlots: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      res.status(200).json({
        success: true,
        data: jobs,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async getJobById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const job = await prisma.job.findUnique({
        where: { id },
        include: {
          provider: true,
          category: true,
          requiredSkills: true,
          preferredSkills: true,
          interviewSlots: {
            where: { isBooked: false, startTime: { gte: new Date() } },
            orderBy: { startTime: "asc" },
          },
        },
      });

      if (!job) {
        throw new AppError("Job not found", 404);
      }

      res.status(200).json({
        success: true,
        data: job,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // ====================================================
  // Kanban Pipeline: submitted, tasked, shortlisted, interviewed, offered, rejected
  // ====================================================
  async getJobPipeline(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const provider = await providerController.getProviderProfile(req.user!.id);
      const { jobId } = req.params;

      const job = await prisma.job.findFirst({
        where: { id: jobId, providerId: provider.id },
      });

      if (!job) {
        throw new AppError("Job not found or access denied", 404);
      }

      const submissions = await prisma.submission.findMany({
        where: { jobId },
        include: {
          seeker: {
            include: {
              skills: { include: { skill: true } },
              portfolioLinks: true,
            },
          },
          taskAssignments: {
            orderBy: { assignedAt: "desc" },
          },
          interviews: {
            include: { slot: true },
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      // Format into standard Kanban columns
      const stages: PipelineStage[] = [
        "SUBMITTED",
        "TASKED",
        "SHORTLISTED",
        "INTERVIEWED",
        "OFFERED",
        "REJECTED",
      ];

      const kanbanBoard: Record<PipelineStage, any[]> = {
        SUBMITTED: [],
        TASKED: [],
        SHORTLISTED: [],
        INTERVIEWED: [],
        OFFERED: [],
        REJECTED: [],
      };

      submissions.forEach((sub) => {
        if (kanbanBoard[sub.stage]) {
          kanbanBoard[sub.stage].push(sub);
        }
      });

      res.status(200).json({
        success: true,
        data: {
          jobId: job.id,
          jobTitle: job.title,
          totalCandidates: submissions.length,
          columns: stages.map((stage) => ({
            stage,
            count: kanbanBoard[stage].length,
            submissions: kanbanBoard[stage],
          })),
        },
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async updateSubmissionStage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const provider = await providerController.getProviderProfile(req.user!.id);
      const { submissionId } = req.params;
      const { stage, notes } = req.body;

      const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        include: {
          job: true,
          seeker: { include: { user: true } },
        },
      });

      if (!submission || submission.job.providerId !== provider.id) {
        throw new AppError("Candidate submission not found or unauthorized", 404);
      }

      const updated = await prisma.submission.update({
        where: { id: submissionId },
        data: {
          stage,
          notes: notes !== undefined ? notes : submission.notes,
        },
        include: {
          seeker: true,
          taskAssignments: true,
          interviews: true,
        },
      });

      res.status(200).json({
        success: true,
        message: `Candidate moved to stage: ${stage}`,
        data: updated,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // ====================================================
  // Task Assignment from TASKED Column
  // ====================================================
  async assignTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const provider = await providerController.getProviderProfile(req.user!.id);
      const { submissionId } = req.params;
      const { taskType, title, instructions, deadline } = req.body;

      const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        include: {
          job: { include: { provider: true } },
          seeker: { include: { user: true } },
        },
      });

      if (!submission || submission.job.providerId !== provider.id) {
        throw new AppError("Submission not found or unauthorized", 404);
      }

      // Automatically ensure stage is TASKED
      if (submission.stage !== "TASKED") {
        await prisma.submission.update({
          where: { id: submissionId },
          data: { stage: "TASKED" },
        });
      }

      const task = await prisma.candidateTask.create({
        data: {
          submissionId,
          taskType,
          title,
          instructions,
          deadline: new Date(deadline),
          status: "PENDING",
        },
      });

      // Send personalized task assignment email
      const emailPayload = emailService.createTaskAssignmentEmail({
        candidateName: submission.seeker.fullName,
        jobTitle: submission.job.title,
        companyName: submission.job.provider.companyName,
        taskTitle: title,
        taskType,
        instructions,
        deadline: new Date(deadline).toLocaleString(),
        dashboardUrl: `${config.frontendUrl}/dashboard?tab=tasks`,
      });

      await emailService.sendEmail({
        to: submission.seeker.user.email,
        ...emailPayload,
      });

      res.status(201).json({
        success: true,
        message: "Challenge / Task assigned to candidate with deadline",
        data: task,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async reviewTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const provider = await providerController.getProviderProfile(req.user!.id);
      const { taskId } = req.params;
      const { status, score, feedback } = req.body;

      const task = await prisma.candidateTask.findUnique({
        where: { id: taskId },
        include: {
          submission: {
            include: { job: true, seeker: true },
          },
        },
      });

      if (!task || task.submission.job.providerId !== provider.id) {
        throw new AppError("Task not found or unauthorized", 404);
      }

      const updatedTask = await prisma.candidateTask.update({
        where: { id: taskId },
        data: {
          status,
          score,
          feedback,
          reviewedAt: new Date(),
        },
      });

      // Recompute candidate talent score based on new assessment score
      await queues.enqueueTalentScoring(task.submission.seekerId);

      res.status(200).json({
        success: true,
        message: "Candidate task reviewed and scored",
        data: updatedTask,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // ====================================================
  // Interview Scheduler Slots (In-person or Remote)
  // ====================================================
  async createInterviewSlot(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const provider = await providerController.getProviderProfile(req.user!.id);
      const { jobId } = req.params;
      const { format, location, startTime, endTime } = req.body;

      const job = await prisma.job.findFirst({
        where: { id: jobId, providerId: provider.id },
      });

      if (!job) {
        throw new AppError("Job not found or unauthorized", 404);
      }

      const slot = await prisma.interviewSlot.create({
        data: {
          jobId,
          format,
          location, // Remote meeting URL (Google Meet / Zoom) or In-person office address
          startTime: new Date(startTime),
          endTime: new Date(endTime),
        },
      });

      res.status(201).json({
        success: true,
        message: "Interview slot defined successfully",
        data: slot,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async listInterviewSlots(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { jobId } = req.params;

      const slots = await prisma.interviewSlot.findMany({
        where: { jobId },
        include: {
          booking: {
            include: {
              submission: {
                include: { seeker: true },
              },
            },
          },
        },
        orderBy: { startTime: "asc" },
      });

      res.status(200).json({
        success: true,
        data: slots,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },
};

