# SlotMyInterview Backend

Production-ready backend for **[slotmyinterview.com](https://slotmyinterview.com)**, an AI-powered talent marketplace connecting software engineers and high-growth technology companies through verified code analysis, skill overlap matching, Kanban pipeline tracking, and interview scheduling.

Built with **Node.js**, **Express**, **TypeScript**, **PostgreSQL** with **Prisma ORM**, **Redis** for caching and rate limiting, and **BullMQ** for distributed background jobs. Designed from the ground up for horizontal scaling.

---

## Table of Contents
1. [Architecture & Scalability](#architecture--scalability)
2. [Domain One: Job Seeker](#domain-one-job-seeker)
3. [Domain Two: Job Provider & Kanban Pipeline](#domain-two-job-provider--kanban-pipeline)
4. [Domain Three: Composite Talent Scoring Engine](#domain-three-composite-talent-scoring-engine)
5. [Tech Stack & Infrastructure](#tech-stack--infrastructure)
6. [Environment Variables Reference](#environment-variables-reference)
7. [Quick Start & Local Setup](#quick-start--local-setup)
8. [Database Seeding](#database-seeding)
9. [OpenAPI / Swagger Documentation](#openapi--swagger-documentation)
10. [Horizontal Scaling & Production Deployment](#horizontal-scaling--production-deployment)

---

## Architecture & Scalability

The backend decouples HTTP REST traffic from intensive background operations (job matching, scoring recalculation, email dispatching):

```
                     ┌────────────────────────────────┐
                     │          Clients               │
                     │  (React Frontend / Mobile)     │
                     └───────────────┬────────────────┘
                                     │
                                     ▼
                     ┌────────────────────────────────┐
                     │       Nginx / Ingress          │
                     │   Load Balancer & SSL Proxy    │
                     └───────────────┬────────────────┘
                                     │
            ┌────────────────────────┼────────────────────────┐
            ▼                        ▼                        ▼
┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
│  Express API (Pod 1) │ │  Express API (Pod 2) │ │  Express API (Pod N) │
│   Port 5000 (HTTP)   │ │   Port 5000 (HTTP)   │ │   Port 5000 (HTTP)   │
└───────────┬──────────┘ └───────────┬──────────┘ └───────────┬──────────┘
            │                        │                        │
            └────────────────────────┼────────────────────────┘
                                     ▼
                    ┌─────────────────────────────────┐
                    │  Redis (Pub/Sub, Caching,       │
                    │  Rate Limiting, BullMQ Queues)  │
                    └────────────────┬────────────────┘
                                     │
            ┌────────────────────────┴────────────────────────┐
            ▼                                                 ▼
┌────────────────────────┐                       ┌────────────────────────┐
│  BullMQ Worker (Pod 1) │                       │  BullMQ Worker (Pod N) │
│ - Job Matching Engine  │                       │ - Scoring Recalculator │
│ - Alert Email Dispatch │                       │ - Resend / SendGrid    │
└───────────┬────────────┘                       └───────────┬────────────┘
            │                                                 │
            └────────────────────────┬────────────────────────┘
                                     ▼
                    ┌─────────────────────────────────┐
                    │   PostgreSQL 16 (Prisma ORM)    │
                    │   Relational Talent Data Store  │
                    └─────────────────────────────────┘
```

- **Stateless HTTP REST APIs**: Scaled horizontally behind Nginx / Kubernetes Ingress using `HorizontalPodAutoscaler` (HPA).
- **Asynchronous Worker Tier**: BullMQ workers consume queues (`job-matching`, `talent-scoring`, `email-dispatch`) independently of client request latency.
- **Resilient Fallbacks**: If Redis is offline during local runs, the backend operates in-memory so workflows and API routes remain fully functional.

---

## Domain One: Job Seeker

### Registration & Authentication
- Email + password registration (bcrypt salted hashes, cost factor 12).
- OAuth support: **GitHub**, **Google**, and **LinkedIn**.
- JWT access tokens (15-min lifespan) paired with cryptographically secure, rotating refresh tokens (7-day lifespan) stored in PostgreSQL for immediate revocation.
- Role-Based Access Control (`JOB_SEEKER`, `JOB_PROVIDER`, `ADMIN`).

### 5-Section Seeker Dashboard
1. **Identity**: Full name, one-line professional headline, cloud storage photo upload (S3 / Local with static serving), location, and work authorization type.
2. **Skills**:
   - **Searchable, draggable tag cloud** of technical skills grouped by category: *Languages*, *Frameworks*, *Cloud*, *Databases*, *DevOps*, and *AI & MLOps*.
   - Drag-and-drop `displayOrder` prioritization.
   - Separate free-text tag list for non-technical soft skills and methodologies.
3. **Experience**: Repeatable work history records with company, role, ISO start/end dates, `isCurrent` toggle, descriptions, and optional project links.
4. **Portfolio**: Links to GitHub, Behance, Dribbble, personal portfolio, or custom URLs with **automatic technology detection** (analyzes repository names, frameworks, keywords, and metadata).
5. **Socials & Bio**: Verified GitHub, LinkedIn, Twitter/X, Bluesky, and custom links plus markdown summary biography.

### Vanity Public Profile & Availability Toggle
- Public URL: `slotmyinterview.com/u/:username` (also aliased under `/api/v1/seekers/u/:username`).
- **3-State Availability Indicator**:
  - 🟢 **Actively Looking (`ACTIVELY_LOOKING`)** — Displayed in green.
  - 🟠 **Open to Opportunities (`OPEN_TO_OPPORTUNITIES`)** — Displayed in orange.
  - 🔴 **Not Looking (`NOT_LOOKING`)** — Displayed in red.
- Portfolio items automatically clustered and grouped by detected technology.

### Recruiter Talent Search & Filtering
Recruiters can filter candidates using `GET /api/v1/seekers/search` with parameters:
- `skill`: Filter by specific technical skills (e.g. `PyTorch`, `Go`, `Next.js`).
- `category`: Filter by domain category (e.g. `Languages`, `AI & MLOps`).
- `location`: Geo-location search (e.g. `San Francisco`, `Remote`).
- `workAuthType`: Work authorization (e.g. `US Citizen`, `Green Card`, `H1B`, `CPT/OPT`).
- `availability`: Availability status filter.
- `minScore`: Minimum composite talent score (0 - 100).
- `sortBy`: Sort by `compositeScore`, `githubScore`, or `createdAt`.

### Alert Tuning & Pause
Seekers can tune their weekly match alert frequency cap (capped at max 3 per week by default) or pause alerts entirely via `PUT /api/v1/seekers/alert-settings`.

---

## Domain Two: Job Provider & Kanban Pipeline

### Company Profile & Job Posting
- Providers register with company name, logo, website, description, and headquarters.
- Job Postings include:
  - `title`, `description`, `categoryId`.
  - `requiredSkillIds` and `preferredSkillIds` pulled from the unified taxonomy.
  - Salary range (`salaryMin`, `salaryMax`, `currency`).
  - Work location (`REMOTE`, `HYBRID`, `ONSITE`).
  - Work authorization type (`FULL_TIME`, `W2`, `CORP_TO_CORP`, `CORP_TO_H1B`).

### Automated Matching & Personalized Alerts
When a job is posted:
1. BullMQ enqueues a matching job.
2. The matching engine finds seekers with:
   - Skills overlapping the job's `requiredSkills`.
   - Category alignment.
   - Active status (`availability != NOT_LOOKING` and `alertsPaused == false`).
   - Fewer than 3 alerts dispatched in the previous 7 days.
3. Sends a personalized email via Resend / SendGrid with a **one-click link to submit interest**.
4. Records dispatch to prevent duplicate job notifications.

### Kanban Pipeline (`GET /api/v1/providers/jobs/:jobId/pipeline`)
Submissions are rendered into 6 columns:
```
┌─────────────┐   ┌─────────────┐   ┌───────────────┐   ┌───────────────┐   ┌─────────────┐   ┌────────────┐
│  SUBMITTED  │──▶│   TASKED    │──▶│  SHORTLISTED  │──▶│  INTERVIEWED  │──▶│   OFFERED   │──▶│  REJECTED  │
└─────────────┘   └─────────────┘   └───────────────┘   └───────────────┘   └─────────────┘   └────────────┘
```
- **Task Assignment from Tasked Column**:
  - Providers assign evaluations: `TECHNICAL_CHALLENGE`, `TAKE_HOME`, or `VIDEO_INTRODUCTION`.
  - Configurable instructions and strict deadline.
  - Submissions track real-time task lifecycle (`PENDING` ➔ `IN_PROGRESS` ➔ `SUBMITTED` ➔ `REVIEWED` ➔ `PASSED`/`FAILED`).
- **Review & Grading**: Providers review submissions, input numerical scores (0 - 100), and write qualitative feedback, automatically feeding into the candidate's composite score.

### Interview Scheduler
- Providers configure interview slots:
  - **Remote**: Direct meeting URL (Google Meet, Zoom, Teams).
  - **In-Person**: Physical office address / conference room.
  - Start time and end time.
- Candidates in the **SHORTLISTED** stage can view open slots and book with one click (`POST /api/v1/submissions/interview/book`).
- Automatically transitions candidate stage to `INTERVIEWED` and dispatches calendar email confirmations.

---

## Domain Three: Composite Talent Scoring Engine

Every candidate profile computes a deterministic **Composite Talent Score (0 - 100)**:

$$\text{Composite Score} = (0.35 \times S_{\text{github}}) + (0.25 \times S_{\text{assessment}}) + (0.25 \times S_{\text{completeness}}) + (0.15 \times S_{\text{endorsements}})$$

| Component | Weight | Metric Criteria |
| :--- | :---: | :--- |
| **GitHub Quality ($S_{\text{github}}$)** | **35%** | Analyzes public repository count, star count, commit activity, language diversity, and profile verification. |
| **Assessment Results ($S_{\text{assessment}}$)** | **25%** | Average score achieved across completed candidate tasks and take-home challenges reviewed by companies. |
| **Profile Completeness ($S_{\text{completeness}}$)** | **25%** | Identity, professional photo, headline, bio, location, work auth, $\ge 3$ technical skills, experience history, portfolio links. |
| **Peer Endorsements ($S_{\text{endorsements}}$)** | **15%** | Verified endorsements from other platform software engineers praising specific technical proficiencies. |

Recruiters can sort, filter, and discover top-tier talent ranked by composite score.

---

## Environment Variables Reference

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Express server HTTP port | `5000` |
| `NODE_ENV` | Environment (`development` \| `production`) | `development` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/slotmyinterview?schema=public` |
| `REDIS_HOST` | Redis host for queues & caching | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_PASSWORD`| Redis authentication password | *Optional* |
| `JWT_ACCESS_SECRET` | Secret key for access token signing | *Change in production* |
| `JWT_REFRESH_SECRET`| Secret key for refresh token signing | *Change in production* |
| `JWT_ACCESS_EXPIRES_IN`| Access token TTL | `15m` |
| `JWT_REFRESH_EXPIRES_IN`| Refresh token TTL | `7d` |
| `EMAIL_PROVIDER` | Email provider (`resend` \| `sendgrid` \| `console`) | `resend` |
| `RESEND_API_KEY` | Resend API key | `re_...` |
| `SENDGRID_API_KEY`| SendGrid API key | `SG....` |
| `FROM_EMAIL` | Originating email address | `notifications@slotmyinterview.com` |
| `STORAGE_PROVIDER` | Photo storage (`local` \| `s3` \| `cloudinary`) | `local` |
| `AWS_ACCESS_KEY_ID`| AWS S3 credentials (if S3 chosen) | *Optional* |
| `GITHUB_API_TOKEN` | GitHub Personal Access Token for scoring | *Optional for higher rate limits* |

---

## Quick Start & Local Setup

### 1. Prerequisites
- Node.js $\ge 20$
- PostgreSQL $\ge 15$
- Redis $\ge 7$ (Optional for local dev — in-memory fallback enabled)

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Generate Prisma Client & Run Migrations
```bash
# Push schema directly to database
npx prisma db push

# Or run standard migration
npx prisma migrate dev --name init
```

### 4. Run Seed Script
Populate categories, 60+ technical skills, sample companies (Scale AI, Stripe, Vercel), sample jobs, candidate profiles, and Kanban pipeline cards:
```bash
npm run seed
```

### 5. Start Development Server
```bash
# Start API Server with hot reload
npm run dev

# (Optional) In a separate terminal, start BullMQ background workers
npm run dev:worker
```

The API will be live at `http://localhost:5000`.

---

## Seed Test Accounts

After running `npm run seed`, you can immediately test all frontend workflows with these credentials:

| Role | Name | Email | Password | Notable Features |
| :--- | :--- | :--- | :--- | :--- |
| **Job Seeker** | Sunil Kumar Pokkalla | `sunil@slotmyinterview.com` | `Password123!` | Frontend Architect, Score: 96.5, Actively Looking (Green), Next.js/React |
| **Job Seeker** | Alex Rivera | `alex@arivera.ai` | `Password123!` | Senior AI Engineer, Score: 97.2, Tasked with PyTorch Challenge |
| **Job Seeker** | Sarah Chen | `sarah@chen.systems` | `Password123!` | Distributed Systems Lead, Score: 94.8, Open to Opportunities (Orange) |
| **Job Provider** | Scale AI & Anthropic | `recruiting@scale.ai` | `Password123!` | Has active AI/MLOps job posting and candidate in Tasked stage |
| **Job Provider** | Stripe | `careers@stripe.com` | `Password123!` | Has active Distributed Systems job and open interview slots |
| **Job Provider** | Vercel | `talent@vercel.com` | `Password123!` | Has Frontend Architect job with booked candidate interview |

---

## OpenAPI / Swagger Documentation

An interactive Swagger UI is built-in and accessible at:
- **Interactive UI**: `http://localhost:5000/api-docs`
- **Raw OpenAPI Spec (JSON)**: `http://localhost:5000/api-docs/json`

---

## Horizontal Scaling & Production Deployment

### 1. Docker Compose Multi-Container Stack
Run the entire production-grade topology with 3 load-balanced API replicas, 2 decoupled BullMQ workers, PostgreSQL, Redis, and Nginx:

```bash
docker-compose up --build -d
```

To scale API instances up or down dynamically:
```bash
docker-compose up -d --scale api=5 --scale worker=3
```

### 2. Kubernetes Deployment (`k8s/`)
Deploy into any standard Kubernetes cluster (GKE, EKS, AKS):

```bash
kubectl apply -f k8s/configmap-secrets.yaml
kubectl apply -f k8s/api-deployment.yaml
kubectl apply -f k8s/worker-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

Features included:
- **Zero-Downtime Rolling Updates**: `maxSurge: 1`, `maxUnavailable: 0`.
- **Health Probes**: Liveness and readiness probes checking `/health`.
- **Horizontal Pod Autoscaling (HPA)**: Automatically scales pods from 3 to 15 based on CPU and memory thresholds.
- **TLS Ingress**: Automated Let's Encrypt certificates and CORS headers.

