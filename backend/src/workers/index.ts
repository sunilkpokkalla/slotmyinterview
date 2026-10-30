import { Worker, Job } from "bullmq";
import { config } from "../config/env.js";
import { logger } from "../config/logger.js";
import { matchingService } from "../services/matching.service.js";
import { scoringService } from "../services/scoring.service.js";
import { emailService } from "../services/email.service.js";

const redisConnection = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  maxRetriesPerRequest: null,
};

logger.info("Initializing BullMQ background workers for SlotMyInterview...");

// 1. Job Matching Worker
export const jobMatchingWorker = new Worker(
  "job-matching",
  async (job: Job<{ jobId: string }>) => {
    logger.info(`[JobMatchingWorker] Processing job matching for Job ID: ${job.data.jobId}`);
    const result = await matchingService.matchAndAlertSeekersForJob(job.data.jobId);
    return result;
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

jobMatchingWorker.on("completed", (job, result) => {
  logger.info(`[JobMatchingWorker] Job ${job.id} completed. Result:`, result);
});

jobMatchingWorker.on("failed", (job, err) => {
  logger.error(`[JobMatchingWorker] Job ${job?.id} failed: ${err.message}`);
});

// 2. Talent Scoring Worker
export const talentScoringWorker = new Worker(
  "talent-scoring",
  async (job: Job<{ seekerId: string }>) => {
    logger.info(`[TalentScoringWorker] Recomputing talent score for Seeker ID: ${job.data.seekerId}`);
    const scores = await scoringService.computeSeekerTalentScore(job.data.seekerId);
    return scores;
  },
  {
    connection: redisConnection,
    concurrency: 10,
  }
);

talentScoringWorker.on("completed", (job, result) => {
  logger.info(`[TalentScoringWorker] Job ${job.id} completed. Scores:`, result);
});

talentScoringWorker.on("failed", (job, err) => {
  logger.error(`[TalentScoringWorker] Job ${job?.id} failed: ${err.message}`);
});

// 3. Email Dispatch Worker
export const emailDispatchWorker = new Worker(
  "email-dispatch",
  async (job: Job<{ to: string; subject: string; html: string; text?: string }>) => {
    logger.info(`[EmailWorker] Sending email to ${job.data.to}`);
    return await emailService.sendEmail(job.data);
  },
  {
    connection: redisConnection,
    concurrency: 15,
  }
);

emailDispatchWorker.on("failed", (job, err) => {
  logger.error(`[EmailWorker] Email to ${job?.data.to} failed: ${err.message}`);
});

// Graceful shutdown
const shutdown = async () => {
  logger.info("Stopping BullMQ background workers gracefully...");
  await Promise.all([
    jobMatchingWorker.close(),
    talentScoringWorker.close(),
    emailDispatchWorker.close(),
  ]);
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

logger.info("BullMQ background workers are actively running and awaiting jobs.");

