"use client";

import { motion } from "framer-motion";
import { CheckCircle2, GitBranch, Cpu, Calendar, ShieldCheck } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Create Living Profile",
      desc: "Claim your vanity URL (/u/username) and sync your identity, experience, and custom technical skill tags.",
      icon: ShieldCheck,
      color: "text-purple-400",
      border: "border-purple-500/20",
      bg: "bg-purple-500/10",
    },
    {
      step: "02",
      title: "Index GitHub & 60s Video",
      desc: "Our AST engine analyzes code complexity, dependency health, and commit authorship. Upload an optional 60s pitch.",
      icon: GitBranch,
      color: "text-indigo-400",
      border: "border-indigo-500/20",
      bg: "bg-indigo-500/10",
    },
    {
      step: "03",
      title: "Deterministic Talent Score",
      desc: "Receive an objective talent rating out of 100 based on commit density, assessments, completeness, and peer endorsements.",
      icon: Cpu,
      color: "text-emerald-400",
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/10",
    },
    {
      step: "04",
      title: "Direct Cal.com Slots",
      desc: "Recruiters and hiring managers book interviews directly onto your calendar with zero cold emails or recruiter spam.",
      icon: Calendar,
      color: "text-amber-400",
      border: "border-amber-500/20",
      bg: "bg-amber-500/10",
    },
  ];

  const companies = [
    "Scale AI", "Anthropic", "Stripe", "Vercel", "Cohere", "OpenAI Partner Network"
  ];

  return (
    <section className="py-24 bg-ink-0 border-t border-hair relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="eyebrow">Zero Friction Workflow</span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-fg-0">
            How SlotMyInterview <em className="text-purple-400 font-serif">works.</em>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-fg-2">
            Eliminate resume padding and recruiter outreach. A single unified pipeline from code proof to booked interview.
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bezel-outer h-full"
              >
                <div className="bezel-inner flex flex-col justify-between h-full p-6 bg-ink-1/80 rounded-2xl border border-hair">
                  <div>
                    {/* Step badge + Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-mono font-bold text-fg-3 px-2 py-0.5 rounded bg-white/[0.03] border border-hair">
                        STEP {s.step}
                      </span>
                      <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.border} border flex items-center justify-center ${s.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-fg-0 mb-2">
                      {s.title}
                    </h3>
                    <p className="text-xs text-fg-2 leading-relaxed font-sans">
                      {s.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-hair-2 flex items-center gap-1.5 text-[11px] font-mono text-fg-3">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Automated Verification</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Social Proof Companies Strip */}
        <div className="p-8 rounded-2xl bg-ink-1/60 border border-hair text-center">
          <p className="text-xs font-mono font-bold text-fg-3 uppercase tracking-widest mb-6">
            Engineers Vetted & Sourced Across Frontier Teams
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-14 text-fg-2 font-bold text-sm sm:text-base tracking-tight">
            {companies.map((c) => (
              <span key={c} className="hover:text-white transition-colors cursor-default">
                {c}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
