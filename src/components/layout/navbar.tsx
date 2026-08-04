"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown, ShieldCheck, GitBranch, Terminal, Network, HelpCircle, LayoutDashboard, CodeSquare, Fingerprint } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-hair backdrop-blur-md bg-ink-0/80 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7140DB] to-[#4E2A9D] flex items-center justify-center shadow-md">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.4" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-fg-0">
              SlotMyInterview
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <div className="relative">
              <button 
                onClick={() => toggleDropdown("platform")}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-[14px] font-medium transition-colors text-fg-2 hover:text-fg-0 hover:bg-white/5 font-sans"
              >
                Solutions
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "platform" ? "rotate-180" : ""}`} />
              </button>

              {/* Mega Dropdown */}
              <AnimatePresence>
                {activeDropdown === "platform" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-[540px] overflow-hidden rounded-xl border border-hair-2 bg-ink-2 shadow-2xl p-6 grid grid-cols-2 gap-8"
                  >
                    <div>
                      <div className="text-[11px] font-mono font-semibold tracking-wider text-fg-3 uppercase mb-4">Platform</div>
                      <div className="flex flex-col gap-1.5">
                        <Link href="/platform/how-it-works" className="flex items-center gap-3 p-1.5 hover:bg-white/5 rounded-md text-sm text-fg-2 hover:text-fg-0 transition-colors">
                          <HelpCircle className="w-4 h-4 text-purple-400" />
                          <span>How it works</span>
                        </Link>
                        <Link href="/platform/security" className="flex items-center gap-3 p-1.5 hover:bg-white/5 rounded-md text-sm text-fg-2 hover:text-fg-0 transition-colors">
                          <ShieldCheck className="w-4 h-4 text-purple-400" />
                          <span>Vetting Details</span>
                        </Link>
                        <Link href="/platform/portfolios" className="flex items-center gap-3 p-1.5 hover:bg-white/5 rounded-md text-sm text-fg-2 hover:text-fg-0 transition-colors">
                          <CodeSquare className="w-4 h-4 text-purple-400" />
                          <span>Living Portfolios</span>
                        </Link>
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-mono font-semibold tracking-wider text-fg-3 uppercase mb-4">Specialized</div>
                      <div className="flex flex-col gap-1.5">
                        <Link href="/platform/github-sync" className="flex items-center gap-3 p-1.5 hover:bg-white/5 rounded-md text-sm text-fg-2 hover:text-fg-0 transition-colors">
                          <GitBranch className="w-4 h-4 text-purple-400" />
                          <span>GitHub Sync</span>
                        </Link>
                        <Link href="/platform/challenges" className="flex items-center gap-3 p-1.5 hover:bg-white/5 rounded-md text-sm text-fg-2 hover:text-fg-0 transition-colors">
                          <Terminal className="w-4 h-4 text-purple-400" />
                          <span>Code Challenges</span>
                        </Link>
                        <Link href="/platform/identity" className="flex items-center gap-3 p-1.5 hover:bg-white/5 rounded-md text-sm text-fg-2 hover:text-fg-0 transition-colors">
                          <Fingerprint className="w-4 h-4 text-purple-400" />
                          <span>Identity Verification</span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/search" className="h-9 px-3 rounded-md inline-flex items-center text-[14px] font-medium transition-colors text-fg-2 hover:text-fg-0 hover:bg-white/5">
              Candidates
            </Link>
            <Link href="/pricing" className="h-9 px-3 rounded-md inline-flex items-center text-[14px] font-medium transition-colors text-fg-2 hover:text-fg-0 hover:bg-white/5">
              Pricing
            </Link>
            <Link href="/blog" className="h-9 px-3 rounded-md inline-flex items-center text-[14px] font-medium transition-colors text-fg-2 hover:text-fg-0 hover:bg-white/5">
              Blog
            </Link>
          </div>
        </div>

        {/* Right: CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-[14px] font-medium text-fg-2 hover:text-fg-0 transition-colors px-3 py-1.5 rounded-md hover:bg-white/5">
            Sign in
          </Link>
          <Link href="/signup" className="btn btn-accent btn-sm">
            Get early access
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-md text-fg-2 hover:text-fg-0 hover:bg-white/5 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-hair bg-ink-1 overflow-hidden"
          >
            <div className="flex flex-col gap-3 p-6">
              <Link href="/platform/how-it-works" className="text-sm font-medium text-fg-2 hover:text-fg-0">How it works</Link>
              <Link href="/search" className="text-sm font-medium text-fg-2 hover:text-fg-0">Candidates</Link>
              <Link href="/pricing" className="text-sm font-medium text-fg-2 hover:text-fg-0">Pricing</Link>
              <Link href="/blog" className="text-sm font-medium text-fg-2 hover:text-fg-0">Blog</Link>
              <hr className="border-hair my-1" />
              <Link href="/login" className="text-sm font-medium text-fg-2 hover:text-fg-0">Sign in</Link>
              <Link href="/signup" className="btn btn-accent w-full text-center">Get early access</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
