"use client";

import { motion } from "framer-motion";
import { 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  GitBranch, 
  Link as LinkIcon, 
  Mail,
  Download,
  Code
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Dummy data structure reflecting a realistic candidate profile
export interface CandidateData {
  name: string;
  headline: string;
  location: string;
  about: string;
  avatarUrl: string;
  github: string;
  linkedin: string;
  email: string;
  experience: {
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string[];
    logoUrl?: string;
  }[];
  education: {
    id: string;
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
  }[];
  skills: string[];
}

interface ProfileLayoutProps {
  candidate: CandidateData;
}

export function ProfileLayout({ candidate }: ProfileLayoutProps) {
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

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="relative w-32 h-32 shrink-0">
                <Image
                  src={candidate.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(candidate.name) + "&size=256&background=0D8ABC&color=fff"}
                  alt={candidate.name}
                  fill
                  sizes="128px"
                  className="rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                    {candidate.name}
                  </h1>
                  <p className="text-lg text-slate-600 mt-2 font-medium">
                    {candidate.headline}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {candidate.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    {candidate.email}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link 
                    href={candidate.github}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    <GitBranch className="w-4 h-4" />
                    GitHub
                  </Link>
                  <Link 
                    href={candidate.linkedin}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    LinkedIn
                  </Link>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors ml-auto">
                    <Download className="w-4 h-4" />
                    Resume
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* About Section */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Code className="w-4 h-4" />
              </span>
              About
            </h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {candidate.about}
            </p>
          </motion.div>

          {/* Experience Section */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
            <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </span>
              Experience
            </h2>
            
            <div className="space-y-12">
              {candidate.experience.map((exp, idx) => (
                <div key={exp.id} className="relative pl-8 md:pl-0">
                  {/* Desktop Timeline Line */}
                  <div className="hidden md:block absolute left-[120px] top-2 bottom-[-48px] w-px bg-slate-200 last:hidden" />
                  
                  {/* Mobile Timeline Line */}
                  <div className="md:hidden absolute left-2 top-2 bottom-[-48px] w-px bg-slate-200 last:hidden" />

                  <div className="flex flex-col md:flex-row gap-4 md:gap-12">
                    <div className="md:w-[100px] shrink-0 text-sm font-semibold text-slate-400 md:text-right pt-1 relative">
                      {/* Timeline Dot */}
                      <div className="absolute left-[-29px] md:left-[116px] top-[10px] w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                      {exp.startDate} <br className="hidden md:block" />
                      <span className="md:hidden"> - </span>
                      <span className="text-slate-300 md:block">{exp.endDate}</span>
                    </div>
                    
                    <div className="flex-1 pb-4">
                      <h3 className="text-lg font-bold text-slate-900">{exp.role}</h3>
                      <h4 className="text-md font-medium text-blue-600 mb-4">{exp.company}</h4>
                      
                      <ul className="space-y-3">
                        {exp.description.map((desc, i) => (
                          <li key={i} className="text-slate-600 leading-relaxed flex items-start">
                            <span className="mr-3 mt-2 w-1 h-1 shrink-0 rounded-full bg-slate-400 block" />
                            <span>{desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Education & Skills Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Education */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
              <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </span>
                Education
              </h2>
              
              <div className="space-y-8">
                {candidate.education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="text-lg font-bold text-slate-900">{edu.school}</h3>
                    <p className="text-slate-600 font-medium mt-1">{edu.degree}</p>
                    <p className="text-sm text-slate-400 mt-2">
                      {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
              <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Code className="w-4 h-4" />
                </span>
                Skills
              </h2>
              
              <div className="flex flex-wrap gap-2.5">
                {candidate.skills.map((skill) => (
                  <span 
                    key={skill}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
