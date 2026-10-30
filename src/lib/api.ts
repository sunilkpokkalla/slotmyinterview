const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; error?: any; meta?: any }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("smi_token") : null;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Network request failed",
    };
  }
}

export const api = {
  // Auth
  auth: {
    async login(email: string, password: string) {
      return apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
    },
    async registerSeeker(data: any) {
      return apiRequest("/auth/register/seeker", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    async registerProvider(data: any) {
      return apiRequest("/auth/register/provider", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    async getMe() {
      return apiRequest("/auth/me");
    },
    async logout() {
      const refreshToken = typeof window !== "undefined" ? localStorage.getItem("smi_refresh_token") : null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("smi_token");
        localStorage.removeItem("smi_refresh_token");
        localStorage.removeItem("smi_user");
      }
      return apiRequest("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
    },
  },

  // Taxonomy
  taxonomy: {
    async getCategories() {
      return apiRequest("/taxonomy/categories");
    },
    async getSkills(params?: { category?: string; search?: string }) {
      const query = new URLSearchParams(params as any).toString();
      return apiRequest(`/taxonomy/skills?${query}`);
    },
  },

  // Seekers & Public
  seekers: {
    async getPublicProfile(username: string) {
      return apiRequest(`/seekers/u/${username}`);
    },
    async search(params: any) {
      const query = new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== "")
          .map(([k, v]) => [k, String(v)])
      ).toString();
      return apiRequest(`/seekers/search?${query}`);
    },
    async updateIdentity(data: any) {
      return apiRequest("/seekers/identity", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    async uploadPhoto(file: File) {
      const formData = new FormData();
      formData.append("photo", file);
      return apiRequest("/seekers/identity/photo", {
        method: "POST",
        body: formData,
      });
    },
    async updateSkills(data: { skills: any[]; nonTechSkills?: string[] }) {
      return apiRequest("/seekers/skills", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    async addExperience(data: any) {
      return apiRequest("/seekers/experience", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    async updateExperience(id: string, data: any) {
      return apiRequest(`/seekers/experience/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    async deleteExperience(id: string) {
      return apiRequest(`/seekers/experience/${id}`, {
        method: "DELETE",
      });
    },
    async addPortfolio(data: any) {
      return apiRequest("/seekers/portfolio", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    async deletePortfolio(id: string) {
      return apiRequest(`/seekers/portfolio/${id}`, {
        method: "DELETE",
      });
    },
    async updateSocialsAndBio(data: any) {
      return apiRequest("/seekers/socials-bio", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    async updateAvailability(availability: "ACTIVELY_LOOKING" | "OPEN_TO_OPPORTUNITIES" | "NOT_LOOKING") {
      return apiRequest("/seekers/availability", {
        method: "PUT",
        body: JSON.stringify({ availability }),
      });
    },
    async updateAlertSettings(data: { alertFrequencyMaxPerWeek?: number; alertsPaused?: boolean }) {
      return apiRequest("/seekers/alert-settings", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    async recalculateScore() {
      return apiRequest("/seekers/recalculate-score", {
        method: "POST",
      });
    },
  },

  // Job Providers & Kanban Pipeline
  providers: {
    async getProfile() {
      return apiRequest("/providers/profile");
    },
    async updateProfile(data: any) {
      return apiRequest("/providers/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    async createJob(data: any) {
      return apiRequest("/providers/jobs", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    async getMyJobs() {
      return apiRequest("/providers/jobs");
    },
    async getJob(id: string) {
      return apiRequest(`/providers/jobs/${id}/public`);
    },
    async getPipeline(jobId: string) {
      return apiRequest(`/providers/jobs/${jobId}/pipeline`);
    },
    async updateSubmissionStage(submissionId: string, stage: string, notes?: string) {
      return apiRequest(`/providers/submissions/${submissionId}/stage`, {
        method: "PUT",
        body: JSON.stringify({ stage, notes }),
      });
    },
    async assignTask(submissionId: string, data: { taskType: string; title: string; instructions: string; deadline: string }) {
      return apiRequest(`/providers/submissions/${submissionId}/tasks`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    async reviewTask(taskId: string, data: { status: string; score: number; feedback?: string }) {
      return apiRequest(`/providers/tasks/${taskId}/review`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    async createInterviewSlot(jobId: string, data: { format: string; location: string; startTime: string; endTime: string }) {
      return apiRequest(`/providers/jobs/${jobId}/interview-slots`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    async getInterviewSlots(jobId: string) {
      return apiRequest(`/providers/jobs/${jobId}/interview-slots`);
    },
  },

  // Submissions & Candidate Actions
  submissions: {
    async apply(jobId: string, coverNote?: string) {
      return apiRequest("/submissions/apply", {
        method: "POST",
        body: JSON.stringify({ jobId, coverNote }),
      });
    },
    async getMyApplications() {
      return apiRequest("/submissions/my-applications");
    },
    async submitTask(taskId: string, submissionUrl: string) {
      return apiRequest(`/submissions/tasks/${taskId}/submit`, {
        method: "POST",
        body: JSON.stringify({ submissionUrl }),
      });
    },
    async bookSlot(slotId: string, notes?: string) {
      return apiRequest("/submissions/interview/book", {
        method: "POST",
        body: JSON.stringify({ slotId, notes }),
      });
    },
  },
};

