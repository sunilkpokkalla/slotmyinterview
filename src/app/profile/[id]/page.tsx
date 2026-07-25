import { ProfileLayout, CandidateData } from "@/components/profile/profile-layout";
import { notFound } from "next/navigation";

// Using the same high-end layout and data structure for any profile visited
const dummyData: Record<string, CandidateData> = {
  "demo": {
    name: "Alex Rivera",
    headline: "AI Engineer & Systems Architect",
    location: "San Francisco, CA",
    about: "AI Engineer specializing in Large Language Models, optimization, and distributed training. Previously built scalable inference engines processing 10M+ reqs/day.",
    avatarUrl: "",
    github: "https://github.com/arivera-ai",
    linkedin: "https://linkedin.com/in/arivera",
    email: "alex@example.com",
    experience: [
      {
        id: "exp1",
        company: "OpenAI",
        role: "Machine Learning Engineer",
        startDate: "2021",
        endDate: "Present",
        description: [
          "Optimized matrix multiplication kernels, reducing inference latency by 15%.",
          "Scaled training data pipelines to handle petabytes of text data efficiently."
        ]
      },
      {
        id: "exp2",
        company: "Tech StartUp",
        role: "Backend Developer",
        startDate: "2019",
        endDate: "2021",
        description: [
          "Built high-throughput distributed microservices in Rust and Go.",
          "Managed Kubernetes clusters across multiple AWS regions."
        ]
      }
    ],
    education: [
      {
        id: "edu1",
        school: "Stanford University",
        degree: "M.S. in Computer Science (AI Track)",
        startDate: "2017",
        endDate: "2019"
      }
    ],
    skills: ["PyTorch", "LLMs", "Rust", "CUDA", "TensorFlow", "Go", "Kubernetes"]
  }
};

export default async function CandidateProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // For the demo, we'll just show the Alex Rivera profile if it's 'demo', 
  // or fallback to Alex Rivera for any other random ID so it always looks good.
  const candidate = dummyData[resolvedParams.id] || dummyData["demo"];

  if (!candidate) {
    notFound();
  }

  return <ProfileLayout candidate={candidate} />;
}
