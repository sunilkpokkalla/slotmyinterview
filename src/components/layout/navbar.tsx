"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { 
  Menu, X, ChevronDown, HelpCircle, Layers, Star, 
  GitBranch, Settings2, Bot, Table2, PlayCircle, Megaphone,
  ShieldCheck, LayoutDashboard, CodeSquare, Terminal, Network, Fingerprint
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Close menu when mouse leaves the nav area
  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-slate-200" onMouseLeave={handleMouseLeave}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 z-50 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7140DB] to-[#351478] flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.4" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-[#7140DB] transition-colors">
              SlotMyInterview
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center h-full gap-1 ml-8 flex-1">
            <div 
              className="h-full flex items-center relative group"
              onMouseEnter={() => setActiveMenu("platform")}
            >
              <button className={`flex items-center gap-1.5 px-4 text-sm font-semibold h-full transition-colors ${activeMenu === "platform" ? "text-slate-900" : "text-slate-600 hover:text-slate-900"}`}>
                Platform
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeMenu === "platform" ? "rotate-180" : ""}`} />
              </button>
              {/* Active indicator line */}
              {activeMenu === "platform" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900" />
              )}
            </div>

            <Link href="/search" className="px-4 text-sm font-semibold text-slate-600 hover:text-slate-900 h-full flex items-center" onMouseEnter={() => setActiveMenu(null)}>
              Candidates
            </Link>

            <Link href="/platform/resources" className="px-4 text-sm font-semibold text-slate-600 hover:text-slate-900 h-full flex items-center" onMouseEnter={() => setActiveMenu(null)}>
              Resources
            </Link>
            
            <Link href="/pricing" className="px-4 text-sm font-semibold text-slate-600 hover:text-slate-900 h-full flex items-center" onMouseEnter={() => setActiveMenu(null)}>
              Pricing
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-slate-900">
              Login
            </Link>
            <Link href="/signup" className={buttonVariants({ className: "bg-[#6037C4] hover:bg-[#4E2A9D] text-white rounded-md px-6 font-semibold" })}>
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden z-50 text-slate-900 p-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      <AnimatePresence>
        {activeMenu === "platform" && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg overflow-hidden"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-10">
              <div className="grid grid-cols-4 gap-8">
                
                {/* Column 1 */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-4 pb-2 border-b border-slate-100">Overview</h3>
                  <div className="flex flex-col gap-1">
                    <Link href="/platform/how-it-works" className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-md group" onClick={() => setActiveMenu(null)}>
                      <div className="p-1.5 border border-slate-200 rounded text-slate-500 bg-white group-hover:border-slate-300">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">How it Works</span>
                    </Link>
                    <Link href="/platform/security" className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-md group" onClick={() => setActiveMenu(null)}>
                      <div className="p-1.5 border border-slate-200 rounded text-slate-500 bg-white group-hover:border-slate-300">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Security & Vetting</span>
                    </Link>
                    <Link href="/search" className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-md group" onClick={() => setActiveMenu(null)}>
                      <div className="p-1.5 border border-slate-200 rounded text-slate-500 bg-white group-hover:border-slate-300">
                        <LayoutDashboard className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Employer Dashboard</span>
                    </Link>
                  </div>
                </div>

                {/* Column 2 */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-4 pb-2 border-b border-slate-100">Core Features</h3>
                  <div className="flex flex-col gap-1">
                    <Link href="/platform/portfolios" className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-md group" onClick={() => setActiveMenu(null)}>
                      <div className="p-1.5 border border-slate-200 rounded text-slate-500 bg-white group-hover:border-slate-300">
                        <CodeSquare className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Living Portfolios</span>
                    </Link>
                    <Link href="/platform/challenges" className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-md group" onClick={() => setActiveMenu(null)}>
                      <div className="p-1.5 border border-slate-200 rounded text-slate-500 bg-white group-hover:border-slate-300">
                        <GitBranch className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Assign Challenges</span>
                    </Link>
                    <Link href="/platform/live-coding" className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-md group" onClick={() => setActiveMenu(null)}>
                      <div className="p-1.5 border border-slate-200 rounded text-slate-500 bg-white group-hover:border-slate-300">
                        <Terminal className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Live Coding</span>
                    </Link>
                  </div>
                </div>

                {/* Column 3 */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-4 pb-2 border-b border-slate-100">Integrations</h3>
                  <div className="flex flex-col gap-1">
                    <Link href="/platform/github-sync" className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-md group" onClick={() => setActiveMenu(null)}>
                      <div className="p-1.5 border border-slate-200 rounded text-slate-500 bg-white group-hover:border-slate-300">
                        <GitBranch className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">GitHub Sync</span>
                    </Link>
                    <Link href="/platform/ats-sync" className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-md group" onClick={() => setActiveMenu(null)}>
                      <div className="p-1.5 border border-slate-200 rounded text-slate-500 bg-white group-hover:border-slate-300">
                        <Network className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">ATS Connectors</span>
                    </Link>
                    <Link href="/platform/identity" className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-md group" onClick={() => setActiveMenu(null)}>
                      <div className="p-1.5 border border-slate-200 rounded text-slate-500 bg-white group-hover:border-slate-300">
                        <Fingerprint className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Identity Verification</span>
                    </Link>
                  </div>
                </div>

                {/* Column 4 - Resources */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-4 pb-2 border-b border-slate-100">Technical Resources</h3>
                  <div className="flex flex-col gap-4">
                    <Link href="/platform/resources/why-resumes-fail" className="group block pb-4 border-b border-slate-100 last:border-0" onClick={() => setActiveMenu(null)}>
                      <h4 className="text-sm font-semibold text-slate-800 group-hover:text-[#6037C4] transition-colors leading-tight mb-2">
                        Why Traditional Resumes Fail AI Engineering Hiring
                      </h4>
                    </Link>
                    <Link href="/platform/resources/github-analysis" className="group block pb-4 border-b border-slate-100 last:border-0" onClick={() => setActiveMenu(null)}>
                      <h4 className="text-sm font-semibold text-slate-800 group-hover:text-[#6037C4] transition-colors leading-tight mb-2">
                        Introducing Automated GitHub Portfolio Analysis
                      </h4>
                    </Link>
                    <Link href="/platform/resources/vetting-guide" className="group block" onClick={() => setActiveMenu(null)}>
                      <h4 className="text-sm font-semibold text-slate-800 group-hover:text-[#6037C4] transition-colors leading-tight mb-2">
                        The Comprehensive Guide to Vetting Machine Learning Talent
                      </h4>
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
