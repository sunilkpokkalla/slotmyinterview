"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Code2, GitBranch, Terminal } from "lucide-react";

const candidates = [
  { name: "Sarah L.", role: "LLM Researcher", img: "https://i.pravatar.cc/150?u=sarah" },
  { name: "James T.", role: "ML Engineer", img: "https://i.pravatar.cc/150?u=james" },
  { name: "Elena R.", role: "AI Infrastructure", img: "https://i.pravatar.cc/150?u=elena" },
];

const companies = [
  { name: "Scale AI", color: "bg-slate-900" },
  { name: "Anthropic", color: "bg-[#d4bca0]" },
  { name: "Cohere", color: "bg-[#395641]" },
];

export function TalentPositioning() {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Badge variant="outline" className="mb-4 px-3 py-1 rounded-full border-[#6B47ED]/30 text-[#6B47ED] bg-[#6B47ED]/10">
            Talent Placement
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            Positioning elite AI talent into the world's best companies.
          </h2>
          <p className="text-slate-600 text-lg">
            We don't just provide a list of resumes. We actively match verified engineering capabilities with the exact technical needs of top-tier AI teams.
          </p>
        </div>

        {/* The Animation Stage */}
        <div className="relative h-[400px] md:h-[500px] w-full max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 flex items-center justify-between px-4 md:px-16 overflow-hidden">
          
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

          {/* Left Column: Candidates */}
          <div className="relative z-10 flex flex-col gap-6 w-full max-w-[220px]">
            {candidates.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 relative"
              >
                <Avatar className="h-10 w-10 border border-slate-200">
                  <AvatarImage src={c.img} />
                  <AvatarFallback>{c.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-slate-800">{c.name}</p>
                  <p className="text-xs text-slate-500 font-medium">{c.role}</p>
                </div>
                {/* Connection Dot */}
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#6B47ED] border-2 border-white shadow-sm z-20"></div>
              </motion.div>
            ))}
          </div>

          {/* Center: Animated Connecting Lines & "The Slot" */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* SVG Connecting Paths */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6B47ED" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#6B47ED" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#6B47ED" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              
              {/* Path 1 (Top to Top) */}
              <motion.path 
                d="M 220 150 C 400 150, 600 150, 780 150" 
                fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="6 6"
                className="hidden md:block"
              />
              {/* Path 2 (Middle to Middle) */}
              <motion.path 
                d="M 220 250 C 400 250, 600 250, 780 250" 
                fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="6 6"
                className="hidden md:block"
              />
              {/* Path 3 (Bottom to Bottom) */}
              <motion.path 
                d="M 220 350 C 400 350, 600 350, 780 350" 
                fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="6 6"
                className="hidden md:block"
              />

              {/* Animated Traveling Dots along the paths */}
              {[150, 250, 350].map((y, i) => (
                <motion.circle
                  key={i}
                  cx="0"
                  cy="0"
                  r="4"
                  fill="#8A4CFC"
                  className="hidden md:block"
                  style={{ filter: "drop-shadow(0 0 4px #8A4CFC)" }}
                  animate={{
                    cx: [220, 780],
                    cy: [y, y],
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.8,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </svg>

            {/* Central Badge / "The Match" */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="relative z-30 bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-200 shadow-lg text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <Code2 className="w-5 h-5 text-[#6B47ED]" />
                <GitBranch className="w-5 h-5 text-slate-400" />
                <Terminal className="w-5 h-5 text-[#6B47ED]" />
              </div>
              <p className="text-sm font-bold text-slate-800">Skill Validation Engine</p>
              <p className="text-xs text-slate-500">100% Signal. 0% Noise.</p>
            </motion.div>
          </div>

          {/* Right Column: Companies */}
          <div className="relative z-10 flex flex-col gap-12 w-full max-w-[220px]">
            {companies.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 + 0.3 }}
                className="relative"
              >
                {/* Connection Dot */}
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-900 border-2 border-white shadow-sm z-20"></div>
                
                <div className={`w-full py-4 px-6 rounded-xl shadow-md flex flex-col items-center justify-center gap-1 ${c.color} text-white hover:scale-105 transition-transform cursor-pointer`}>
                  <p className="font-bold tracking-wide">{c.name}</p>
                  <p className="text-[10px] text-white/70 uppercase tracking-widest font-semibold">Hiring</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
