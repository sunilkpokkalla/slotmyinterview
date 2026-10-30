import { Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";
import { AuthenticatedRequest, ApiResponse } from "../types/index.js";
import { AppError } from "../middleware/errorHandler.js";
import { emailService } from "../services/email.service.js";

export const submissionController = {
  // Apply / Submit interest to a job
  async applyToJob(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const seeker = await prisma.seekerProfile.findUnique({
        where: { userId: req.user!.id },
      });

      if (!seeker) {
        throw new AppError("Seeker profile required to submit interest", 400);
      }

      const { jobId, coverNote } = req.body;

      const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: { provider: { include: { user: true } } },
      });

      if (!job || !job.isActive) {
        throw new AppError("Job posting is no longer active", 404);
      }

      const submission = await prisma.submission.upsert({
        where: {
          jobId_seekerId: {
            jobId,
            seekerId: seeker.id,
          },
        },
        update: {
          coverNote: coverNote || undefined,
        },
        create: {
          jobId,
          seekerId: seeker.id,
          stage: "SUBMITTED",
          coverNote,
        },
        include: {
          job: {
            include: { provider: true },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: "Interest successfully submitted to job pipeline",
        data: submission,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // Seeker views their active applications & pipeline statuses
  async getMyApplications(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const seeker = await prisma.seekerProfile.findUnique({
        where: { userId: req.user!.id },
      });

      if (!seeker) {
        throw new AppError("Seeker profile not found", 404);
      }

      const applications = await prisma.submission.findMany({
        where: { seekerId: seeker.id },
        include: {
          job: {
            include: {
              provider: true,
              category: true,
              interviewSlots: {
                where: { isBooked: false, startTime: { gte: new Date() } },
              },
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

      res.status(200).json({
        success: true,
        data: applications,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // Candidate submits solution for a task
  async submitTaskSolution(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const seeker = await prisma.seekerProfile.findUnique({
        where: { userId: req.user!.id },
      });

      if (!seeker) {
        throw new AppError("Seeker profile not found", 404);
      }

      const { taskId } = req.params;
      const { submissionUrl } = req.body;

      const task = await prisma.candidateTask.findUnique({
        where: { id: taskId },
        include: {
          submission: true,
        },
      });

      if (!task || task.submission.seekerId !== seeker.id) {
        throw new AppError("Task not found or access denied", 404);
      }

      const updated = await prisma.candidateTask.update({
        where: { id: taskId },
        data: {
          status: "SUBMITTED",
          submissionUrl,
          submittedAt: new Date(),
        },
      });

      res.status(200).json({
        success: true,
        message: "Task solution submitted for provider review",
        data: updated,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  // Shortlisted candidate books an interview slot
  async bookInterviewSlot(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const seeker = await prisma.seekerProfile.findUnique({
        where: { userId: req.user!.id },
        include: { user: true },
      });

      if (!seeker) {
        throw new AppError("Seeker profile not found", 404);
      }

      const { slotId, notes } = req.body;

      const slot = await prisma.interviewSlot.findUnique({
        where: { id: slotId },
        include: {
          job: {
            include: { provider: { include: { user: true } } },
          },
          booking: true,
        },
      });

      if (!slot) {
        throw new AppError("Interview slot not found", 404);
      }

      if (slot.isBooked || slot.booking) {
        throw new AppError("This interview slot has already been booked by another candidate", 409);
      }

      // Check candidate submission for this job
      const submission = await prisma.submission.findUnique({
        where: {
          jobId_seekerId: {
            jobId: slot.jobId,
            seekerId: seeker.id,
          },
        },
      });

      if (!submission) {
        throw new AppError("You must apply to the job before scheduling an interview", 400);
      }

      // Ensure candidate is in SHORTLISTED stage
      if (submission.stage !== "SHORTLISTED" && submission.stage !== "INTERVIEWED") {
        throw new AppError("Only shortlisted candidates can schedule interview slots", 403);
      }

      // Book the slot in transaction
      const booking = await prisma.$transaction(async (tx) => {
        await tx.interviewSlot.update({
          where: { id: slotId },
          data: { isBooked: true },
        });

        const createdBooking = await tx.interviewBooking.create({
          data: {
            slotId,
            submissionId: submission.id,
            status: "SCHEDULED",
            notes,
          },
          include: {
            slot: true,
          },
        });

        // Advance stage to INTERVIEWED
        await tx.submission.update({
          where: { id: submission.id },
          data: { stage: "INTERVIEWED" },
        });

        return createdBooking;
      });

      // Send confirmation emails
      const emailPayloadCandidate = emailService.createInterviewBookedEmail({
        recipientName: seeker.fullName,
        jobTitle: slot.job.title,
        counterpartyName: slot.job.provider.companyName,
        format: slot.format,
        location: slot.location || "Remote Video Link",
        startTime: slot.startTime.toLocaleString(),
        endTime: slot.endTime.toLocaleString(),
      });

      await emailService.sendEmail({
        to: seeker.user.email,
        ...emailPayloadCandidate,
      });

      res.status(201).json({
        success: true,
        message: "Interview successfully scheduled",
        data: booking,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },
};

