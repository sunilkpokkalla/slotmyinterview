import { Button } from "@/components/ui/button";
import { CheckCircle2, GitCommit, GitPullRequest, Code2 } from "lucide-react";

export default function LivingPortfoliosPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FC] pt-32 pb-24">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mb-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7140DB]/10 text-[#7140DB] font-semibold text-sm mb-6">
            <Code2 className="w-4 h-4" />
            Core Feature
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#0F1115] tracking-tight mb-6 leading-tight">
            The resume is dead.<br />
            Meet the <span className="text-[#7140DB]">Living Portfolio.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10">
            A real-time, constantly updating reflection of a candidate's actual engineering capabilities, automatically synced with their daily commits and merged pull requests.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-[#0A0C10] hover:bg-[#1a1f29] text-white rounded-xl px-8 h-14 text-lg font-bold">
              View an Example Profile
            </Button>
            <Button variant="outline" className="border-slate-300 rounded-xl px-8 h-14 text-lg font-bold bg-white hover:bg-slate-50">
              Start Sourcing
            </Button>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)]">
            <div className="w-12 h-12 bg-[#7140DB]/10 rounded-2xl flex items-center justify-center mb-6">
              <GitCommit className="w-6 h-6 text-[#7140DB]" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Real-Time Sync</h3>
            <p className="text-slate-500 leading-relaxed">
              Every time a candidate commits code, their Living Portfolio updates. You never look at stale data. You see exactly what they are building today.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)]">
            <div className="w-12 h-12 bg-[#7140DB]/10 rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle2 className="w-6 h-6 text-[#7140DB]" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Verified Skills</h3>
            <p className="text-slate-500 leading-relaxed">
              No more keyword stuffing. If a candidate claims they know React, our engine verifies their actual React contributions across repositories.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)]">
            <div className="w-12 h-12 bg-[#7140DB]/10 rounded-2xl flex items-center justify-center mb-6">
              <GitPullRequest className="w-6 h-6 text-[#7140DB]" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Code Quality Score</h3>
            <p className="text-slate-500 leading-relaxed">
              We analyze pull requests and code reviews to provide an automated signal on best practices, testing, and documentation habits.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
