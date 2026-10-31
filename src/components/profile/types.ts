export interface CandidateData {
  id?: string;
  name: string;
  headline: string;
  location: string;
  about: string;
  avatarUrl: string;
  github?: string;
  linkedin?: string;
  email: string;
  username?: string;
  workAuthType?: string;
  availability?: "ACTIVELY_LOOKING" | "OPEN_TO_OPPORTUNITIES" | "NOT_LOOKING";
  availabilityBadge?: {
    status: string;
    color: "green" | "orange" | "red";
    label: string;
  };
  compositeScore?: number;
  githubScore?: number;
  assessmentScore?: number;
  completenessScore?: number;
  endorsementScore?: number;
  experience: {
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    description: string[];
    logoUrl?: string;
    link?: string;
  }[];
  education?: {
    id: string;
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
  }[];
  skills: string[];
  nonTechSkills?: string[];
  portfolioLinks?: {
    id: string;
    platform: string;
    url: string;
    title?: string;
    detectedTechStack: string[];
  }[];
  endorsements?: {
    id: string;
    skillName: string;
    comment?: string;
    endorser?: {
      fullName: string;
      username: string;
      photoUrl?: string;
      headline?: string;
    };
  }[];
  videoPitchUrl?: string | null;
  videoPitchDurationSec?: number;
  calcomLink?: string;
}
