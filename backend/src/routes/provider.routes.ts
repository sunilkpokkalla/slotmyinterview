import { Router } from "express";
import { providerController } from "../controllers/provider.controller.js";
import { authenticateJWT, requireRole } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import {
  updateProviderProfileSchema,
  createJobSchema,
  updatePipelineStageSchema,
  assignTaskSchema,
  reviewTaskSchema,
  createInterviewSlotSchema,
} from "../validations/index.js";
import { Role } from "../types/index.js";

const router = Router();

// Public: view single job detail and open interview slots
router.get("/jobs/:id/public", providerController.getJobById);
router.get("/jobs/:jobId/interview-slots/public", providerController.listInterviewSlots);

// Protected: Job Provider endpoints
router.use(authenticateJWT, requireRole(Role.JOB_PROVIDER, Role.ADMIN));

// Company profile
router.get("/profile", providerController.getProfile);
router.put("/profile", validateBody(updateProviderProfileSchema), providerController.updateProfile);

// Job management
router.post("/jobs", validateBody(createJobSchema), providerController.createJob);
router.get("/jobs", providerController.getMyJobs);

// Kanban Pipeline: submitted, tasked, shortlisted, interviewed, offered, rejected
router.get("/jobs/:jobId/pipeline", providerController.getJobPipeline);
router.put("/submissions/:submissionId/stage", validateBody(updatePipelineStageSchema), providerController.updateSubmissionStage);

// Task assignment (from TASKED stage)
router.post("/submissions/:submissionId/tasks", validateBody(assignTaskSchema), providerController.assignTask);
router.put("/tasks/:taskId/review", validateBody(reviewTaskSchema), providerController.reviewTask);

// Interview Scheduler Slots (in-person or remote)
router.post("/jobs/:jobId/interview-slots", validateBody(createInterviewSlotSchema), providerController.createInterviewSlot);
router.get("/jobs/:jobId/interview-slots", providerController.listInterviewSlots);

export default router;

