export type Role = "CANDIDATE" | "EMPLOYER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  headline: string;
  bio: string;
  githubUsername: string;
  verified: boolean;
  skills: string[];
  hourlyRate?: number;
  resumeUrl?: string;
}

export interface PortfolioProject {
  id: string;
  profileId: string;
  title: string;
  description: string;
  repoUrl: string;
  liveDemoUrl?: string;
  techStack: string[];
  isHighlighted: boolean;
}

export interface AvailabilitySlot {
  id: string;
  profileId: string;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
}

export type InterviewStatus = "SCHEDULED" | "COMPLETED" | "CANCELED";

export interface Interview {
  id: string;
  slotId: string;
  candidateId: string;
  employerId: string;
  status: InterviewStatus;
  meetingLink: string;
  notes?: string;
}

export type ChallengeStatus = "ASSIGNED" | "IN_PROGRESS" | "SUBMITTED" | "REVIEWED";

export interface ChallengeAssignment {
  id: string;
  employerId: string;
  candidateId: string;
  repoTemplateUrl: string;
  candidateRepoUrl?: string;
  status: ChallengeStatus;
  assignedAt: Date;
  deadline: Date;
}
