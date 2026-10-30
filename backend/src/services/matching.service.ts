import { prisma } from "../config/prisma.js";
import { logger } from "../config/logger.js";
import { config } from "../config/env.js";
import { emailService } from "./email.service.js";

export const matchingService = {
  /**
   * Evaluates job requirements against all active seekers and sends personalized match alerts.
   * Respects 7-day alert cap (<= 3 per seeker) and alert pause settings.
   */
  async matchAndAlertSeekersForJob(jobId: string): Promise<{
    matchedCount: number;
    dispatchedCount: number;
    skippedCapCount: number;
  }> {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        provider: true,
        category: true,
        requiredSkills: true,
        preferredSkills: true,
      },
    });

    if (!job || !job.isActive) {
      logger.warn(`Job ${jobId} not found or inactive; skipping match alerts.`);
      return { matchedCount: 0, dispatchedCount: 0, skippedCapCount: 0 };
    }

    const requiredSkillIds = job.requiredSkills.map((s) => s.id);
    if (requiredSkillIds.length === 0) {
      return { matchedCount: 0, dispatchedCount: 0, skippedCapCount: 0 };
    }

    // Find seekers with overlapping required skills and unpaused alerts
    const candidateSeekers = await prisma.seekerProfile.findMany({
      where: {
        alertsPaused: false,
        user: { isEmailVerified: true },
        skills: {
          some: {
            skillId: { in: requiredSkillIds },
          },
        },
      },
      include: {
        user: { select: { email: true } },
        skills: { include: { skill: { include: { category: true } } } },
      },
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let matchedCount = 0;
    let dispatchedCount = 0;
    let skippedCapCount = 0;

    for (const seeker of candidateSeekers) {
      // 1. Check skill overlap and category alignment
      const seekerSkillIds = new Set(seeker.skills.map((ss) => ss.skillId));
      const overlappingSkills = job.requiredSkills.filter((req) => seekerSkillIds.has(req.id));

      // Category alignment: Seeker has skills under the job's category or strong overlap
      const hasCategoryAlignment = seeker.skills.some(
        (ss) => ss.skill.categoryId === job.categoryId
      );

      if (overlappingSkills.length === 0 || !hasCategoryAlignment) {
        continue;
      }

      matchedCount++;

      // 2. Check if we already alerted this seeker for this specific job
      const alreadyAlerted = await prisma.jobAlertDispatch.findFirst({
        where: {
          seekerId: seeker.id,
          jobId: job.id,
        },
      });

      if (alreadyAlerted) {
        continue;
      }

      // 3. Check 7-day alert cap (default max 3 per week or seeker's custom cap)
      const recentAlertsCount = await prisma.jobAlertDispatch.count({
        where: {
          seekerId: seeker.id,
          sentAt: { gte: sevenDaysAgo },
        },
      });

      if (recentAlertsCount >= seeker.alertFrequencyMaxPerWeek) {
        skippedCapCount++;
        logger.debug(`Seeker ${seeker.id} reached alert cap (${recentAlertsCount}/${seeker.alertFrequencyMaxPerWeek} in 7d).`);
        continue;
      }

      // 4. Record the alert dispatch
      await prisma.jobAlertDispatch.create({
        data: {
          seekerId: seeker.id,
          jobId: job.id,
        },
      });

      // 5. Send personalized email
      const salaryRange = job.salaryMin && job.salaryMax
        ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()} ${job.currency}`
        : "Competitive Compensation";

      const applyUrl = `${config.frontendUrl}/jobs/${job.id}?action=quick-apply&seekerId=${seeker.id}`;
      const tuneAlertsUrl = `${config.frontendUrl}/dashboard?tab=settings`;

      const emailPayload = emailService.createJobMatchAlertEmail({
        seekerName: seeker.fullName || "Engineer",
        jobTitle: job.title,
        companyName: job.provider.companyName,
        location: job.location,
        workType: job.workType.replace(/_/g, " "),
        salaryRange,
        matchedSkills: overlappingSkills.map((s) => s.name),
        applyUrl,
        tuneAlertsUrl,
      });

      await emailService.sendEmail({
        to: seeker.user.email,
        ...emailPayload,
      });

      dispatchedCount++;
    }

    logger.info(`Match alert completed for job ${job.id}: Matched=${matchedCount}, Dispatched=${dispatchedCount}, SkippedDueToCap=${skippedCapCount}`);

    return { matchedCount, dispatchedCount, skippedCapCount };
  },
};

