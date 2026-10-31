"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  GitBranch, 
  Link as LinkIcon, 
  Mail, 
  Download, 
  Code,
  Award,
  Star,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  FolderGit2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { CandidateData } from "./types";
import { updateAvailability } from "@/app/actions/seeker";
import { VideoPitchPlayer } from "./video-pitch-player";
import { BookInterview } from "./book-interview";

export type { CandidateData } from "./types";

export type ProfileViewer = {
  isOwner: boolean;
  isRecruiter: boolean;
  isSignedIn: boolean;
  name?: string;
  email?: string;
};

interface ProfileLayoutProps {
  candidate: CandidateData;
  viewer: ProfileViewer;
}

export function ProfileLayout({ candidate, viewer }: ProfileLayoutProps) {
  const [availability, setAvailability] = useState(candidate.availability || "ACTIVELY_LOOKING");
  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  // Only the profile owner sees the toggle; the server action re-checks ownership.
  const handleAvailabilityChange = async (newStatus: "ACTIVELY_LOOKING" | "OPEN_TO_OPPORTUNITIES" | "NOT_LOOKING") => {
    if (!viewer.isOwner) return;
    const previous = availability;
    setAvailability(newStatus);
    setIsUpdatingAvailability(true);
    const res = await updateAvailability(newStatus);
    if (!res.ok) setAvailability(previous);
    setIsUpdatingAvailability(false);
  };

  const availabilityColorMap = {
    ACTIVELY_LOOKING: {
      bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
      dot: "bg-emerald-500",
      label: "Actively Looking",
      badgeColor: "green"
    },
    OPEN_TO_OPPORTUNITIES: {
      bg: "bg-amber-500/10 text-amber-600 border-amber-500/30",
      dot: "bg-amber-500",
      label: "Open to Opportunities",
      badgeColor: "orange"
    },
    NOT_LOOKING: {
      bg: "bg-rose-500/10 text-rose-600 border-rose-500/30",
      dot: "bg-rose-500",
      label: "Not Looking",
      badgeColor: "red"
    }
  };

  const currentBadge = availabilityColorMap[availability] || availabilityColorMap.ACTIVELY_LOOKING;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-24 text-slate-900">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header Card */}
          <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-8 md:p-12 relative overflow-hidden">
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              
              {/* Avatar */}
              <div className="relative w-32 h-32 shrink-0">
                <Image
                  src={candidate.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(candidate.name) + "&size=256&background=6366f1&color=fff"}
                  alt={candidate.name}
                  fill
                  sizes="128px"
                  className="rounded-2xl object-cover border-4 border-white shadow-lg"
                />
              </div>

              {/* Identity & Headline */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {candidate.name}
                  </h1>
                  
                  {/* Verified Talent Badge */}
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Talent
                  </div>

                  {/* Composite Talent Score Pill */}
                  {(candidate.compositeScore ?? 0) > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-bold shadow-sm">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      Score: {candidate.compositeScore}/100
                    </div>
                  )}
                </div>

                <p className="text-lg text-slate-700 font-medium">
                  {candidate.headline}
                </p>

                {/* Location & Work Auth */}
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  {candidate.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {candidate.location}
                    </div>
                  )}
                  {candidate.workAuthType && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                      Auth: {candidate.workAuthType}
                    </div>
                  )}
                  {candidate.email && viewer.isOwner && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {candidate.email}
                    </div>
                  )}
                </div>

                {/* Availability State Toggle Banner */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status:</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${currentBadge.bg}`}>
                      <span className={`w-2 h-2 rounded-full ${currentBadge.dot} animate-pulse`} />
                      {currentBadge.label}
                    </span>
                  </div>

                  {/* Availability Toggle Radio Group */}
                  {viewer.isOwner && (
                  <div className={`flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold ${isUpdatingAvailability ? "opacity-60" : ""}`}>
                    <button
                      onClick={() => handleAvailabilityChange("ACTIVELY_LOOKING")}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        availability === "ACTIVELY_LOOKING" 
                          ? "bg-white text-emerald-700 shadow-sm font-bold" 
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      🟢 Actively Looking
                    </button>
                    <button
                      onClick={() => handleAvailabilityChange("OPEN_TO_OPPORTUNITIES")}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        availability === "OPEN_TO_OPPORTUNITIES" 
                          ? "bg-white text-amber-700 shadow-sm font-bold" 
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      🟠 Open
                    </button>
                    <button
                      onClick={() => handleAvailabilityChange("NOT_LOOKING")}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        availability === "NOT_LOOKING" 
                          ? "bg-white text-rose-700 shadow-sm font-bold" 
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      🔴 Not Looking
                    </button>
                  </div>
                  )}
                </div>

                {/* Social Profiles & CTA */}
                <div className="flex flex-wrap gap-3 pt-3">
                  {candidate.github && (
                    <Link 
                      href={candidate.github.startsWith("http") ? candidate.github : `https://github.com/${candidate.github}`}
                      target="_blank"
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm font-medium transition-colors"
                    >
                      <GitBranch className="w-4 h-4 text-slate-600" />
                      GitHub
                    </Link>
                  )}
                  {candidate.linkedin && (
                    <Link 
                      href={candidate.linkedin.startsWith("http") ? candidate.linkedin : `https://linkedin.com/in/${candidate.linkedin}`}
                      target="_blank"
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm font-medium transition-colors"
                    >
                      <LinkIcon className="w-4 h-4 text-blue-600" />
                      LinkedIn
                    </Link>
                  )}
                  {candidate.calcomLink && !viewer.isOwner && (
                    <a
                      href="#book"
                      className="flex items-center gap-2 px-5 py-2 bg-[#6B47ED] hover:bg-[#5835dc] text-white rounded-xl text-sm font-semibold transition-all ml-auto shadow-sm"
                    >
                      Slot An Interview
                    </a>
                  )}
                  {viewer.isOwner && (
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all ml-auto shadow-sm"
                    >
                      Edit profile
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* 60-second video pitch */}
          {candidate.videoPitchUrl && (
            <motion.div variants={itemVariants}>
              <VideoPitchPlayer src={candidate.videoPitchUrl} name={candidate.name} durationSec={candidate.videoPitchDurationSec} />
            </motion.div>
          )}

          {/* Book an interview on the candidate's Cal.com calendar */}
          {candidate.calcomLink && !viewer.isOwner && (
            <motion.div variants={itemVariants} id="book" className="scroll-mt-28">
              <BookInterview calLink={candidate.calcomLink} candidateName={candidate.name} viewer={viewer} />
            </motion.div>
          )}

          {/* Composite Talent Score Metrics Breakdown */}
          {(candidate.compositeScore ?? 0) > 0 && (
            <motion.div variants={itemVariants} className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    AI Talent Score Breakdown
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">Autonomous evaluation synthesized across commit velocity, verified tasks & peer endorsements</p>
                </div>
                <div className="text-3xl font-black text-amber-400">
                  {candidate.compositeScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
                  <div className="text-xs text-slate-400 mb-1">GitHub Quality (35%)</div>
                  <div className="text-2xl font-bold text-emerald-400">{Math.round(candidate.githubScore ?? 0)}%</div>
                  <div className="text-[11px] text-slate-500 mt-1">AST & Commit Depth</div>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
                  <div className="text-xs text-slate-400 mb-1">Assessments (25%)</div>
                  <div className="text-2xl font-bold text-indigo-400">{Math.round(candidate.assessmentScore ?? 0)}%</div>
                  <div className="text-[11px] text-slate-500 mt-1">Completed Challenges</div>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
                  <div className="text-xs text-slate-400 mb-1">Completeness (25%)</div>
                  <div className="text-2xl font-bold text-sky-400">{Math.round(candidate.completenessScore ?? 0)}%</div>
                  <div className="text-[11px] text-slate-500 mt-1">Profile & Tech Taxonomy</div>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
                  <div className="text-xs text-slate-400 mb-1">Endorsements (15%)</div>
                  <div className="text-2xl font-bold text-purple-400">{Math.round(candidate.endorsementScore ?? 0)}%</div>
                  <div className="text-[11px] text-slate-500 mt-1">Verified Peer Reviews</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* About Section */}
          <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-mono text-sm font-bold">
                01
              </span>
              Summary & Bio
            </h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line text-base">
              {candidate.about}
            </p>
          </motion.div>

          {/* Section 2: Technical & Non-Technical Skills */}
          <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-10">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-mono text-sm font-bold">
                02
              </span>
              Technical Taxonomy & Tag Cloud
            </h2>
            
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Core Technical Skills</h3>
              <div className="flex flex-wrap gap-2.5">
                {candidate.skills.map((skill) => (
                  <span 
                    key={skill}
                    className="px-3.5 py-1.5 bg-indigo-50/80 border border-indigo-200/60 rounded-xl text-xs font-semibold text-indigo-900 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {candidate.nonTechSkills && candidate.nonTechSkills.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Non-Technical Skills & Practices</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.nonTechSkills.map((nts) => (
                    <span 
                      key={nts}
                      className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
                    >
                      {nts}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Section 3: Repeatable Experience History */}
          <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-10">
            <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-mono text-sm font-bold">
                03
              </span>
              Work Experience
            </h2>
            
            <div className="space-y-10">
              {candidate.experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-indigo-200 pl-6 relative">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{exp.role}</h3>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-indigo-600 mb-3">{exp.company}</h4>
                  
                  <ul className="space-y-2">
                    {exp.description.map((desc, i) => (
                      <li key={i} className="text-slate-600 text-sm leading-relaxed flex items-start">
                        <span className="mr-2 mt-1.5 w-1.5 h-1.5 shrink-0 rounded-full bg-slate-400" />
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>

                  {exp.link && (
                    <div className="mt-3">
                      <Link 
                        href={exp.link} 
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-medium hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Reference Project Link
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section 4: Portfolio Auto-Grouped by Detected Technology */}
          {candidate.portfolioLinks && candidate.portfolioLinks.length > 0 && (
            <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-10">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-mono text-sm font-bold">
                  04
                </span>
                Portfolio & Auto-Detected Tech Stack
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                {candidate.portfolioLinks.map((item) => (
                  <div key={item.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-indigo-300 transition-all shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.platform}</span>
                      <Link href={item.url} target="_blank" className="text-indigo-600 hover:text-indigo-800">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-2">{item.title || item.url}</h3>
                    
                    {item.detectedTechStack && item.detectedTechStack.length > 0 && (
                      <div className="mt-3">
                        <div className="text-[11px] font-semibold text-slate-400 mb-1.5">Detected Technologies:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.detectedTechStack.map((tech) => (
                            <span key={tech} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Section 5: Peer Endorsements */}
          {candidate.endorsements && candidate.endorsements.length > 0 && (
            <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-10">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-mono text-sm font-bold">
                  05
                </span>
                Peer Endorsements
              </h2>

              <div className="space-y-4">
                {candidate.endorsements.map((end) => (
                  <div key={end.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {end.endorser?.fullName ? end.endorser.fullName.substring(0, 2) : "PE"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-sm text-slate-900">
                          {end.endorser?.fullName || "Verified Peer"}
                          <span className="text-xs font-normal text-slate-500 ml-2">(@{end.endorser?.username})</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-xs font-bold">
                          {end.skillName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 italic">&ldquo;{end.comment}&rdquo;</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
