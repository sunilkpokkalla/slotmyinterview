import { ProfileLayout, CandidateData } from "@/components/profile/profile-layout";
import { notFound } from "next/navigation";

// Dummy data representing Sunil's profile, modeled closely after his Wellfound profile
const dummyData: Record<string, CandidateData> = {
  "sunil-kumar-pokkalla": {
    name: "Sunil Kumar Pokkalla",
    headline: "Frontend Architect & UI/UX Engineer",
    location: "San Francisco, CA",
    about: "I am a passionate software engineer with extensive experience in building highly scalable, beautiful, and performant user interfaces. I focus heavily on bridging the gap between design and engineering. Throughout my career, I have architected component libraries, driven accessibility initiatives, and optimized web performance across major applications.",
    avatarUrl: "",
    github: "https://github.com/sunilkpokkalla",
    linkedin: "https://linkedin.com/in/sunilkpokkalla",
    email: "sunil@example.com",
    experience: [
      {
        id: "exp1",
        company: "Tech Innovators Inc",
        role: "Senior Frontend Engineer",
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
      },
      {
        id: "exp3",
        company: "StartUp Co.",
        role: "Frontend Developer",
        startDate: "2016",
        endDate: "2018",
        description: [
          "Built responsive landing pages and marketing websites using React and Tailwind CSS.",
          "Integrated third-party APIs and managed global state using Redux."
        ]
      }
    ],
    education: [
      {
        id: "edu1",
        school: "University of Technology",
        degree: "B.S. in Computer Science",
        startDate: "2012",
        endDate: "2016"
      }
    ],
    skills: [
      "React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", 
      "GraphQL", "Node.js", "UI/UX Design", "Accessibility (a11y)", "Performance Optimization",
      "Jest", "Cypress", "Figma"
    ]
  }
};

export default async function CandidateProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const candidate = dummyData[resolvedParams.username];

  if (!candidate) {
    notFound();
  }

  return <ProfileLayout candidate={candidate} />;
}
