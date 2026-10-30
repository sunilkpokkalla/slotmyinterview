import { Request } from "express";
import { Role, AvailabilityStatus, WorkLocation, WorkType, PipelineStage, TaskType, TaskStatus, InterviewFormat, InterviewStatus } from "@prisma/client";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
  seekerProfileId?: string;
  providerProfileId?: string;
  username?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | Record<string, any>;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export {
  Role,
  AvailabilityStatus,
  WorkLocation,
  WorkType,
  PipelineStage,
  TaskType,
  TaskStatus,
  InterviewFormat,
  InterviewStatus
};

