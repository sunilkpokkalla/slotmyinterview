import { ProfileLayout, CandidateData } from "@/components/profile/profile-layout";
import { notFound } from "next/navigation";

// Local fallback dictionary
const fallbackData: Record<string, CandidateData> = {
  "sunil-kumar-pokkalla": {
    name: "Sunil Kumar Pokkalla",
    headline: "Frontend Architect & UI/UX Engineer",
    location: "San Francisco, CA",
    about: "I am a passionate software engineer with extensive experience in building highly scalable, beautiful, and performant user interfaces. I focus heavily on bridging the gap between design and engineering. Throughout my career, I have architected component libraries, driven accessibility initiatives, and optimized web performance across major applications.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&q=80",
    github: "https://github.com/sunilkpokkalla",
    linkedin: "https://linkedin.com/in/sunilkpokkalla",
    email: "sunil@slotmyinterview.com",
    availability: "ACTIVELY_LOOKING",
    compositeScore: 96.5,
    githubScore: 98.0,
    assessmentScore: 95.0,
    completenessScore: 100.0,
    endorsementScore: 90.0,
    experience: [
      {
        id: "exp1",
        company: "Tech Innovators Inc",
        role: "Senior Frontend Architect",
        startDate: "2021",
        endDate: "Present",
        description: [
          "Led the frontend architecture for the core flagship product used by over 1M monthly active users.",
          "Migrated the legacy React SPA to Next.js, improving First Contentful Paint by 45%.",
          "Established and maintained the company-wide design system, reducing design-to-code time by 30%."
        ]
      },
      {
        id: "exp2",
        company: "Creative Solutions LLC",
        role: "UI/UX Engineer",
        startDate: "2018",
        endDate: "2021",
        description: [
          "Designed and developed accessible user interfaces across multiple client projects.",
          "Implemented complex Framer Motion animations to increase user engagement metrics.",
          "Collaborated closely with product managers to define feature requirements and user flows."
        ]
      }
    ],
    skills: [
      "React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", 
      "GraphQL", "Node.js", "UI/UX Design", "Accessibility (a11y)", "Performance Optimization",
      "PostgreSQL"
    ],
    nonTechSkills: ["Design Systems", "Accessibility (a11y)", "Mentorship", "Technical Writing"],
    portfolioLinks: [
      {
        id: "port1",
        platform: "GitHub",
        url: "https://github.com/sunilkpokkalla/slotmyinterview-core",
        title: "SlotMyInterview Core Design System",
        detectedTechStack: ["React", "Next.js", "TypeScript", "Tailwind CSS"]
      },
      {
        id: "port2",
        platform: "Personal",
        url: "https://sunilkumar.design",
        title: "Personal Engineering & Architecture Portfolio",
        detectedTechStack: ["Next.js", "TypeScript", "Tailwind CSS"]
      }
    ]
  }
};

export default async function CandidateProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const username = resolvedParams.username.toLowerCase();

  let candidate: CandidateData | null = null;

  try {
    const res = await fetch(`http://localhost:5001/api/v1/seekers/u/${username}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const raw = json.data;
        candidate = {
          id: raw.id,
          name: raw.fullName,
          headline: raw.headline || "Software Engineer",
          location: raw.location || "Remote",
          about: raw.bio || "Passionate engineer verified on SlotMyInterview.",
          avatarUrl: raw.photoUrl || "",
          email: raw.user?.email || "verified@slotmyinterview.com",
          username: raw.username,
          workAuthType: raw.workAuthType,
          availability: raw.availability,
          compositeScore: raw.compositeScore,
          githubScore: raw.githubScore,
          assessmentScore: raw.assessmentScore,
          completenessScore: raw.completenessScore,
          endorsementScore: raw.endorsementScore,
          experience: (raw.experiences || []).map((e: any) => ({
            id: e.id,
            company: e.company,
            role: e.role,
            startDate: new Date(e.startDate).getFullYear().toString(),
            endDate: e.endDate ? new Date(e.endDate).getFullYear().toString() : "Present",
            description: [e.description],
            link: e.link,
          })),
          skills: (raw.skills || []).map((s: any) => s.skill?.name || s.name || s),
          nonTechSkills: raw.nonTechSkills || [],
          portfolioLinks: raw.portfolioLinks || [],
          endorsements: raw.endorsements || [],
          github: (raw.portfolioLinks || []).find((p: any) => p.platform === "GitHub")?.url || (raw.socialProfiles || []).find((s: any) => s.platform.toLowerCase().includes("github"))?.url,
          linkedin: (raw.socialProfiles || []).find((s: any) => s.platform.toLowerCase().includes("linkedin"))?.url,
        };
      }
    }
  } catch {
    // API server unreachable during build/static render; fall back to local
  }

  if (!candidate) {
    candidate = fallbackData[username];
  }

  if (!candidate) {
    notFound();
  }

  return <ProfileLayout candidate={candidate} />;
}
