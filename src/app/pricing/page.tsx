"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <div className="py-24 bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-12">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-slate-500">
            Always free for engineers. Flexible plans for scaling engineering teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Engineers (Free) */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Engineers</h3>
            <p className="text-slate-500 text-sm mb-6 h-10">Showcase your skills and get hired.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-900">$0</span>
              <span className="text-slate-500"> / forever</span>
            </div>
            <Button variant="outline" className="w-full h-12 font-bold bg-white mb-8 border-slate-300">
              Create Profile
            </Button>
            <div className="space-y-4">
              {["Living GitHub Portfolio", "Public Profile Link", "Apply to Verified Jobs", "Receive Direct Interview Requests"].map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Teams */}
          <div className="bg-[#1C054E] rounded-3xl p-8 border border-[#2E0E6C] shadow-2xl relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#6B47ED] text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Teams</h3>
            <p className="text-[#A78BFA] text-sm mb-6 h-10">For startups and growth companies hiring elite talent.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-white">$499</span>
              <span className="text-[#A78BFA]"> / month</span>
            </div>
            <Button className="w-full h-12 font-bold bg-[#6B47ED] hover:bg-[#5839C7] text-white mb-8 border-0">
              Start 14-Day Trial
            </Button>
            <div className="space-y-4">
              {["Unlimited Candidate Searches", "Assign Real-World Challenges", "Direct Interview Booking", "Live Coding Environments", "ATS Integrations (Greenhouse, Lever)", "Up to 5 Hiring Managers"].map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#26C766] flex-shrink-0" />
                  <span className="text-sm font-medium text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enterprise */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Enterprise</h3>
            <p className="text-slate-500 text-sm mb-6 h-10">Custom workflows for large-scale engineering orgs.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-900">Custom</span>
            </div>
            <Button variant="outline" className="w-full h-12 font-bold bg-white mb-8 border-slate-300">
              Contact Sales
            </Button>
            <div className="space-y-4">
              {["Everything in Teams", "Unlimited Hiring Managers", "Custom ATS Sync Mapping", "SSO & Advanced Security", "Dedicated Account Manager", "White-labeled Challenges"].map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-slate-900 flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
