"use client";

import { Shield, Fingerprint, Lock, CheckCircle, Database, GitMerge, Users, Calendar } from "lucide-react";

export function Features() {
  const steps = [
    {
      num: "01 · SYNC",
      title: "Index candidate code histories.",
      desc: "Connect candidate GitHub profiles with one click. Our parser catalogs language depth, framework experience, and commit patterns automatically."
    },
    {
      num: "02 · VET",
      title: "Confirm architectural capabilities.",
      desc: "Assign sandbox PR reviews and code challenges. Move past simple multiple choice questions to see how they write and structure real production modules."
    },
    {
      num: "03 · BOOK",
      title: "Fast-track directly to your loop.",
      desc: "Candidates publish calendar availability instantly. Skip the back-and-forth email coordinate loops and land top talent on your calendar."
    }
  ];

  return (
    <section className="py-24 bg-ink-0 border-t border-hair">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-16">
          <span className="eyebrow">Platform Capabilities</span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-fg-0">
            The anti-noise <em>hiring pipeline.</em>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-fg-2 max-w-xl">
            Tired of resume fluff? We replace static bullet points with raw, verified technical capability scores.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-12 gap-6 mb-16">
          
          {/* Left Block - Vetting Network */}
          <div className="md:col-span-5 bezel-outer">
            <div className="bezel-inner h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-fg-0 mb-3">Verified Talent Network</h3>
                <p className="text-sm text-fg-2 leading-relaxed mb-8">
                  Security-first vetting architecture designed for high-conviction engineering organizations.
                </p>

                {/* Vetting badges */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-hair text-center">
                    <Shield className="w-5 h-5 text-purple-400" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-fg-2">Manual Audit</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-hair text-center">
                    <Fingerprint className="w-5 h-5 text-purple-400" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-fg-2">Identity Sync</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-hair text-center">
                    <Lock className="w-5 h-5 text-purple-400" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-fg-2">SSO Enabled</span>
                  </div>
                </div>
              </div>

              {/* Integrations */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-fg-3 block mb-3">ATS CONNECTORS</span>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-fg-2">
                  <span>Greenhouse</span>
                  <span>Lever</span>
                  <span>Ashby</span>
                  <span>Workday</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Block - Features list */}
          <div className="md:col-span-7 bezel-outer">
            <div className="bezel-inner h-full grid sm:grid-cols-2 gap-6">
              
              <div className="p-4 border border-hair rounded-lg bg-white/[0.01]">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-purple-400" />
                  <h4 className="text-sm font-bold text-fg-0">Living Portfolios</h4>
                </div>
                <p className="text-xs text-fg-2 leading-relaxed">
                  Real-time parsed snapshots of a developer's real repositories, commits, and package releases.
                </p>
              </div>

              <div className="p-4 border border-hair rounded-lg bg-white/[0.01]">
                <div className="flex items-center gap-2 mb-2">
                  <GitMerge className="w-4 h-4 text-purple-400" />
                  <h4 className="text-sm font-bold text-fg-0">Code Challenges</h4>
                </div>
                <p className="text-xs text-fg-2 leading-relaxed">
                  Assign sandbox git branches and PR reviews. Evaluate exact spatial code depth rather than quiz answers.
                </p>
              </div>

              <div className="p-4 border border-hair rounded-lg bg-white/[0.01]">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <h4 className="text-sm font-bold text-fg-0">Talent Pools</h4>
                </div>
                <p className="text-xs text-fg-2 leading-relaxed">
                  Query profiles by code-verified framework expertise, algorithmic scores, and experience tiers.
                </p>
              </div>

              <div className="p-4 border border-hair rounded-lg bg-white/[0.01]">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <h4 className="text-sm font-bold text-fg-0">Direct Booking</h4>
                </div>
                <p className="text-xs text-fg-2 leading-relaxed">
                  Connect direct hiring manager calendars. Candidates slot calls straight into your loop.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Step Walkthrough */}
        <div className="grid md:grid-cols-3 gap-8 pt-12 border-t border-hair">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <span className="font-mono text-xs text-purple-400 font-semibold">{step.num}</span>
              <h3 className="text-lg font-bold text-fg-0">{step.title}</h3>
              <p className="text-sm text-fg-2 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
