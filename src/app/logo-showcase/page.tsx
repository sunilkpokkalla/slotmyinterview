"use client";

import { Logo } from "@/components/ui/logo";
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Code, Zap } from "lucide-react";
import Link from "next/link";

export default function LogoShowcasePage() {
  return (
    <div className="min-h-screen bg-ink-0 text-white py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Eyebrow */}
        <span className="eyebrow">Minimalist Brand Identity</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-4 text-fg-0">
          The New SlotMyInterview Emblem
        </h1>
        <p className="mt-4 text-lg text-fg-2 max-w-2xl mx-auto leading-relaxed">
          An ultra-clean 2-line geometric stroke mark (Linear & Vercel tier). Interlocking a precision slanted slot trajectory with a verified vector chevron.
        </p>

        {/* Large Logo Preview Card */}
        <div className="bezel-outer mt-12 p-12 bg-ink-1/90 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center justify-center">
          <div className="p-12 rounded-2xl bg-black/60 border border-white/10 shadow-inner flex items-center justify-center mb-8">
            <Logo size="xl" showTagline={true} />
          </div>

          <div className="grid sm:grid-cols-3 gap-4 w-full max-w-xl text-left font-mono text-xs text-fg-2">
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>Hairline Vector Geometry</span>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span>Dual Stroke Intersection</span>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Resolution-Independent SVG</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/" className="btn btn-primary px-6 flex items-center gap-2">
            <span>Return to Home</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
