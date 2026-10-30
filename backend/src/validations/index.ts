import { z } from "zod";
import { AvailabilityStatus, WorkLocation, WorkType, PipelineStage, TaskType, TaskStatus, InterviewFormat } from "@prisma/client";

// ==========================================
// Authentication Schemas
// ==========================================
export const registerSeekerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain alphanumeric characters, underscores, and dashes"),
  headline: z.string().max(120, "Headline cannot exceed 120 characters").optional(),
});

export const registerProviderSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  website: z.string().url("Valid company website URL required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  logoUrl: z.string().url("Valid logo URL").optional(),
  location: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const oauthLoginSchema = z.object({
  provider: z.enum(["GITHUB", "GOOGLE", "LINKEDIN"]),
  token: z.string().min(1, "OAuth provider token or auth code is required"),
  role: z.enum(["JOB_SEEKER", "JOB_PROVIDER"]).default("JOB_SEEKER"),
  username: z.string().optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// ==========================================
// Seeker Profile Schemas (5 Dashboard Sections)
// ==========================================

// Section 1: Identity
export const updateIdentitySchema = z.object({
  fullName: z.string().min(2, "Full name is required").optional(),
  headline: z.string().max(140, "Headline must not exceed 140 characters").optional(),
  photoUrl: z.string().url("Valid photo URL").optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  workAuthType: z.string().max(100).optional().nullable(), // e.g. "US Citizen", "Green Card", "H1B", "CPT/OPT"
});

// Section 2: Skills (Categorized & Draggable + Non-tech list)
export const updateSkillsSchema = z.object({
  skills: z.array(
    z.object({
      skillId: z.string().uuid("Invalid skill ID"),
      displayOrder: z.number().int().default(0),
      yearsExp: z.number().min(0).max(50).optional(),
    })
  ).default([]),
  nonTechSkills: z.array(z.string().min(1)).default([]),
});

// Section 3: Experience
export const experienceItemSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  startDate: z.string().datetime("Start date must be an ISO date"),
  endDate: z.string().datetime("End date must be an ISO date").optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().min(10, "Description must be at least 10 characters"),
  link: z.string().url("Experience link must be a valid URL").optional().nullable(),
});

// Section 4: Portfolio
export const portfolioItemSchema = z.object({
  platform: z.enum(["GitHub", "Behance", "Dribbble", "Personal", "Other"]),
  url: z.string().url("Portfolio item must have a valid URL"),
  title: z.string().max(120).optional(),
  detectedTechStack: z.array(z.string()).optional(),
});

// Section 5: Social Profiles & Bio
export const updateSocialsAndBioSchema = z.object({
  bio: z.string().max(2000, "Bio cannot exceed 2000 characters").optional().nullable(),
  socialProfiles: z.array(
    z.object({
      platform: z.string().min(1),
      url: z.string().url("Valid URL required for social profile"),
    })
  ).default([]),
});

// Availability Toggle
export const updateAvailabilitySchema = z.object({
  availability: z.nativeEnum(AvailabilityStatus, {
    errorMap: () => ({ message: "Must be ACTIVELY_LOOKING, OPEN_TO_OPPORTUNITIES, or NOT_LOOKING" }),
  }),
});

// Seeker Alert Settings
export const updateAlertSettingsSchema = z.object({
  alertFrequencyMaxPerWeek: z.number().int().min(0).max(14).default(3),
  alertsPaused: z.boolean().default(false),
});

// Public Profile Search Query
export const searchSeekersSchema = z.object({
  query: z.string().optional(),
  skill: z.string().optional(), // skill slug or name
  skills: z.union([z.string(), z.array(z.string())]).optional(), // multiple skills
  category: z.string().optional(),
  location: z.string().optional(),
  workAuthType: z.string().optional(),
  availability: z.nativeEnum(AvailabilityStatus).optional(),
  minScore: z.coerce.number().min(0).max(100).optional(),
  sortBy: z.enum(["compositeScore", "githubScore", "createdAt", "updatedAt"]).default("compositeScore"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

// ==========================================
// Job Provider Schemas
// ==========================================
export const updateProviderProfileSchema = z.object({
  companyName: z.string().min(2).optional(),
  logoUrl: z.string().url().optional().nullable(),
  website: z.string().url().optional(),
  description: z.string().min(10).optional(),
  location: z.string().optional().nullable(),
});

export const createJobSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters"),
  description: z.string().min(20, "Job description must be at least 20 characters"),
  categoryId: z.string().uuid("Category ID is required"),
  requiredSkillIds: z.array(z.string().uuid()).min(1, "At least one required skill is required"),
  preferredSkillIds: z.array(z.string().uuid()).default([]),
  salaryMin: z.number().int().positive().optional(),
  salaryMax: z.number().int().positive().optional(),
  currency: z.string().length(3).default("USD"),
  location: z.string().min(2, "Location is required"),
  workLocation: z.nativeEnum(WorkLocation).default(WorkLocation.REMOTE),
  workType: z.nativeEnum(WorkType).default(WorkType.FULL_TIME),
  isActive: z.boolean().default(true),
});

export const updateJobSchema = createJobSchema.partial();

// ==========================================
// Kanban Pipeline & Candidate Tasks
// ==========================================
export const updatePipelineStageSchema = z.object({
  stage: z.nativeEnum(PipelineStage, {
    errorMap: () => ({ message: "Invalid pipeline stage" }),
  }),
  notes: z.string().optional(),
});

export const assignTaskSchema = z.object({
  taskType: z.nativeEnum(TaskType, {
    errorMap: () => ({ message: "Must be TECHNICAL_CHALLENGE, TAKE_HOME, or VIDEO_INTRODUCTION" }),
  }),
  title: z.string().min(3, "Task title is required"),
  instructions: z.string().min(10, "Task instructions are required"),
  deadline: z.string().datetime("Valid ISO deadline is required"),
});

export const submitTaskSchema = z.object({
  submissionUrl: z.string().url("Valid URL for repository or video submission required"),
});

export const reviewTaskSchema = z.object({
  status: z.enum([TaskStatus.PASSED, TaskStatus.FAILED, TaskStatus.REVIEWED]),
  score: z.number().min(0).max(100, "Score must be between 0 and 100"),
  feedback: z.string().optional(),
});

// ==========================================
// Interview Scheduler Schemas
// ==========================================
export const createInterviewSlotSchema = z.object({
  format: z.nativeEnum(InterviewFormat).default(InterviewFormat.REMOTE),
  location: z.string().min(1, "Meeting URL or physical address is required"),
  startTime: z.string().datetime("Valid ISO start time required"),
  endTime: z.string().datetime("Valid ISO end time required"),
});

export const bookInterviewSlotSchema = z.object({
  slotId: z.string().uuid("Valid slot ID required"),
  notes: z.string().optional(),
});

// ==========================================
// Peer Endorsement Schema
// ==========================================
export const createEndorsementSchema = z.object({
  seekerId: z.string().uuid("Target seeker ID is required"),
  skillName: z.string().min(1, "Skill name is required"),
  comment: z.string().max(500).optional(),
});

