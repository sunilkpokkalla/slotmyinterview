"use client";

import { Shield, Fingerprint, Lock, CheckCircle, Database, GitMerge, Users, Calendar } from "lucide-react";

export function Features() {
  const steps = [
    {
      num: "01 · INDEX",
      title: "AST Code Parsing.",
      desc: "Our platform parses and maps the syntax tree of candidate repositories, verifying actual system complexity, algorithmic depth, and code structure."
    },
    {
      num: "02 · VALIDATE",
      title: "Isolated Sandbox Challenges.",
      desc: "Instead of leetcode puzzles, developers resolve real production issues—debugging memory leaks and tuning load bottlenecks in containerized environments."
    },
    {
      num: "03 · TRUST",
      title: "Keystroke Biometric Checks.",
      desc: "Continuous keyboard timing analysis and anti-plagiarism watermarking prevent copy-pasting, proxy candidates, and AI helpers during testing."
    }
  ];

  return (
    <section className="py-24 bg-ink-0 border-t border-hair">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-16">
          <span className="eyebrow">Category Architecture</span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-fg-0">
            Hiring built on <em>verified proof.</em>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-fg-2 max-w-2xl">
            Obsolete the resume theater. Validate capabilities and match developers based on deterministic performance metrics.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-12 gap-6 mb-16">
          
          {/* Left Block - Vetting Network */}
          <div className="md:col-span-5 bezel-outer">
            <div className="bezel-inner h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-fg-0 mb-3">Verifiable Skill Passports</h3>
                <p className="text-sm text-fg-2 leading-relaxed mb-8">
                  Living cryptographic records of a developer's production code depth, sandbox scores, and identity validation status.
                </p>

                {/* Vetting badges */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-hair text-center">
                    <Shield className="w-5 h-5 text-purple-400" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-fg-2">AST Audit</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-hair text-center">
                    <Fingerprint className="w-5 h-5 text-purple-400" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-fg-2">Biometrics</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-hair text-center">
                    <Lock className="w-5 h-5 text-purple-400" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-fg-2">GPG signed</span>
                  </div>
                </div>
              </div>

              {/* Integrations */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-fg-3 block mb-3">ATS WEBHOOK SYNC</span>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-fg-2">
                  <span>Greenhouse</span>
                  <span>Lever</span>
                  <span>Ashby</span>
                  <span>Workday API</span>
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
                  <h4 className="text-sm font-bold text-fg-0">Capability Matching</h4>
                </div>
                <p className="text-xs text-fg-2 leading-relaxed">
                  Query profiles based on verified code complexity and architectural patterns, not keyword matches.
                </p>
              </div>

              <div className="p-4 border border-hair rounded-lg bg-white/[0.01]">
                <div className="flex items-center gap-2 mb-2">
                  <GitMerge className="w-4 h-4 text-purple-400" />
                  <h4 className="text-sm font-bold text-fg-0">Interactive Sandboxes</h4>
                </div>
                <p className="text-xs text-fg-2 leading-relaxed">
                  Dockerized testing sandboxes simulating active production environments for absolute skill verification.
                </p>
              </div>

              <div className="p-4 border border-hair rounded-lg bg-white/[0.01]">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <h4 className="text-sm font-bold text-fg-0">Anti-Fraud Engine</h4>
                </div>
                <p className="text-xs text-fg-2 leading-relaxed">
                  Lock down testing integrity using isolated browser frames, plagiarism checks, and keystroke dynamic signatures.
                </p>
              </div>

              <div className="p-4 border border-hair rounded-lg bg-white/[0.01]">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <h4 className="text-sm font-bold text-fg-0">Direct Calendar Slots</h4>
                </div>
                <p className="text-xs text-fg-2 leading-relaxed">
                  Skip the emails. Pre-vetted candidates publish calendars so hiring managers can book interviews instantly.
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
