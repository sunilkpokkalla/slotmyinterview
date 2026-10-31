import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .url("Enter a valid URL (including https://)")
  .refine((v) => /^https?:\/\//i.test(v), "Only http(s) links are allowed")
  .optional()
  .nullable()
  .or(z.literal("").transform(() => null));

const httpUrl = z
  .string()
  .trim()
  .url("Enter a valid URL (including https://)")
  .refine((v) => /^https?:\/\//i.test(v), "Only http(s) links are allowed");

export const availabilityValues = ["ACTIVELY_LOOKING", "OPEN_TO_OPPORTUNITIES", "NOT_LOOKING"] as const;

// ---------- Auth ----------
export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  next: z.string().optional(),
});

export const signUpSchema = z.discriminatedUnion("accountType", [
  z.object({
    accountType: z.literal("candidate"),
    email: z.string().trim().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    fullName: z.string().trim().min(2, "Enter your name").max(120),
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30)
      .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, _ and -"),
  }),
  z.object({
    accountType: z.literal("employer"),
    email: z.string().trim().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    fullName: z.string().trim().min(2, "Enter your name").max(120),
    companyName: z.string().trim().min(2, "Enter your company name").max(120),
    website: httpUrl,
  }),
]);

// ---------- Seeker profile ----------
export const identitySchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(120),
  headline: z.string().trim().max(140, "Headline must be 140 characters or less").optional().default(""),
  location: z.string().trim().max(100).optional().default(""),
  workAuthType: z.string().trim().max(100).optional().default(""),
  photoUrl: optionalUrl,
});

export const skillsSchema = z.object({
  skillIds: z.array(z.string().uuid()).max(50),
  nonTechSkills: z.array(z.string().trim().min(1).max(60)).max(30),
});

export const experienceSchema = z.object({
  company: z.string().trim().min(1, "Company is required").max(120),
  role: z.string().trim().min(1, "Role is required").max(120),
  startDate: z.coerce.date({ invalid_type_error: "Enter a start date" }),
  endDate: z.coerce.date().optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(2000),
  link: optionalUrl,
});

export const portfolioSchema = z.object({
  platform: z.enum(["GitHub", "Behance", "Dribbble", "Personal", "Other"]),
  url: httpUrl,
  title: z.string().trim().max(120).optional().default(""),
});

export const bioSchema = z.object({
  bio: z.string().trim().max(2000, "Bio cannot exceed 2000 characters"),
  socialProfiles: z.array(z.object({ platform: z.string().trim().min(1).max(40), url: httpUrl })).max(10),
});

export const availabilitySchema = z.enum(availabilityValues);

export const alertSettingsSchema = z.object({
  alertFrequencyMaxPerWeek: z.number().int().min(0).max(14),
  alertsPaused: z.boolean(),
});

export const calcomLinkSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/^https?:\/\/(app\.)?cal\.com\//i, "").replace(/^\/+|\/+$/g, ""))
  .refine((v) => v === "" || /^[a-zA-Z0-9_.-]+(\/[a-zA-Z0-9_.-]+)?$/.test(v), "Use your Cal.com link, e.g. cal.com/jane/30min");

export const videoPitchSchema = z.object({
  path: z.string().min(1).max(300),
  durationSec: z.number().min(1).max(61, "Video pitch must be 60 seconds or shorter"),
});

export const endorsementSchema = z.object({
  seekerId: z.string().uuid(),
  skillName: z.string().trim().min(1).max(60),
  comment: z.string().trim().max(500).optional(),
});

// ---------- Search ----------
export const searchSchema = z.object({
  query: z.string().trim().max(100).optional(),
  skill: z.string().trim().max(60).optional(),
  category: z.string().trim().max(60).optional(),
  location: z.string().trim().max(100).optional(),
  workAuthType: z.string().trim().max(60).optional(),
  availability: z.enum(availabilityValues).optional(),
  minScore: z.coerce.number().min(0).max(100).optional(),
  hasVideo: z.enum(["1"]).optional(),
  sortBy: z.enum(["compositeScore", "githubScore", "createdAt"]).default("compositeScore"),
  page: z.coerce.number().int().min(1).max(500).default(1),
});

// ---------- Recruiter ----------
export const providerProfileSchema = z.object({
  companyName: z.string().trim().min(2).max(120),
  website: httpUrl,
  description: z.string().trim().max(2000).default(""),
  location: z.string().trim().max(100).optional().default(""),
  logoUrl: optionalUrl,
});

export const jobSchema = z
  .object({
    title: z.string().trim().min(3, "Job title must be at least 3 characters").max(120),
    description: z.string().trim().min(20, "Job description must be at least 20 characters").max(5000),
    categoryId: z.string().uuid("Choose a category"),
    requiredSkillIds: z.array(z.string().uuid()).min(1, "Choose at least one required skill").max(20),
    salaryMin: z.number().int().positive().optional().nullable(),
    salaryMax: z.number().int().positive().optional().nullable(),
    location: z.string().trim().min(2, "Location is required").max(120),
    workLocation: z.enum(["REMOTE", "HYBRID", "ONSITE"]),
    workType: z.enum(["FULL_TIME", "W2", "CORP_TO_CORP", "CORP_TO_H1B"]),
  })
  .refine((j) => !j.salaryMin || !j.salaryMax || j.salaryMin <= j.salaryMax, "Minimum salary must not exceed maximum");

export const pipelineStageSchema = z.enum(["SUBMITTED", "TASKED", "SHORTLISTED", "INTERVIEWED", "OFFERED", "REJECTED"]);

export const assignTaskSchema = z.object({
  submissionId: z.string().uuid(),
  taskType: z.enum(["TECHNICAL_CHALLENGE", "TAKE_HOME", "VIDEO_INTRODUCTION"]),
  title: z.string().trim().min(3, "Task title is required").max(120),
  instructions: z.string().trim().min(10, "Instructions are required").max(5000),
  deadlineDays: z.number().int().min(1).max(30),
});

export const reviewTaskSchema = z.object({
  taskId: z.string().uuid(),
  status: z.enum(["PASSED", "FAILED", "REVIEWED"]),
  score: z.number().min(0).max(100),
  feedback: z.string().trim().max(2000).optional(),
});

export const interviewSlotSchema = z
  .object({
    jobId: z.string().uuid(),
    format: z.enum(["REMOTE", "IN_PERSON"]),
    location: z.string().trim().min(1, "Meeting link or address is required").max(300),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
  })
  .refine((s) => s.endTime > s.startTime, "End time must be after start time")
  .refine((s) => s.startTime > new Date(), "Slot must be in the future");

// ---------- Candidate actions ----------
export const applySchema = z.object({ jobId: z.string().uuid(), coverNote: z.string().trim().max(2000).optional() });
export const submitTaskSchema = z.object({ taskId: z.string().uuid(), submissionUrl: httpUrl });
export const bookSlotSchema = z.object({ slotId: z.string().uuid(), notes: z.string().trim().max(1000).optional() });

// ---------- Leads ----------
export const leadSchema = z.object({ email: z.string().trim().toLowerCase().email("Enter a valid email") });
