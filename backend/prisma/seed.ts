import { PrismaClient, Role, AuthProvider, AvailabilityStatus, WorkLocation, WorkType, PipelineStage, TaskType, TaskStatus, InterviewFormat, InterviewStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting SlotMyInterview database seeding...");

  // Clear existing data in reverse order of foreign keys
  await prisma.jobAlertDispatch.deleteMany();
  await prisma.interviewBooking.deleteMany();
  await prisma.interviewSlot.deleteMany();
  await prisma.candidateTask.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.job.deleteMany();
  await prisma.endorsement.deleteMany();
  await prisma.socialProfile.deleteMany();
  await prisma.portfolioLink.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.seekerSkill.deleteMany();
  await prisma.seekerProfile.deleteMany();
  await prisma.providerProfile.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleared existing database tables.");

  // ==============================================================
  // 1. Skill Categories & Technical Skills Taxonomy
  // ==============================================================
  const categoriesData = [
    {
      name: "Languages",
      slug: "languages",
      description: "Core programming and system languages",
      order: 1,
      skills: ["TypeScript", "JavaScript", "Python", "Go", "Rust", "Java", "C++", "Swift", "Kotlin", "Ruby", "SQL"],
    },
    {
      name: "Frameworks",
      slug: "frameworks",
      description: "Frontend, backend, and fullstack frameworks",
      order: 2,
      skills: ["React", "Next.js", "Node.js", "Express", "FastAPI", "Django", "Vue.js", "Tailwind CSS", "GraphQL", "Spring Boot"],
    },
    {
      name: "Cloud",
      slug: "cloud",
      description: "Cloud computing and infrastructure platforms",
      order: 3,
      skills: ["AWS", "Google Cloud", "Microsoft Azure", "Cloudflare", "Kubernetes", "Docker", "Terraform", "Serverless"],
    },
    {
      name: "Databases",
      slug: "databases",
      description: "Relational, NoSQL, in-memory, and vector databases",
      order: 4,
      skills: ["PostgreSQL", "Redis", "MongoDB", "MySQL", "Cassandra", "Elasticsearch", "Pinecone", "Milvus", "DynamoDB"],
    },
    {
      name: "DevOps",
      slug: "devops",
      description: "CI/CD, observability, streaming, and deployment tooling",
      order: 5,
      skills: ["GitHub Actions", "CI/CD", "Prometheus", "Grafana", "Kafka", "RabbitMQ", "ArgoCD", "Datadog", "gRPC"],
    },
    {
      name: "AI & MLOps",
      slug: "ai-mlops",
      description: "Deep learning, fine-tuning, neural networks, and model serving",
      order: 6,
      skills: ["PyTorch", "TensorFlow", "CUDA", "LLM Fine-tuning", "LangChain", "Hugging Face", "vLLM", "Triton"],
    },
  ];

  const skillMap: Record<string, string> = {};
  const categoryMap: Record<string, string> = {};

  for (const cat of categoriesData) {
    const createdCat = await prisma.skillCategory.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        order: cat.order,
      },
    });
    categoryMap[cat.slug] = createdCat.id;

    for (const skillName of cat.skills) {
      const createdSkill = await prisma.skill.create({
        data: {
          name: skillName,
          slug: skillName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          categoryId: createdCat.id,
        },
      });
      skillMap[skillName] = createdSkill.id;
    }
  }

  console.log(`✅ Seeded ${categoriesData.length} skill categories and ${Object.keys(skillMap).length} technical skills.`);

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // ==============================================================
  // 2. Job Providers (Companies)
  // ==============================================================
  const provider1User = await prisma.user.create({
    data: {
      email: "recruiting@scale.ai",
      passwordHash,
      role: Role.JOB_PROVIDER,
      authProvider: AuthProvider.LOCAL,
      isEmailVerified: true,
      providerProfile: {
        create: {
          companyName: "Scale AI & Anthropic Partner",
          website: "https://scale.com",
          description: "Scale AI accelerates the development of AI applications by providing a data-centric end-to-end foundation for frontier models.",
          logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&q=80",
          location: "San Francisco, CA",
        },
      },
    },
    include: { providerProfile: true },
  });

  const provider2User = await prisma.user.create({
    data: {
      email: "careers@stripe.com",
      passwordHash,
      role: Role.JOB_PROVIDER,
      authProvider: AuthProvider.LOCAL,
      isEmailVerified: true,
      providerProfile: {
        create: {
          companyName: "Stripe",
          website: "https://stripe.com",
          description: "Financial infrastructure for the internet. Millions of companies of all sizes use Stripe's software to accept payments.",
          logoUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=128&q=80",
          location: "South San Francisco, CA",
        },
      },
    },
    include: { providerProfile: true },
  });

  const provider3User = await prisma.user.create({
    data: {
      email: "talent@vercel.com",
      passwordHash,
      role: Role.JOB_PROVIDER,
      authProvider: AuthProvider.LOCAL,
      isEmailVerified: true,
      providerProfile: {
        create: {
          companyName: "Vercel",
          website: "https://vercel.com",
          description: "Vercel is the platform for frontend developers, providing the speed and reliability innovators need to build at the edge.",
          logoUrl: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=128&q=80",
          location: "San Francisco, CA",
        },
      },
    },
    include: { providerProfile: true },
  });

  console.log("✅ Seeded 3 Job Providers (Scale AI, Stripe, Vercel).");

  // ==============================================================
  // 3. Sample Jobs with Required & Preferred Skills
  // ==============================================================
  const job1 = await prisma.job.create({
    data: {
      providerId: provider1User.providerProfile!.id,
      title: "Senior AI / MLOps Engineer",
      description: "We are seeking a Senior AI/MLOps engineer to build low-latency inference pipelines, optimize PyTorch AST compilation, and manage distributed GPU clusters for frontier models.",
      categoryId: categoryMap["ai-mlops"],
      salaryMin: 185000,
      salaryMax: 245000,
      currency: "USD",
      location: "San Francisco, CA",
      workLocation: WorkLocation.REMOTE,
      workType: WorkType.FULL_TIME,
      isActive: true,
      requiredSkills: {
        connect: [
          { id: skillMap["PyTorch"] },
          { id: skillMap["CUDA"] },
          { id: skillMap["Python"] },
          { id: skillMap["LLM Fine-tuning"] },
        ],
      },
      preferredSkills: {
        connect: [
          { id: skillMap["Rust"] },
          { id: skillMap["Docker"] },
          { id: skillMap["Kubernetes"] },
        ],
      },
    },
  });

  const job2 = await prisma.job.create({
    data: {
      providerId: provider2User.providerProfile!.id,
      title: "Staff Distributed Systems Engineer",
      description: "Join the ledger infrastructure team to architect high-throughput transactional pipelines, distributed consensus systems, and ultra-reliable financial routing.",
      categoryId: categoryMap["languages"],
      salaryMin: 210000,
      salaryMax: 280000,
      currency: "USD",
      location: "Seattle, WA",
      workLocation: WorkLocation.HYBRID,
      workType: WorkType.FULL_TIME,
      isActive: true,
      requiredSkills: {
        connect: [
          { id: skillMap["Go"] },
          { id: skillMap["Kubernetes"] },
          { id: skillMap["PostgreSQL"] },
          { id: skillMap["gRPC"] },
        ],
      },
      preferredSkills: {
        connect: [
          { id: skillMap["Kafka"] },
          { id: skillMap["Redis"] },
        ],
      },
    },
  });

  const job3 = await prisma.job.create({
    data: {
      providerId: provider3User.providerProfile!.id,
      title: "Staff Frontend Architect",
      description: "Drive Next.js core application performance, server components streaming, and design system accessibility across our developer dashboard products.",
      categoryId: categoryMap["frameworks"],
      salaryMin: 190000,
      salaryMax: 250000,
      currency: "USD",
      location: "San Francisco, CA",
      workLocation: WorkLocation.REMOTE,
      workType: WorkType.FULL_TIME,
      isActive: true,
      requiredSkills: {
        connect: [
          { id: skillMap["React"] },
          { id: skillMap["Next.js"] },
          { id: skillMap["TypeScript"] },
          { id: skillMap["Tailwind CSS"] },
        ],
      },
      preferredSkills: {
        connect: [
          { id: skillMap["GraphQL"] },
          { id: skillMap["Node.js"] },
        ],
      },
    },
  });

  console.log("✅ Seeded 3 Sample Job Postings with skill associations.");

  // ==============================================================
  // 4. Job Seekers (With Complete 5-Section Profiles & Scoring)
  // ==============================================================

  // Seeker 1: Sunil Kumar Pokkalla (matches existing Wellfound-style public view)
  const seeker1User = await prisma.user.create({
    data: {
      email: "sunil@slotmyinterview.com",
      passwordHash,
      role: Role.JOB_SEEKER,
      authProvider: AuthProvider.LOCAL,
      isEmailVerified: true,
      seekerProfile: {
        create: {
          username: "sunil-kumar-pokkalla",
          fullName: "Sunil Kumar Pokkalla",
          headline: "Frontend Architect & UI/UX Engineer",
          photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&q=80",
          bio: "I am a passionate software engineer with extensive experience in building highly scalable, beautiful, and performant user interfaces. I focus heavily on bridging the gap between design and engineering. Throughout my career, I have architected component libraries, driven accessibility initiatives, and optimized web performance across major applications.",
          location: "San Francisco, CA",
          workAuthType: "US Citizen",
          availability: AvailabilityStatus.ACTIVELY_LOOKING, // Green
          nonTechSkills: ["Design Systems", "Accessibility (a11y)", "Design to Code Mentorship", "Technical Writing", "Sprint Planning"],
          compositeScore: 96.5,
          githubScore: 98.0,
          assessmentScore: 95.0,
          completenessScore: 100.0,
          endorsementScore: 90.0,
          lastScoredAt: new Date(),
        },
      },
    },
    include: { seekerProfile: true },
  });

  const seeker1 = seeker1User.seekerProfile!;

  // Seeker 1 Skills
  const s1Skills = ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "GraphQL", "PostgreSQL"];
  for (let i = 0; i < s1Skills.length; i++) {
    await prisma.seekerSkill.create({
      data: {
        seekerId: seeker1.id,
        skillId: skillMap[s1Skills[i]],
        displayOrder: i + 1,
        yearsExp: 7.0 - i * 0.5,
      },
    });
  }

  // Seeker 1 Experiences
  await prisma.experience.createMany({
    data: [
      {
        seekerId: seeker1.id,
        company: "Tech Innovators Inc",
        role: "Senior Frontend Architect",
        startDate: new Date("2021-03-01"),
        isCurrent: true,
        description: "Led the frontend architecture for flagship product used by over 1M MAU. Migrated legacy React SPA to Next.js App Router, cutting FCP by 45%. Established design system library adopted company-wide.",
        link: "https://github.com/sunilkpokkalla",
      },
      {
        seekerId: seeker1.id,
        company: "Creative Solutions LLC",
        role: "UI/UX Engineer",
        startDate: new Date("2018-06-01"),
        endDate: new Date("2021-02-28"),
        isCurrent: false,
        description: "Designed and developed accessible UI components. Implemented complex Framer Motion transitions and collaborated with product managers to define intuitive user flows.",
        link: "https://dribbble.com",
      },
    ],
  });

  // Seeker 1 Portfolios
  await prisma.portfolioLink.createMany({
    data: [
      {
        seekerId: seeker1.id,
        platform: "GitHub",
        url: "https://github.com/sunilkpokkalla/slotmyinterview-core",
        title: "SlotMyInterview Core Design System",
        detectedTechStack: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      },
      {
        seekerId: seeker1.id,
        platform: "Dribbble",
        url: "https://dribbble.com/shots/design-system-tokens",
        title: "Enterprise Dark-Mode UI Kit",
        detectedTechStack: ["UI/UX Design", "Figma"],
      },
      {
        seekerId: seeker1.id,
        platform: "Personal",
        url: "https://sunilkumar.design",
        title: "Personal Engineering & Architecture Portfolio",
        detectedTechStack: ["Next.js", "TypeScript", "Tailwind CSS"],
      },
    ],
  });

  // Seeker 1 Socials
  await prisma.socialProfile.createMany({
    data: [
      { seekerId: seeker1.id, platform: "GitHub", url: "https://github.com/sunilkpokkalla" },
      { seekerId: seeker1.id, platform: "LinkedIn", url: "https://linkedin.com/in/sunilkpokkalla" },
      { seekerId: seeker1.id, platform: "Twitter/X", url: "https://x.com/sunilcode" },
    ],
  });

  // Seeker 2: Alex Rivera (Senior AI Engineer)
  const seeker2User = await prisma.user.create({
    data: {
      email: "alex@arivera.ai",
      passwordHash,
      role: Role.JOB_SEEKER,
      authProvider: AuthProvider.GITHUB,
      providerId: "gh_alex_rivera",
      isEmailVerified: true,
      seekerProfile: {
        create: {
          username: "alexrivera",
          fullName: "Alex Rivera",
          headline: "Senior AI / MLOps Engineer",
          photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&q=80",
          bio: "Specializing in distributed LLM training, PyTorch kernel optimizations, CUDA streaming, and model quantization for edge deployment.",
          location: "San Francisco, CA",
          workAuthType: "US Citizen",
          availability: AvailabilityStatus.ACTIVELY_LOOKING, // Green
          nonTechSkills: ["Research Paper Translation", "Cross-Functional ML Architecture", "Mentorship"],
          compositeScore: 97.2,
          githubScore: 99.0,
          assessmentScore: 96.0,
          completenessScore: 100.0,
          endorsementScore: 92.0,
          lastScoredAt: new Date(),
        },
      },
    },
    include: { seekerProfile: true },
  });

  const seeker2 = seeker2User.seekerProfile!;
  const s2Skills = ["PyTorch", "CUDA", "Python", "LLM Fine-tuning", "Rust", "Docker", "Kubernetes"];
  for (let i = 0; i < s2Skills.length; i++) {
    await prisma.seekerSkill.create({
      data: {
        seekerId: seeker2.id,
        skillId: skillMap[s2Skills[i]],
        displayOrder: i + 1,
        yearsExp: 6.0,
      },
    });
  }

  await prisma.portfolioLink.create({
    data: {
      seekerId: seeker2.id,
      platform: "GitHub",
      url: "https://github.com/arivera-ai/pytorch-quant-engine",
      title: "PyTorch 4-Bit Kernel Engine",
      detectedTechStack: ["PyTorch", "CUDA", "Python", "Rust"],
    },
  });

  // Seeker 3: Sarah Chen (Distributed Systems Lead)
  const seeker3User = await prisma.user.create({
    data: {
      email: "sarah@chen.systems",
      passwordHash,
      role: Role.JOB_SEEKER,
      authProvider: AuthProvider.GOOGLE,
      providerId: "g_sarah_chen",
      isEmailVerified: true,
      seekerProfile: {
        create: {
          username: "sarahchen",
          fullName: "Sarah Chen",
          headline: "Distributed Systems Lead & Infra Architect",
          photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&q=80",
          bio: "Building zero-downtime distributed storage layers, Raft consensus nodes, and multi-region Kubernetes clusters handling 500k RPS.",
          location: "Seattle, WA",
          workAuthType: "Green Card",
          availability: AvailabilityStatus.OPEN_TO_OPPORTUNITIES, // Orange
          nonTechSkills: ["Post-Mortem Facilitation", "On-Call Process Engineering", "System Design Reviews"],
          compositeScore: 94.8,
          githubScore: 96.0,
          assessmentScore: 94.0,
          completenessScore: 100.0,
          endorsementScore: 88.0,
          lastScoredAt: new Date(),
        },
      },
    },
    include: { seekerProfile: true },
  });

  const seeker3 = seeker3User.seekerProfile!;
  const s3Skills = ["Go", "Kubernetes", "gRPC", "Kafka", "PostgreSQL", "Redis"];
  for (let i = 0; i < s3Skills.length; i++) {
    await prisma.seekerSkill.create({
      data: {
        seekerId: seeker3.id,
        skillId: skillMap[s3Skills[i]],
        displayOrder: i + 1,
        yearsExp: 8.0,
      },
    });
  }

  // Seeker 4: Elena Rostova (Staff Backend Architect)
  const seeker4User = await prisma.user.create({
    data: {
      email: "elena@rostova.tech",
      passwordHash,
      role: Role.JOB_SEEKER,
      authProvider: AuthProvider.LOCAL,
      isEmailVerified: true,
      seekerProfile: {
        create: {
          username: "erostova",
          fullName: "Elena Rostova",
          headline: "Staff Backend Architect",
          photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&q=80",
          bio: "High-performance systems programming in Rust and C++. Expert in distributed locking, WebAssembly runtimes, and concurrent database engines.",
          location: "Austin, TX",
          workAuthType: "H1B",
          availability: AvailabilityStatus.NOT_LOOKING, // Red
          nonTechSkills: ["Architecture RFCs", "Security Threat Modeling"],
          compositeScore: 98.4,
          githubScore: 99.0,
          assessmentScore: 98.0,
          completenessScore: 95.0,
          endorsementScore: 95.0,
          lastScoredAt: new Date(),
        },
      },
    },
    include: { seekerProfile: true },
  });

  // Endorsement between peers
  await prisma.endorsement.create({
    data: {
      seekerId: seeker1.id,
      endorserId: seeker2.id,
      skillName: "Next.js",
      comment: "Sunil is one of the highest-taste frontend engineers I've worked with. Outstanding architecture and performance intuition.",
    },
  });

  await prisma.endorsement.create({
    data: {
      seekerId: seeker2.id,
      endorserId: seeker3.id,
      skillName: "PyTorch",
      comment: "Alex writes the cleanest custom CUDA ops and PyTorch tensor transformations in the industry.",
    },
  });

  console.log("✅ Seeded 4 complete Seeker Profiles with skills, experiences, portfolios, and endorsements.");

  // ==============================================================
  // 5. Kanban Pipeline Submissions, Tasks & Interview Scheduling
  // ==============================================================

  // Submission 1: Alex Rivera -> Scale AI Job (Stage: TASKED)
  const sub1 = await prisma.submission.create({
    data: {
      jobId: job1.id,
      seekerId: seeker2.id,
      stage: PipelineStage.TASKED,
      coverNote: "Excited about Scale AI's infrastructure work on LLM model evaluation. My PyTorch quantization engine is directly applicable.",
    },
  });

  // Assigned Task in TASKED stage
  const taskDeadline = new Date();
  taskDeadline.setDate(taskDeadline.getDate() + 3);

  await prisma.candidateTask.create({
    data: {
      submissionId: sub1.id,
      taskType: TaskType.TECHNICAL_CHALLENGE,
      title: "PyTorch AST Optimization & Memory Profiler",
      instructions: "Implement a custom Python AST transformer that intercepts PyTorch module graph execution, traces memory allocations, and reduces VRAM peak consumption by >= 15% on a sample Llama-3 attention block.",
      deadline: taskDeadline,
      status: TaskStatus.IN_PROGRESS,
    },
  });

  // Submission 2: Sarah Chen -> Stripe Job (Stage: SHORTLISTED)
  const sub2 = await prisma.submission.create({
    data: {
      jobId: job2.id,
      seekerId: seeker3.id,
      stage: PipelineStage.SHORTLISTED,
      coverNote: "Led zero-downtime consensus replication at scale. Stripe's financial reliability standards align perfectly with my distributed systems background.",
    },
  });

  // Interview Slots defined by Stripe for Job 2
  const slotDate1 = new Date();
  slotDate1.setDate(slotDate1.getDate() + 2);
  slotDate1.setHours(14, 0, 0, 0);

  const slotDate1End = new Date(slotDate1);
  slotDate1End.setHours(15, 0, 0, 0);

  const slot1 = await prisma.interviewSlot.create({
    data: {
      jobId: job2.id,
      format: InterviewFormat.REMOTE,
      location: "https://meet.google.com/abc-defg-hij",
      startTime: slotDate1,
      endTime: slotDate1End,
      isBooked: false,
    },
  });

  const slotDate2 = new Date();
  slotDate2.setDate(slotDate2.getDate() + 3);
  slotDate2.setHours(10, 30, 0, 0);

  const slotDate2End = new Date(slotDate2);
  slotDate2End.setHours(11, 30, 0, 0);

  await prisma.interviewSlot.create({
    data: {
      jobId: job2.id,
      format: InterviewFormat.IN_PERSON,
      location: "Stripe HQ - 510 Townsend St, San Francisco, CA (Room 4B)",
      startTime: slotDate2,
      endTime: slotDate2End,
      isBooked: false,
    },
  });

  // Submission 3: Sunil Kumar Pokkalla -> Vercel Job (Stage: SHORTLISTED)
  const sub3 = await prisma.submission.create({
    data: {
      jobId: job3.id,
      seekerId: seeker1.id,
      stage: PipelineStage.SHORTLISTED,
      coverNote: "Built high-performance design systems and Next.js applications for 1M+ active users. Deeply aligned with Vercel's mission.",
    },
  });

  // Slot for Vercel Job 3
  const vSlotDate = new Date();
  vSlotDate.setDate(vSlotDate.getDate() + 1);
  vSlotDate.setHours(16, 0, 0, 0);

  const vSlotDateEnd = new Date(vSlotDate);
  vSlotDateEnd.setHours(17, 0, 0, 0);

  const vSlot = await prisma.interviewSlot.create({
    data: {
      jobId: job3.id,
      format: InterviewFormat.REMOTE,
      location: "https://meet.google.com/ver-cel-meet",
      startTime: vSlotDate,
      endTime: vSlotDateEnd,
      isBooked: true,
    },
  });

  // Booked interview for Sunil
  await prisma.interviewBooking.create({
    data: {
      slotId: vSlot.id,
      submissionId: sub3.id,
      status: InterviewStatus.SCHEDULED,
      notes: "Discussion on Next.js 16 Server Components architecture and design system performance.",
    },
  });

  console.log("✅ Seeded Kanban submissions, candidate tasks, interview slots, and bookings.");

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("------------------------------------------------------------");
  console.log("Default Test Credentials:");
  console.log("  Seeker (Sunil Kumar):  sunil@slotmyinterview.com / Password123!");
  console.log("  Seeker (Alex Rivera):  alex@arivera.ai           / Password123!");
  console.log("  Provider (Scale AI):   recruiting@scale.ai       / Password123!");
  console.log("  Provider (Stripe):     careers@stripe.com        / Password123!");
  console.log("  Provider (Vercel):     talent@vercel.com         / Password123!");
  console.log("------------------------------------------------------------\n");
}

main()
  .catch((e) => {
    console.error("❌ Error during database seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

