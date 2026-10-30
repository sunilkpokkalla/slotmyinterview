import { Queue } from "bullmq";
import { config } from "../config/env.js";
import { logger } from "../config/logger.js";
import { isRedisConnected } from "../config/redis.js";
import { matchingService } from "../services/matching.service.js";
import { scoringService } from "../services/scoring.service.js";
import { emailService } from "../services/email.service.js";

const redisConnection = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  maxRetriesPerRequest: null,
};

let jobMatchingQueue: Queue | null = null;
let talentScoringQueue: Queue | null = null;
let emailDispatchQueue: Queue | null = null;

try {
  jobMatchingQueue = new Queue("job-matching", { connection: redisConnection });
  talentScoringQueue = new Queue("talent-scoring", { connection: redisConnection });
  emailDispatchQueue = new Queue("email-dispatch", { connection: redisConnection });
} catch (err: any) {
  logger.warn(`BullMQ queue creation skipped or waiting for Redis: ${err.message}`);
}

export const queues = {
  /**
   * Enqueues job matching. If Redis is down, runs asynchronously in-process.
   */
  async enqueueJobMatch(jobId: string): Promise<void> {
    if (isRedisConnected() && jobMatchingQueue) {
      try {
        await jobMatchingQueue.add("match-job", { jobId }, { attempts: 3, backoff: { type: "exponential", delay: 2000 } });
        logger.info(`Enqueued job matching job for Job ID ${jobId}`);
        return;
      } catch (err: any) {
        logger.warn(`Failed to push to BullMQ: ${err.message}. Running in-process.`);
      }
    }

    // In-process fallback
    setImmediate(async () => {
      try {
        await matchingService.matchAndAlertSeekersForJob(jobId);
      } catch (e: any) {
        logger.error(`In-process job match error for ${jobId}: ${e.message}`);
      }
    });
  },

  /**
   * Enqueues talent score computation. If Redis is down, runs asynchronously in-process.
   */
  async enqueueTalentScoring(seekerId: string): Promise<void> {
    if (isRedisConnected() && talentScoringQueue) {
      try {
        await talentScoringQueue.add("score-seeker", { seekerId }, { attempts: 2 });
        logger.info(`Enqueued talent score computation for Seeker ID ${seekerId}`);
        return;
      } catch (err: any) {
        logger.warn(`Failed to push to BullMQ: ${err.message}. Running in-process.`);
      }
    }

    // In-process fallback
    setImmediate(async () => {
      try {
        await scoringService.computeSeekerTalentScore(seekerId);
      } catch (e: any) {
        logger.error(`In-process scoring error for ${seekerId}: ${e.message}`);
      }
    });
  },

  /**
   * Enqueues generic email dispatch.
   */
  async enqueueEmail(options: { to: string; subject: string; html: string; text?: string }): Promise<void> {
    if (isRedisConnected() && emailDispatchQueue) {
      try {
        await emailDispatchQueue.add("send-email", options, { attempts: 3 });
        return;
      } catch {
        // Fallback
      }
    }

    // In-process fallback
    setImmediate(async () => {
      await emailService.sendEmail(options);
    });
  },
};

