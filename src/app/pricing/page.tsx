"use client";

import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="py-24 bg-ink-0 min-h-screen border-t border-hair">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="eyebrow">Flat-Rate Scaling</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-fg-0 tracking-tight mb-4 mt-4">
            Verifiable talent, <em>none of the recruiter markup.</em>
          </h1>
          <p className="text-lg text-fg-2">
            Always free for engineers. Transparent plans built around verified capability matching and direct calendar bookings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Engineers (Free) */}
          <div className="bg-ink-1 rounded-2xl p-8 border border-hair flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-fg-0 mb-2">Engineers</h3>
              <p className="text-fg-2 text-sm mb-6 h-10">Verify your real-world capabilities and unlock interview slots.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-fg-0">$0</span>
                <span className="text-fg-3"> / forever</span>
              </div>
              <button className="w-full btn btn-ghost mb-8">
                Create Skill Passport
              </button>
              <div className="space-y-4">
                {["Living Skill Passport", "AST Repository Analysis", "Continuous Biometric Profiling", "Receive Direct Calendar Bookings"].map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-fg-2">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Teams */}
          <div className="bg-ink-2 rounded-2xl p-8 border border-purple-500/20 shadow-2xl relative flex flex-col justify-between">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase font-mono">
              Most Popular
            </div>
            <div>
              <h3 className="text-xl font-bold text-fg-0 mb-2">Teams</h3>
              <p className="text-fg-2 text-sm mb-6 h-10">For startups and growth companies hiring verified engineering talent.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-fg-0">$499</span>
                <span className="text-fg-3"> / month</span>
              </div>
              <button className="w-full btn btn-primary mb-8">
                Start 14-Day Trial
              </button>
              <div className="space-y-4">
                {["Unlimited Candidate Searches", "Assign Sandbox Vetting Challenges", "Zero-Stage Direct Booking", "Plagiarism & Keystroke Dynamics Audits", "Greenhouse & Lever ATS Sync", "Up to 5 Team Members"].map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-fg-2">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enterprise */}
          <div className="bg-ink-1 rounded-2xl p-8 border border-hair flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-fg-0 mb-2">Enterprise</h3>
              <p className="text-fg-2 text-sm mb-6 h-10">Custom vetting sandboxes and compliance solutions for scale.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-fg-0">Custom</span>
              </div>
              <button className="w-full btn btn-ghost mb-8">
                Contact Sales
              </button>
              <div className="space-y-4">
                {["Everything in Teams", "Unlimited Team Members", "Internal Talent Audits", "Custom ATS Sync Mapping", "Regulatory Anti-Bias Compliance", "White-labeled Sandboxes"].map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-fg-2">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
