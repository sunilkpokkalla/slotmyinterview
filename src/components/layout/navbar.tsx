"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Menu, X, ChevronDown, ShieldCheck, GitBranch, Terminal, 
  CodeSquare, Fingerprint, Search, Sparkles, 
  Briefcase, Code2, Calendar, Zap, CheckCircle2, ArrowRight,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Logo } from "@/components/ui/logo";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const closeAll = () => {
    setActiveDropdown(null);
    setIsOpen(false);
  };

  // Keyboard shortcut listener for CMD+K / CTRL+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* Floating Glass Island Navbar Container */}
      <header className="sticky top-3 z-50 w-full px-4 sm:px-6">
        <nav className="max-w-6xl mx-auto h-14 rounded-full border border-white/10 bg-ink-1/80 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all flex items-center justify-between px-3 sm:px-4">
          
          {/* Left: Brand Logo */}
          <Link href="/" onClick={closeAll} className="shrink-0 group pl-1">
            <Logo size="sm" showTagline={false} />
          </Link>

          {/* Center Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            
            {/* Dropdown 1: For Employers */}
            <div className="relative" onMouseLeave={() => setActiveDropdown(null)}>
              <button 
                onMouseEnter={() => setActiveDropdown("employers")}
                onClick={() => toggleDropdown("employers")}
                className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  activeDropdown === "employers" ? "text-white bg-white/10" : "text-fg-2 hover:text-white hover:bg-white/5"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>For Employers</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === "employers" ? "rotate-180 text-white" : "text-fg-3"}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === "employers" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-[540px] rounded-2xl border border-white/10 bg-ink-1/95 backdrop-blur-3xl shadow-2xl p-5 grid grid-cols-2 gap-4"
                  >
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono font-bold tracking-wider text-purple-400 uppercase px-2 py-1 flex items-center justify-between">
                        <span>Vetting Engine</span>
                        <span className="bg-purple-500/10 text-purple-400 text-[9px] px-1.5 py-0.5 rounded-full border border-purple-500/20">Verified</span>
                      </div>

                      <Link href="/platform/security" onClick={closeAll} className="group p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors mt-0.5 shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors whitespace-nowrap">
                            AST Capability Audit
                          </div>
                          <div className="text-[11px] text-fg-3 leading-snug mt-0.5">
                            Parse ASTs to verify algorithmic depth & system concurrency.
                          </div>
                        </div>
                      </Link>

                      <Link href="/platform/identity" onClick={closeAll} className="group p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors mt-0.5 shrink-0">
                          <Fingerprint className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors whitespace-nowrap">
                            Keystroke Biometrics
                          </div>
                          <div className="text-[11px] text-fg-3 leading-snug mt-0.5">
                            Prevent proxy candidates and unauthorized AI copy-pasting.
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className="space-y-1 border-l border-white/10 pl-4">
                      <div className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase px-2 py-1 flex items-center justify-between">
                        <span>Hiring Speed</span>
                        <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded-full border border-emerald-500/20">Direct</span>
                      </div>

                      <Link href="/search" onClick={closeAll} className="group p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors mt-0.5 shrink-0">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors whitespace-nowrap">
                            Direct Calendar Slotting
                          </div>
                          <div className="text-[11px] text-fg-3 leading-snug mt-0.5">
                            Book pre-vetted engineers directly on their open calendar.
                          </div>
                        </div>
                      </Link>

                      <Link href="/platform/github-sync" onClick={closeAll} className="group p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors mt-0.5 shrink-0">
                          <GitBranch className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors whitespace-nowrap">
                            ATS Webhook Sync
                          </div>
                          <div className="text-[11px] text-fg-3 leading-snug mt-0.5">
                            Integrate proof scores with Greenhouse, Lever, and Ashby.
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className="col-span-2 mt-2 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-fg-3 px-1">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 99.8% Fraud-Free Guarantee
                      </span>
                      <Link href="/search" onClick={closeAll} className="text-purple-400 hover:underline flex items-center gap-1 font-sans font-medium">
                        Browse Vetted Engineers <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dropdown 2: For Engineers */}
            <div className="relative" onMouseLeave={() => setActiveDropdown(null)}>
              <button 
                onMouseEnter={() => setActiveDropdown("engineers")}
                onClick={() => toggleDropdown("engineers")}
                className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  activeDropdown === "engineers" ? "text-white bg-white/10" : "text-fg-2 hover:text-white hover:bg-white/5"
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>For Developers</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === "engineers" ? "rotate-180 text-white" : "text-fg-3"}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === "engineers" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-[500px] rounded-2xl border border-white/10 bg-ink-1/95 backdrop-blur-3xl shadow-2xl p-5 grid grid-cols-2 gap-4"
                  >
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono font-bold tracking-wider text-indigo-400 uppercase px-2 py-1">
                        Developer Passport
                      </div>

                      <Link href="/platform/portfolios" onClick={closeAll} className="group p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors mt-0.5 shrink-0">
                          <CodeSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors whitespace-nowrap">
                            Living Capability Profile
                          </div>
                          <div className="text-[11px] text-fg-3 leading-snug mt-0.5">
                            Replace static resumes with indexed AST repo metrics.
                          </div>
                        </div>
                      </Link>

                      <Link href="/platform/challenges" onClick={closeAll} className="group p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors mt-0.5 shrink-0">
                          <Terminal className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors whitespace-nowrap">
                            Interactive Sandboxes
                          </div>
                          <div className="text-[11px] text-fg-3 leading-snug mt-0.5">
                            Solve real production issues in Dockerized environments.
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className="space-y-1 border-l border-white/10 pl-4">
                      <div className="text-[10px] font-mono font-bold tracking-wider text-pink-400 uppercase px-2 py-1">
                        Monetize Skill
                      </div>

                      <Link href="/platform/how-it-works" onClick={closeAll} className="group p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 group-hover:bg-pink-500/20 transition-colors mt-0.5 shrink-0">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-pink-300 transition-colors whitespace-nowrap">
                            Direct Offer Slots
                          </div>
                          <div className="text-[11px] text-fg-3 leading-snug mt-0.5">
                            Publish interview slots and receive inbound offers directly.
                          </div>
                        </div>
                      </Link>

                      <Link href="/platform/how-it-works#proof" onClick={closeAll} className="group p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors mt-0.5 shrink-0">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors whitespace-nowrap">
                            GPG Signed Ledger
                          </div>
                          <div className="text-[11px] text-fg-3 leading-snug mt-0.5">
                            Earn cryptographic proof of authorship for your commits.
                          </div>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Direct Links */}
            <Link href="/search" className="h-8 px-3 rounded-full inline-flex items-center gap-1.5 text-xs font-medium text-fg-2 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap">
              <span>Verified Talent</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </Link>
            
            <Link href="/pricing" className="h-8 px-3 rounded-full inline-flex items-center text-xs font-medium text-fg-2 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap">
              Pricing
            </Link>

            <Link href="/blog" className="h-8 px-3 rounded-full inline-flex items-center text-xs font-medium text-fg-2 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap">
              Blog
            </Link>
          </div>

          {/* Right: Search Pill & CTA */}
          <div className="hidden lg:flex items-center gap-2.5">
            
            {/* Quick Search Shortcut Trigger Pill */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 h-8 px-3 rounded-full border border-white/10 bg-white/[0.03] text-fg-3 hover:text-white hover:border-white/20 text-xs transition-all font-mono whitespace-nowrap"
            >
              <Search className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Search stack...</span>
              <kbd className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-fg-2 font-mono">⌘K</kbd>
            </button>

            <Link href="/dashboard" className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors px-3 py-1.5 rounded-full hover:bg-purple-500/10 border border-purple-500/20 whitespace-nowrap">
              Dashboard
            </Link>

            <Link href="/login" className="text-xs font-medium text-fg-2 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/5 whitespace-nowrap">
              Sign in
            </Link>

            {/* Premium Button-in-Button CTA */}
            <Link 
              href="/signup" 
              className="group relative inline-flex items-center gap-2 h-8.5 pl-4 pr-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-lg shadow-purple-500/25 transition-all active:scale-[0.98] whitespace-nowrap"
            >
              <span>Slot an Interview</span>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <Sparkles className="w-3 h-3 text-amber-300" />
              </div>
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center gap-1.5">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full text-fg-2 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Search className="w-4.5 h-4.5 text-purple-400" />
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-fg-2 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed top-20 inset-x-4 z-40 rounded-2xl border border-white/10 bg-ink-1/95 backdrop-blur-3xl shadow-2xl p-6 overflow-hidden max-h-[85vh] overflow-y-auto"
          >
            <div className="flex flex-col gap-4">
              
              {/* Employers Section */}
              <div>
                <div className="text-[10px] font-mono font-bold text-purple-400 uppercase mb-2">For Employers</div>
                <div className="flex flex-col gap-2 pl-2">
                  <Link href="/search" onClick={closeAll} className="text-sm font-medium text-white flex items-center justify-between py-1">
                    <span>Browse Verified Candidates</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono">Live Ledger</span>
                  </Link>
                  <Link href="/platform/security" onClick={closeAll} className="text-sm font-medium text-fg-2 hover:text-white py-1">
                    AST Code Complexity Audit
                  </Link>
                  <Link href="/platform/identity" onClick={closeAll} className="text-sm font-medium text-fg-2 hover:text-white py-1">
                    Keystroke Biometric Checks
                  </Link>
                  <Link href="/platform/github-sync" onClick={closeAll} className="text-sm font-medium text-fg-2 hover:text-white py-1">
                    Greenhouse & Lever ATS Sync
                  </Link>
                </div>
              </div>

              <hr className="border-white/10" />

              {/* Developers Section */}
              <div>
                <div className="text-[10px] font-mono font-bold text-indigo-400 uppercase mb-2">For Engineers</div>
                <div className="flex flex-col gap-2 pl-2">
                  <Link href="/platform/portfolios" onClick={closeAll} className="text-sm font-medium text-fg-2 hover:text-white py-1">
                    Living Capability Profile
                  </Link>
                  <Link href="/platform/challenges" onClick={closeAll} className="text-sm font-medium text-fg-2 hover:text-white py-1">
                    Docker Production Sandboxes
                  </Link>
                  <Link href="/platform/how-it-works" onClick={closeAll} className="text-sm font-medium text-fg-2 hover:text-white py-1">
                    Direct Offer Scheduling
                  </Link>
                </div>
              </div>

              <hr className="border-white/10" />

              <div className="flex flex-col gap-2">
                <Link href="/pricing" onClick={closeAll} className="text-sm font-medium text-fg-2 hover:text-white py-1">Pricing</Link>
                <Link href="/blog" onClick={closeAll} className="text-sm font-medium text-fg-2 hover:text-white py-1">Blog</Link>
                <Link href="/login" onClick={closeAll} className="text-sm font-medium text-fg-2 hover:text-white py-1">Sign in</Link>
              </div>

              <Link href="/signup" onClick={closeAll} className="btn bg-gradient-to-r from-purple-600 to-indigo-600 text-white w-full text-center flex items-center justify-center gap-2 py-3 rounded-full font-semibold shadow-lg shadow-purple-500/20 mt-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Slot an Interview</span>
              </Link>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Talent Search Modal (`⌘K`) */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-xl rounded-2xl border border-white/10 bg-ink-1/95 backdrop-blur-3xl shadow-2xl overflow-hidden"
            >
              {/* Search Bar Header */}
              <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/[0.02]">
                <Search className="w-5 h-5 text-purple-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search by role or tech stack (e.g. Distributed Systems, Rust, Python AI)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-white placeholder:text-fg-3 outline-none text-sm font-mono"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="px-2 py-1 rounded-md text-fg-3 hover:text-white hover:bg-white/10 text-xs font-mono"
                >
                  ESC
                </button>
              </div>

              {/* Quick Filters / Suggestions */}
              <div className="p-4 flex flex-col gap-3">
                <div className="text-[10px] font-mono font-bold text-fg-3 uppercase">Popular Verified Roles</div>
                <div className="flex flex-wrap gap-2">
                  {["Distributed Systems", "Rust / High Concurrency", "Python AI & ML", "TypeScript / Next.js", "DevOps & Kubernetes"].map((role) => (
                    <Link
                      key={role}
                      href={`/search?q=${encodeURIComponent(role)}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-purple-500/15 border border-white/10 hover:border-purple-500/40 text-xs text-fg-2 hover:text-purple-300 transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      <Code2 className="w-3.5 h-3.5 text-purple-400" />
                      <span>{role}</span>
                    </Link>
                  ))}
                </div>

                <div className="mt-2 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-fg-3 font-mono">
                  <span>Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-fg-2 font-mono">ENTER</kbd> to search ledger</span>
                  <span className="text-purple-400 font-semibold">945+ Verified Profiles</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

