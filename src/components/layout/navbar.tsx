"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { 
  Menu, X, Search, Sparkles, 
  Briefcase, Code2, LogOut, LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "@/app/actions/auth";
import { Logo } from "@/components/ui/logo";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  // Client-side session check keeps public pages statically renderable.
  useEffect(() => {
    try {
      const supabase = createSupabaseBrowserClient();
      supabase.auth.getSession().then(({ data }: { data: { session: unknown } }) => {
        setSignedIn(Boolean(data?.session));
      });
      const { data } = supabase.auth.onAuthStateChange((_e: unknown, session: unknown) => {
        setSignedIn(Boolean(session));
      });
      return () => data?.subscription?.unsubscribe();
    } catch {
      // Supabase env not configured: stay in signed-out state.
      setSignedIn(false);
    }
  }, []);

  const closeAll = () => {
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
            <Link 
              href="/search" 
              className="h-8 px-3 rounded-full inline-flex items-center gap-1.5 text-xs font-medium text-fg-2 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap"
            >
              <span>Verified Talent</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </Link>
            
            <Link 
              href="/#how-it-works" 
              className="h-8 px-3 rounded-full inline-flex items-center text-xs font-medium text-fg-2 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap"
            >
              How It Works
            </Link>

            <Link 
              href="/#features" 
              className="h-8 px-3 rounded-full inline-flex items-center text-xs font-medium text-fg-2 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap"
            >
              Features
            </Link>

            <Link 
              href="/pricing" 
              className="h-8 px-3 rounded-full inline-flex items-center text-xs font-medium text-fg-2 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap"
            >
              Pricing
            </Link>

            <Link 
              href="/blog" 
              className="h-8 px-3 rounded-full inline-flex items-center text-xs font-medium text-fg-2 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap"
            >
              Blog
            </Link>
          </div>

          {/* Right: Search Pill & Auth Actions */}
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

            {signedIn ? (
              <div className="flex items-center gap-2">
                <Link 
                  href="/dashboard" 
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-300 hover:text-white transition-colors px-3 py-1.5 rounded-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 whitespace-nowrap"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="p-1.5 rounded-full text-fg-3 hover:text-rose-400 hover:bg-white/5 transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  href="/login" 
                  className="text-xs font-medium text-fg-2 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/5 whitespace-nowrap"
                >
                  Sign in
                </Link>

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
            )}
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
            <div className="flex flex-col gap-3">
              <Link 
                href="/search" 
                onClick={closeAll} 
                className="text-sm font-medium text-white flex items-center justify-between py-2 border-b border-white/5"
              >
                <span>Browse Verified Talent</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono">Live</span>
              </Link>
              
              <Link 
                href="/#how-it-works" 
                onClick={closeAll} 
                className="text-sm font-medium text-fg-2 hover:text-white py-2 border-b border-white/5"
              >
                How It Works
              </Link>

              <Link 
                href="/#features" 
                onClick={closeAll} 
                className="text-sm font-medium text-fg-2 hover:text-white py-2 border-b border-white/5"
              >
                Features
              </Link>

              <Link 
                href="/pricing" 
                onClick={closeAll} 
                className="text-sm font-medium text-fg-2 hover:text-white py-2 border-b border-white/5"
              >
                Pricing
              </Link>

              <Link 
                href="/blog" 
                onClick={closeAll} 
                className="text-sm font-medium text-fg-2 hover:text-white py-2 border-b border-white/5"
              >
                Blog
              </Link>

              <div className="pt-2 flex flex-col gap-2">
                {signedIn ? (
                  <>
                    <Link 
                      href="/dashboard" 
                      onClick={closeAll} 
                      className="btn bg-purple-600/20 border border-purple-500/30 text-purple-300 w-full text-center flex items-center justify-center gap-2 py-3 rounded-full font-semibold"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Open Dashboard</span>
                    </Link>
                    <form action={signOut} className="w-full">
                      <button 
                        type="submit" 
                        onClick={closeAll}
                        className="w-full text-center text-xs text-fg-3 hover:text-rose-400 py-2 font-medium"
                      >
                        Sign out
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      onClick={closeAll} 
                      className="text-sm font-medium text-center text-fg-2 hover:text-white py-2"
                    >
                      Sign in
                    </Link>
                    <Link 
                      href="/signup" 
                      onClick={closeAll} 
                      className="btn bg-gradient-to-r from-purple-600 to-indigo-600 text-white w-full text-center flex items-center justify-center gap-2 py-3 rounded-full font-semibold shadow-lg shadow-purple-500/20"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Slot an Interview</span>
                    </Link>
                  </>
                )}
              </div>
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

                <div className="mt-2 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-fg-3">
                  <span>Press <kbd className="bg-white/10 px-1 py-0.5 rounded font-mono text-[10px]">ENTER</kbd> to search</span>
                  <Link 
                    href={searchQuery ? `/search?q=${encodeURIComponent(searchQuery)}` : "/search"} 
                    onClick={() => setIsSearchOpen(false)}
                    className="text-purple-400 hover:text-purple-300 font-medium"
                  >
                    View all verified candidates →
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
