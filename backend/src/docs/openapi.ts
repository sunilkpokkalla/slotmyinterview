export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "SlotMyInterview API",
    version: "1.0.0",
    description: "Production-ready backend API for SlotMyInterview — an AI-powered talent marketplace connecting software engineers with companies through verified skill verification, automated matching, Kanban pipeline tracking, and interview scheduling.",
    contact: {
      name: "SlotMyInterview Engineering",
      url: "https://slotmyinterview.com",
      email: "api@slotmyinterview.com",
    },
  },
  servers: [
    {
      url: "/api/v1",
      description: "API v1 Endpoint",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Standard JWT Bearer token obtained from /auth/login or /auth/register",
      },
    },
    schemas: {
      ApiResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          data: { type: "object" },
          error: { type: "object" },
          meta: {
            type: "object",
            properties: {
              page: { type: "number" },
              limit: { type: "number" },
              total: { type: "number" },
              totalPages: { type: "number" },
            },
          },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          email: { type: "string", format: "email" },
          role: { type: "string", enum: ["JOB_SEEKER", "JOB_PROVIDER", "ADMIN"] },
          isEmailVerified: { type: "boolean" },
        },
      },
      SeekerProfile: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          username: { type: "string", example: "alexrivera" },
          fullName: { type: "string", example: "Alex Rivera" },
          headline: { type: "string", example: "Senior AI / MLOps Engineer" },
          photoUrl: { type: "string", format: "uri" },
          bio: { type: "string" },
          location: { type: "string", example: "San Francisco, CA" },
          workAuthType: { type: "string", example: "US Citizen" },
          availability: { type: "string", enum: ["ACTIVELY_LOOKING", "OPEN_TO_OPPORTUNITIES", "NOT_LOOKING"] },
          nonTechSkills: { type: "array", items: { type: "string" } },
          compositeScore: { type: "number", example: 94.5 },
          githubScore: { type: "number", example: 98.0 },
          assessmentScore: { type: "number", example: 92.0 },
          completenessScore: { type: "number", example: 100.0 },
          endorsementScore: { type: "number", example: 80.0 },
        },
      },
      Job: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string", example: "Staff Distributed Systems Engineer" },
          description: { type: "string" },
          categoryId: { type: "string", format: "uuid" },
          salaryMin: { type: "number", example: 180000 },
          salaryMax: { type: "number", example: 240000 },
          currency: { type: "string", example: "USD" },
          location: { type: "string", example: "San Francisco, CA" },
          workLocation: { type: "string", enum: ["REMOTE", "HYBRID", "ONSITE"] },
          workType: { type: "string", enum: ["FULL_TIME", "W2", "CORP_TO_CORP", "CORP_TO_H1B"] },
          isActive: { type: "boolean" },
        },
      },
      KanbanColumn: {
        type: "object",
        properties: {
          stage: { type: "string", enum: ["SUBMITTED", "TASKED", "SHORTLISTED", "INTERVIEWED", "OFFERED", "REJECTED"] },
          count: { type: "number" },
          submissions: { type: "array", items: { type: "object" } },
        },
      },
    },
  },
  paths: {
    "/auth/register/seeker": {
      post: {
        summary: "Register new software engineer / job seeker",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "fullName", "username"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 },
                  fullName: { type: "string" },
                  username: { type: "string" },
                  headline: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Registered successfully", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } } } },
        },
      },
    },
    "/auth/register/provider": {
      post: {
        summary: "Register new company / job provider",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "companyName", "website", "description"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 },
                  companyName: { type: "string" },
                  website: { type: "string", format: "uri" },
                  description: { type: "string" },
                  logoUrl: { type: "string", format: "uri" },
                  location: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Company registered successfully" },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "Sign in with email and password",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Authentication successful with access & refresh tokens" },
        },
      },
    },
    "/auth/oauth": {
      post: {
        summary: "Sign in with GitHub, Google, or LinkedIn OAuth",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["provider", "token"],
                properties: {
                  provider: { type: "string", enum: ["GITHUB", "GOOGLE", "LINKEDIN"] },
                  token: { type: "string" },
                  role: { type: "string", enum: ["JOB_SEEKER", "JOB_PROVIDER"] },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "OAuth token verified" },
        },
      },
    },
    "/seekers/search": {
      get: {
        summary: "Search and filter candidate profiles",
        tags: ["Seeker & Public Discovery"],
        parameters: [
          { name: "query", in: "query", schema: { type: "string" }, description: "Full text search keyword" },
          { name: "skill", in: "query", schema: { type: "string" }, description: "Specific skill name or slug" },
          { name: "category", in: "query", schema: { type: "string" }, description: "Skill category" },
          { name: "location", in: "query", schema: { type: "string" }, description: "Candidate location" },
          { name: "workAuthType", in: "query", schema: { type: "string" }, description: "Work authorization" },
          { name: "availability", in: "query", schema: { type: "string", enum: ["ACTIVELY_LOOKING", "OPEN_TO_OPPORTUNITIES", "NOT_LOOKING"] } },
          { name: "minScore", in: "query", schema: { type: "number" }, description: "Minimum composite talent score" },
          { name: "sortBy", in: "query", schema: { type: "string", enum: ["compositeScore", "githubScore", "createdAt"] } },
        ],
        responses: {
          200: { description: "List of matched public profiles" },
        },
      },
    },
    "/seekers/u/{username}": {
      get: {
        summary: "View unique public candidate profile",
        tags: ["Seeker & Public Discovery"],
        parameters: [
          { name: "username", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Candidate public profile, availability badge, and auto-grouped portfolio" },
        },
      },
    },
    "/seekers/identity": {
      put: {
        summary: "Update Section 1: Identity & Headline",
        security: [{ BearerAuth: [] }],
        tags: ["Seeker Dashboard"],
        responses: { 200: { description: "Identity updated" } },
      },
    },
    "/seekers/identity/photo": {
      post: {
        summary: "Upload professional photo to cloud storage",
        security: [{ BearerAuth: [] }],
        tags: ["Seeker Dashboard"],
        requestBody: {
          required: true,
          content: { "multipart/form-data": { schema: { type: "object", properties: { photo: { type: "string", format: "binary" } } } } },
        },
        responses: { 200: { description: "Photo uploaded and profile updated" } },
      },
    },
    "/seekers/skills": {
      put: {
        summary: "Update Section 2: Draggable categorized skill cloud & non-technical skills",
        security: [{ BearerAuth: [] }],
        tags: ["Seeker Dashboard"],
        responses: { 200: { description: "Skills updated" } },
      },
    },
    "/seekers/experience": {
      post: {
        summary: "Add Section 3: Repeatable experience entry",
        security: [{ BearerAuth: [] }],
        tags: ["Seeker Dashboard"],
        responses: { 201: { description: "Experience added" } },
      },
    },
    "/seekers/portfolio": {
      post: {
        summary: "Add Section 4: Portfolio link (GitHub, Behance, Dribbble, personal) with tech auto-detection",
        security: [{ BearerAuth: [] }],
        tags: ["Seeker Dashboard"],
        responses: { 201: { description: "Portfolio link added" } },
      },
    },
    "/seekers/socials-bio": {
      put: {
        summary: "Update Section 5: Social profiles and short bio",
        security: [{ BearerAuth: [] }],
        tags: ["Seeker Dashboard"],
        responses: { 200: { description: "Socials updated" } },
      },
    },
    "/seekers/availability": {
      put: {
        summary: "Update availability toggle (Green/Orange/Red)",
        security: [{ BearerAuth: [] }],
        tags: ["Seeker Dashboard"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["availability"],
                properties: {
                  availability: { type: "string", enum: ["ACTIVELY_LOOKING", "OPEN_TO_OPPORTUNITIES", "NOT_LOOKING"] },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Availability updated" } },
      },
    },
    "/seekers/alert-settings": {
      put: {
        summary: "Tune or pause email match alerts (max 3/week cap)",
        security: [{ BearerAuth: [] }],
        tags: ["Seeker Dashboard"],
        responses: { 200: { description: "Alert settings updated" } },
      },
    },
    "/providers/jobs": {
      post: {
        summary: "Post new job & automatically trigger matching email alerts to qualified seekers",
        security: [{ BearerAuth: [] }],
        tags: ["Job Provider"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "description", "categoryId", "requiredSkillIds", "location"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  categoryId: { type: "string", format: "uuid" },
                  requiredSkillIds: { type: "array", items: { type: "string" } },
                  preferredSkillIds: { type: "array", items: { type: "string" } },
                  salaryMin: { type: "number" },
                  salaryMax: { type: "number" },
                  currency: { type: "string", default: "USD" },
                  location: { type: "string" },
                  workLocation: { type: "string", enum: ["REMOTE", "HYBRID", "ONSITE"] },
                  workType: { type: "string", enum: ["FULL_TIME", "W2", "CORP_TO_CORP", "CORP_TO_H1B"] },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Job created and matching queue notified" } },
      },
    },
    "/providers/jobs/{jobId}/pipeline": {
      get: {
        summary: "View submissions Kanban board (submitted, tasked, shortlisted, interviewed, offered, rejected)",
        security: [{ BearerAuth: [] }],
        tags: ["Kanban Pipeline"],
        parameters: [{ name: "jobId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Pipeline columns and candidate cards" } },
      },
    },
    "/providers/submissions/{submissionId}/stage": {
      put: {
        summary: "Move candidate between Kanban stages",
        security: [{ BearerAuth: [] }],
        tags: ["Kanban Pipeline"],
        parameters: [{ name: "submissionId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Stage updated" } },
      },
    },
    "/providers/submissions/{submissionId}/tasks": {
      post: {
        summary: "Assign task (technical challenge, take-home, video intro) to candidate in Tasked stage",
        security: [{ BearerAuth: [] }],
        tags: ["Tasks & Assessments"],
        parameters: [{ name: "submissionId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 201: { description: "Task dispatched" } },
      },
    },
    "/providers/jobs/{jobId}/interview-slots": {
      post: {
        summary: "Create remote or in-person interview slot",
        security: [{ BearerAuth: [] }],
        tags: ["Interview Scheduler"],
        parameters: [{ name: "jobId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 201: { description: "Interview slot defined" } },
      },
    },
    "/submissions/apply": {
      post: {
        summary: "Candidate submits interest to job",
        security: [{ BearerAuth: [] }],
        tags: ["Submissions"],
        responses: { 201: { description: "Interest submitted to provider pipeline" } },
      },
    },
    "/submissions/interview/book": {
      post: {
        summary: "Shortlisted candidate books an interview slot",
        security: [{ BearerAuth: [] }],
        tags: ["Interview Scheduler"],
        responses: { 201: { description: "Interview slot booked" } },
      },
    },
  },
};

