import { Router } from "express";
import { submissionController } from "../controllers/submission.controller.js";
import { authenticateJWT, requireRole } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { submitTaskSchema, bookInterviewSlotSchema } from "../validations/index.js";
import { Role } from "../types/index.js";

const router = Router();

router.use(authenticateJWT);

// Apply / submit interest to job
router.post(
  "/apply",
  requireRole(Role.JOB_SEEKER, Role.ADMIN),
  submissionController.applyToJob
);

// Get my applications & pipeline statuses
router.get(
  "/my-applications",
  requireRole(Role.JOB_SEEKER, Role.ADMIN),
  submissionController.getMyApplications
);

// Submit task solution (for tasked candidates)
router.post(
  "/tasks/:taskId/submit",
  requireRole(Role.JOB_SEEKER, Role.ADMIN),
  validateBody(submitTaskSchema),
  submissionController.submitTaskSolution
);

// Book interview slot (for shortlisted candidates)
router.post(
  "/interview/book",
  requireRole(Role.JOB_SEEKER, Role.ADMIN),
  validateBody(bookInterviewSlotSchema),
  submissionController.bookInterviewSlot
);

export default router;

