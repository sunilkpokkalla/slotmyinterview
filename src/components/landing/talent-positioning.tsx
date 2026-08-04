"use client";

import { motion } from "framer-motion";
import { Code2, GitBranch, Terminal } from "lucide-react";

const candidates = [
  { name: "Sarah L.", role: "LLM Researcher", initials: "SL" },
  { name: "James T.", role: "ML Infrastructure", initials: "JT" },
  { name: "Elena R.", role: "AI Security Engineer", initials: "ER" },
];

const companies = [
  { name: "Scale AI", color: "bg-slate-900 border-hair" },
  { name: "Anthropic", color: "bg-ink-2 border-purple-500/30" },
  { name: "Cohere", color: "bg-ink-2 border-emerald-500/30" },
];

export function TalentPositioning() {
  return (
    <section className="py-24 bg-ink-0 border-t border-hair">
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="eyebrow">Match Liquidity</span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-fg-0">
            Routing verified talent <em>directly to teams.</em>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-fg-2">
            No recruitment agents, cold messages, or keyword filters. We match sandbox-proven capabilities with live production needs at high-growth startups.
          </p>
        </div>

        {/* The Animation Stage */}
        <div className="relative h-[400px] md:h-[500px] w-full max-w-5xl mx-auto bg-ink-1 rounded-2xl border border-hair-2 shadow-2xl flex items-center justify-between px-4 md:px-16 overflow-hidden">
          
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

          {/* Left Column: Candidates */}
          <div className="relative z-10 flex flex-col gap-6 w-full max-w-[220px]">
            {candidates.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-ink-2 p-3 rounded-xl border border-hair shadow-sm flex items-center gap-3 relative"
              >
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {c.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-fg-0">{c.name}</p>
                  <p className="text-xs text-fg-3 font-mono">{c.role}</p>
                </div>
                {/* Connection Dot */}
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-purple-500 border-2 border-ink-1 shadow-sm z-20"></div>
              </motion.div>
            ))}
          </div>

          {/* Center: Animated Connecting Lines & "The Slot" */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* SVG Connecting Paths */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8A4CFC" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="#8A4CFC" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#8A4CFC" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              
              {/* Path 1 (Top to Top) */}
              <motion.path 
                d="M 220 150 C 400 150, 600 150, 780 150" 
                fill="none" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="6 6"
                className="hidden md:block"
              />
              {/* Path 2 (Middle to Middle) */}
              <motion.path 
                d="M 220 250 C 400 250, 600 250, 780 250" 
                fill="none" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="6 6"
                className="hidden md:block"
              />
              {/* Path 3 (Bottom to Bottom) */}
              <motion.path 
                d="M 220 350 C 400 350, 600 350, 780 350" 
                fill="none" stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="6 6"
                className="hidden md:block"
              />

              {/* Animated Traveling Dots along the paths */}
              {[150, 250, 350].map((y, i) => (
                <motion.circle
                  key={i}
                  cx="0"
                  cy="0"
                  r="3.5"
                  fill="#A78BFA"
                  className="hidden md:block"
                  style={{ filter: "drop-shadow(0 0 3px #A78BFA)" }}
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
              className="relative z-30 bg-ink-2/95 backdrop-blur-md px-6 py-4 rounded-xl border border-hair-2 shadow-2xl text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <Code2 className="w-5 h-5 text-purple-400" />
                <GitBranch className="w-5 h-5 text-fg-3" />
                <Terminal className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-sm font-bold text-fg-0 font-sans">Verification Engine</p>
              <p className="text-xs text-fg-2 font-mono mt-1">Proof Ledger Matched</p>
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
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-purple-500 border-2 border-ink-1 shadow-sm z-20"></div>
                
                <div className={`w-full py-4 px-6 rounded-xl border shadow-md flex flex-col items-center justify-center gap-1 ${c.color} text-fg-0 hover:scale-105 transition-transform cursor-pointer`}>
                  <p className="font-bold tracking-wide text-sm">{c.name}</p>
                  <p className="text-[9px] text-purple-400 uppercase tracking-widest font-mono font-semibold">Matched Slot</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
