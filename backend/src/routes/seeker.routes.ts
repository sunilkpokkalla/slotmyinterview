import { Router } from "express";
import { seekerController } from "../controllers/seeker.controller.js";
import { authenticateJWT, requireRole } from "../middleware/auth.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { uploadMiddleware } from "../services/storage.service.js";
import {
  updateIdentitySchema,
  updateSkillsSchema,
  experienceItemSchema,
  portfolioItemSchema,
  updateSocialsAndBioSchema,
  updateAvailabilitySchema,
  updateAlertSettingsSchema,
  searchSeekersSchema,
  createEndorsementSchema,
} from "../validations/index.js";
import { Role } from "../types/index.js";

const router = Router();

// ==========================================
// Public routes
// ==========================================
// Recruiter / Public Search
router.get("/search", validateQuery(searchSeekersSchema), seekerController.searchProfiles);

// Public profile view: slotmyinterview.com/u/:username
router.get("/u/:username", seekerController.getPublicProfile);

// ==========================================
// Protected Seeker Dashboard routes
// ==========================================
router.use(authenticateJWT);

// Section 1: Identity & Photo
router.put(
  "/identity",
  requireRole(Role.JOB_SEEKER, Role.ADMIN),
  validateBody(updateIdentitySchema),
  seekerController.updateIdentity
);
router.post(
  "/identity/photo",
  requireRole(Role.JOB_SEEKER, Role.ADMIN),
  uploadMiddleware.single("photo"),
  seekerController.uploadPhoto
);

// Section 2: Skills
router.put(
  "/skills",
  requireRole(Role.JOB_SEEKER, Role.ADMIN),
  validateBody(updateSkillsSchema),
  seekerController.updateSkills
);

// Section 3: Experience
router.post(
  "/experience",
  requireRole(Role.JOB_SEEKER, Role.ADMIN),
  validateBody(experienceItemSchema),
  seekerController.addExperience
);
router.put(
  "/experience/:id",
  requireRole(Role.JOB_SEEKER, Role.ADMIN),
  validateBody(experienceItemSchema.partial()),
  seekerController.updateExperience
);
router.delete(
  "/experience/:id",
  requireRole(Role.JOB_SEEKER, Role.ADMIN),
  seekerController.deleteExperience
);

// Section 4: Portfolio
router.post(
  "/portfolio",
  requireRole(Role.JOB_SEEKER, Role.ADMIN),
  validateBody(portfolioItemSchema),
  seekerController.addPortfolioLink
);
router.delete(
  "/portfolio/:id",
  requireRole(Role.JOB_SEEKER, Role.ADMIN),
  seekerController.deletePortfolioLink
);

// Section 5: Social Profiles & Bio
router.put(
  "/socials-bio",
  requireRole(Role.JOB_SEEKER, Role.ADMIN),
  validateBody(updateSocialsAndBioSchema),
  seekerController.updateSocialsAndBio
);

// Availability status toggle (Green: ACTIVELY_LOOKING, Orange: OPEN_TO_OPPORTUNITIES, Red: NOT_LOOKING)
router.put(
  "/availability",
  requireRole(Role.JOB_SEEKER, Role.ADMIN),
  validateBody(updateAvailabilitySchema),
  seekerController.updateAvailability
);

// Alert settings tuning (cap 3/week, pause alerts)
router.put(
  "/alert-settings",
  requireRole(Role.JOB_SEEKER, Role.ADMIN),
  validateBody(updateAlertSettingsSchema),
  seekerController.updateAlertSettings
);

// Peer Endorsement
router.post(
  "/endorsements",
  requireRole(Role.JOB_SEEKER, Role.ADMIN),
  validateBody(createEndorsementSchema),
  seekerController.endorsePeer
);

// Recalculate Composite Talent Score
router.post(
  "/recalculate-score",
  requireRole(Role.JOB_SEEKER, Role.ADMIN),
  seekerController.recalculateScore
);

export default router;

