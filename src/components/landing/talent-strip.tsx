"use client";

import Link from "next/link";
import { ArrowRight, Star, Video, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

interface CandidateCard {
  username: string;
  name: string;
  headline: string;
  location: string;
  score: number;
  availability: "ACTIVELY_LOOKING" | "OPEN_TO_OPPORTUNITIES";
  avatar: string;
  skills: string[];
  hasVideoPitch: boolean;
}

const FEATURED_TALENT: CandidateCard[] = [
  {
    username: "sunil-kumar-pokkalla",
    name: "Sunil Kumar Pokkalla",
    headline: "Frontend Architect & Design Systems Lead",
    location: "San Francisco, CA",
    score: 96.5,
    availability: "ACTIVELY_LOOKING",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&q=80",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    hasVideoPitch: true,
  },
  {
    username: "alexrivera",
    name: "Alex Rivera",
    headline: "Senior AI / MLOps Engineer",
    location: "San Francisco, CA",
    score: 97.2,
    availability: "ACTIVELY_LOOKING",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&q=80",
    skills: ["PyTorch", "CUDA", "Python", "LLM Fine-tuning"],
    hasVideoPitch: true,
  },
  {
    username: "sarahchen",
    name: "Sarah Chen",
    headline: "Distributed Systems Lead & Infra Architect",
    location: "Seattle, WA",
    score: 94.8,
    availability: "OPEN_TO_OPPORTUNITIES",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&q=80",
    skills: ["Go", "Kubernetes", "gRPC", "Kafka", "PostgreSQL"],
    hasVideoPitch: true,
  },
];

export function TalentStrip() {
  return (
    <section className="py-20 bg-ink-0 border-t border-hair relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="eyebrow">Direct Talent Pool</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-fg-0">
              Verified engineers. <em className="text-purple-400 font-serif">Instant interview slots.</em>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-fg-2 max-w-2xl">
              Inspect verified commit histories, watch 60s technical video pitches, and lock an interview with zero back-and-forth.
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-500/20 active:scale-[0.98] shrink-0"
          >
            <span>Explore All Verified Talent</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick Skill Filters Pill Strip */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 overflow-x-auto text-xs font-mono">
          <span className="text-fg-3 mr-2 font-sans font-semibold text-[11px] uppercase tracking-wider">Top Stacks:</span>
          {["All Stacks", "AI & MLOps", "PyTorch", "Next.js", "Kubernetes", "Rust", "Distributed Systems"].map((tag, i) => (
            <Link
              key={tag}
              href={i === 0 ? "/search" : `/search?skill=${encodeURIComponent(tag)}`}
              className={`px-3 py-1.5 rounded-full border transition-all ${
                i === 0
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold"
                  : "bg-white/[0.02] hover:bg-white/[0.06] text-fg-2 hover:text-white border-hair hover:border-white/20"
              }`}
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* 3 Candidate Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURED_TALENT.map((candidate) => (
            <div
              key={candidate.username}
              className="bezel-outer group hover:-translate-y-1 transition-all duration-300"
            >
              <div className="bezel-inner flex flex-col justify-between h-full p-6 bg-ink-1/90 rounded-2xl border border-hair">
                
                <div>
                  {/* Top Row: Avatar + Availability Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-white/10 shadow-md"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-ink-1 flex items-center justify-center ${
                          candidate.availability === "ACTIVELY_LOOKING" ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                        title={candidate.availability === "ACTIVELY_LOOKING" ? "Actively Looking" : "Open to Opportunities"}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {/* Composite Score Pill */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold shadow-xs">
                        <Sparkles className="w-3 h-3" />
                        <span>{candidate.score}</span>
                        <span className="text-[10px] text-emerald-500/80">/100</span>
                      </div>

                      {/* Availability text badge */}
                      <span className={`text-[10px] font-mono tracking-tight font-medium ${
                        candidate.availability === "ACTIVELY_LOOKING" ? "text-emerald-400" : "text-amber-400"
                      }`}>
                        {candidate.availability === "ACTIVELY_LOOKING" ? "● Actively Looking" : "○ Open to Offers"}
                      </span>
                    </div>
                  </div>

                  {/* Candidate Info */}
                  <h3 className="text-base font-bold text-fg-0 group-hover:text-purple-300 transition-colors">
                    {candidate.name}
                  </h3>
                  <p className="text-xs text-fg-2 font-medium mt-0.5 line-clamp-1">
                    {candidate.headline}
                  </p>
                  <p className="text-[11px] text-fg-3 font-mono mt-1">
                    {candidate.location}
                  </p>

                  {/* Highlights Pill: 60s Video Pitch */}
                  {candidate.hasVideoPitch && (
                    <div className="mt-3.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-medium">
                      <Video className="w-3 h-3 text-purple-400" />
                      <span>60s Video Pitch Ready</span>
                    </div>
                  )}

                  {/* Skills Cloud */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {candidate.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-hair text-fg-2 text-[11px] font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="mt-6 pt-4 border-t border-hair-2 flex items-center justify-between">
                  <span className="text-xs font-mono text-fg-3">
                    /u/{candidate.username}
                  </span>
                  <Link
                    href={`/u/${candidate.username}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors group-hover:translate-x-1 duration-200"
                  >
                    <span>View Profile & Slot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 to-ink-1 border border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-fg-0">Looking to hire engineering talent with verified proof?</h4>
              <p className="text-xs text-fg-2 mt-0.5">Filter by AST complexity, check code authorship, and book interviews directly.</p>
            </div>
          </div>
          <Link
            href="/search"
            className="btn btn-accent text-xs px-5 py-2.5 whitespace-nowrap shrink-0"
          >
            Search Talent Directory
          </Link>
        </div>

      </div>
    </section>
  );
}
