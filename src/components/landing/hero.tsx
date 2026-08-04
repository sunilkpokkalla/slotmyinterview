"use client";

import { motion } from "framer-motion";
import { ArrowRight, Terminal as TerminalIcon, ShieldAlert, CheckCircle, FileCode } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-0 pt-24 pb-20">
      
      {/* Background ambient mesh orbs */}
      <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <div className="wrap relative z-10 flex flex-col items-center text-center">
        
        {/* Eyebrow */}
        <span className="eyebrow">Capability-Based Hiring</span>
        
        {/* Headline */}
        <h1 className="mt-6 text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] text-fg-0">
          Hire verified AI talent. <br />
          <em>Skip the resume vetting.</em>
        </h1>
        
        {/* Description */}
        <p className="mt-6 text-lg sm:text-xl text-fg-2 max-w-2xl text-pretty leading-relaxed">
          The first verified portfolio and interview marketplace. Watch elite AI engineers move seamlessly from verified GitHub histories straight into your interview calendar.
        </p>

        {/* Input form */}
        <div className="mt-10 w-full max-w-xl">
          <form className="flex flex-col sm:flex-row items-stretch gap-2 rounded-xl p-1.5 bg-ink-2/80 border border-hair shadow-xl" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              required 
              placeholder="What's your work email?" 
              className="flex-1 px-4 py-3 rounded-lg text-sm bg-transparent outline-none border-0 text-fg-0 font-mono placeholder:text-fg-3"
            />
            <button type="submit" className="btn btn-accent whitespace-nowrap text-sm px-6 py-3">
              Get early access
            </button>
          </form>
          <p className="mt-3 text-xs text-fg-3 font-mono">
            Join 12,000+ engineers and hiring managers already using SlotMyInterview.
          </p>
        </div>

        {/* Interactive Dashboard / Console Double-Bezel Mockup */}
        <div className="mt-16 w-full max-w-[1100px] grid md:grid-cols-12 gap-6 text-left">
          
          {/* Left: Terminal Vetting Console (7 cols) */}
          <div className="md:col-span-7 bezel-outer">
            <div className="bezel-inner h-full flex flex-col font-mono text-xs text-fg-2 min-h-[300px]">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-hair-2 mb-4">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-fg-0">vetting-agent-daemon</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
              </div>

              {/* Console logs */}
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex gap-2">
                  <span className="text-purple-400">$</span>
                  <span className="text-fg-0">slotmyinterview verify-identity --user @kyle-ml-dev</span>
                </div>
                <div className="text-fg-3">✓ Checked OAuth identity against active GPG commit signing keys</div>
                <div className="flex gap-2 mt-1">
                  <span className="text-purple-400">$</span>
                  <span className="text-fg-0">slotmyinterview analyze-repos --min-stars 50</span>
                </div>
                <div className="text-fg-3">↳ Found 3 candidate repositories (Python, Rust, TypeScript)</div>
                <div className="text-fg-3">↳ Repository `llm-agent-router` shows high algorithmic depth</div>
                <div className="text-emerald-400 font-semibold flex items-center gap-1.5 mt-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>VETTING PASSED: Verified code profile ready at slotmyinterview.com/u/kyle</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-hair-2 flex items-center justify-between">
                  <span className="text-fg-3">Automatic booking ready</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px]">Active Integration</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Candidate Profile (5 cols) */}
          <div className="md:col-span-5 bezel-outer">
            <div className="bezel-inner h-full flex flex-col justify-between">
              
              <div>
                {/* Header Profile */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    K
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-fg-0">Kyle M.</h4>
                    <p className="text-xs text-fg-3 font-mono">Senior AI & Infrastructure Engineer</p>
                  </div>
                </div>

                {/* Score list */}
                <div className="flex flex-col gap-3">
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-hair flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-fg-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                      <span className="text-sm font-medium text-fg-1">GitHub Score</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">98 / 100</span>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.02] border border-hair flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-fg-2" />
                      <span className="text-sm font-medium text-fg-1">Verified PRs</span>
                    </div>
                    <span className="font-mono text-fg-0">12 Merged</span>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.02] border border-hair flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-fg-2" />
                      <span className="text-sm font-medium text-fg-1">Identity Check</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-semibold">100% Passed</span>
                  </div>
                </div>
              </div>

              {/* Booking CTA button */}
              <div className="mt-6">
                <button className="w-full btn btn-primary flex items-center justify-center gap-2">
                  <span>Slot an Interview</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
