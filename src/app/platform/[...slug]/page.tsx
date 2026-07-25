"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function PlatformFeaturePage() {
  const pathname = usePathname();
  
  // Create a readable title from the URL slug
  const title = pathname
    .split('/')
    .pop()
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || 'Feature';

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col">
      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-24 md:py-32 flex flex-col items-center justify-center text-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm mb-8">
          <Sparkles className="w-4 h-4" />
          <span>Platform Feature</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tighter mb-6">
          {title}
        </h1>
        
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12">
          This is a placeholder page for the <span className="font-bold text-slate-700">{title}</span> module. SlotMyInterview is currently in active development, and this specific feature deep-dive is coming soon.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
          <Link href="/signup">
            <Button size="lg" className="bg-[#6B47ED] hover:bg-[#5839C7] text-white font-bold h-14 px-8 text-base rounded-xl w-full sm:w-auto">
              Get Early Access
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline" size="lg" className="h-14 px-8 text-base font-bold rounded-xl border-slate-300 w-full sm:w-auto">
              View Employer Dashboard <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

      </div>

      {/* Decorative Bottom */}
      <div className="w-full h-32 bg-white border-t border-slate-200 mt-auto flex items-center justify-center">
        <p className="text-slate-400 font-medium">SlotMyInterview Architecture</p>
      </div>
    </div>
  );
}
