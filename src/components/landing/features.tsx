"use client";

import { Shield, Lock, Fingerprint } from "lucide-react";

export function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            The anti-noise hiring platform
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl">
            Don't end up with a bloated pipeline of unqualified candidates.<br />
            Our platform architecture helps you hire the top 1% of AI talent.
          </p>
        </div>

        {/* Massive Card */}
        <div className="w-full rounded-[2rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
          
          {/* Left Side - Light Purple */}
          <div className="bg-[#6B47ED] w-full lg:w-[40%] p-10 md:p-14 flex flex-col justify-between text-white">
            
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Verified AI Network</h3>
              <p className="text-white/80 text-lg leading-relaxed mb-12">
                Secure, vetting-native platform for business-critical engineering hiring
              </p>

              {/* Badges */}
              <div className="flex gap-6 mb-16">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-[72px] h-[72px] rounded-full border border-white/30 flex items-center justify-center">
                    <Shield className="w-8 h-8" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/90">Manual Vetting</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-[72px] h-[72px] rounded-full border border-white/30 flex items-center justify-center">
                    <Fingerprint className="w-8 h-8" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/90">Identity Sync</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-[72px] h-[72px] rounded-full border border-white/30 flex items-center justify-center">
                    <Lock className="w-8 h-8" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/90">SSO Ready</span>
                </div>
              </div>
            </div>

            {/* Integrations */}
            <div>
              <h4 className="text-xl font-semibold mb-6">Seamless Integrations</h4>
              <div className="flex flex-wrap gap-x-8 gap-y-6 opacity-90">
                <span className="text-2xl font-black tracking-tighter">Greenhouse</span>
                <span className="text-2xl font-black tracking-tighter">Lever</span>
                <span className="text-2xl font-black tracking-tighter">Ashby</span>
                <span className="text-2xl font-bold tracking-tighter">Workday</span>
              </div>
            </div>

          </div>

          {/* Right Side - Dark Purple */}
          <div className="bg-[#1C054E] w-full lg:w-[60%] flex flex-col border-l border-white/10">
            
            {/* Top Block */}
            <div className="p-10 md:p-14 border-b border-white/10">
              <h3 className="text-3xl font-bold text-white mb-3">Living Portfolios</h3>
              <p className="text-[#A78BFA] text-base leading-relaxed">
                AI-powered codifications of a candidate's GitHub, side projects, and open-source contributions. Unifying technical screening by showing you their actual capabilities instead of bullet points.
              </p>
            </div>

            {/* Grid Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 flex-1">
              
              <div className="p-10 border-b md:border-r border-white/10">
                <h4 className="text-xl font-bold text-white mb-2">Challenges</h4>
                <p className="text-[#8973B9] text-sm leading-relaxed font-medium">
                  Building blocks that allow hiring managers to assign real-world AI PRs and code reviews instead of leetcode puzzles.
                </p>
              </div>

              <div className="p-10 border-b border-white/10">
                <h4 className="text-xl font-bold text-white mb-2">Agents</h4>
                <p className="text-[#8973B9] text-sm leading-relaxed font-medium">
                  Automate targeted initial screening by combining our AI decision-making with proper hiring guardrails.
                </p>
              </div>

              <div className="p-10 border-b md:border-r border-white/10">
                <h4 className="text-xl font-bold text-white mb-2">Talent Pools</h4>
                <p className="text-[#8973B9] text-sm leading-relaxed font-medium">
                  A queryable data foundation that consolidates verified AI engineers, allowing you to instantly source frameworks.
                </p>
              </div>

              <div className="p-10 border-b border-white/10">
                <h4 className="text-xl font-bold text-white mb-2">Live Coding</h4>
                <p className="text-[#8973B9] text-sm leading-relaxed font-medium">
                  An interactive interface that allows interviewers to rapidly pair program and complete technical deep-dives.
                </p>
              </div>

              <div className="p-10 border-b md:border-b-0 md:border-r border-white/10">
                <h4 className="text-xl font-bold text-white mb-2">Skill Graph</h4>
                <p className="text-[#8973B9] text-sm leading-relaxed font-medium">
                  A centralized repository of a candidate's essential technical stack to inform faster hiring decisions.
                </p>
              </div>

              <div className="p-10 border-white/10">
                <h4 className="text-xl font-bold text-white mb-2">ATS Sync</h4>
                <p className="text-[#8973B9] text-sm leading-relaxed font-medium">
                  The definition of your hiring workflow mapped instantly to your existing applicant tracking system.
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
