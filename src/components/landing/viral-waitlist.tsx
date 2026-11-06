"use client";

import { useState, useEffect, useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, User, Building, ArrowRight, CheckCircle2, 
  Copy, Share2, Send, Zap, ShieldCheck, 
  Flame, Award, Calendar, QrCode
} from "lucide-react";
import { joinWaitlist, type WaitlistResult } from "@/app/actions/waitlist";

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 0 0 1.45-1.45 1.45 1.45 0 0 0-1.45-1.45 1.45 1.45 0 0 0-1.45 1.45c0 .8.65 1.45 1.45 1.45m1.37 9.74v-8.37H5.09v8.37h2.74z" />
    </svg>
  );
}

export function ViralWaitlist() {
  return (
    <Suspense fallback={<div className="py-20 text-center min-h-[400px]" />}>
      <ViralWaitlistContent />
    </Suspense>
  );
}

function ViralWaitlistContent() {
  const searchParams = useSearchParams();
  const urlRef = searchParams.get("ref") || "";

  const [role, setRole] = useState<"ENGINEER" | "EMPLOYER">("ENGINEER");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [ticketData, setTicketData] = useState<WaitlistResult["ticket"] | null>(null);

  // Check if ticket is stored in localStorage from a previous visit
  useEffect(() => {
    try {
      const saved = localStorage.getItem("slotmyinterview_waitlist_ticket");
      if (saved) {
        setTicketData(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("role", role);
    if (role === "ENGINEER" && username) formData.append("username", username);
    if (role === "EMPLOYER" && companyName) formData.append("companyName", companyName);
    if (urlRef) formData.append("refCode", urlRef);

    startTransition(async () => {
      const res = await joinWaitlist(formData);
      if (res.success && res.ticket) {
        setTicketData(res.ticket);
        try {
          localStorage.setItem("slotmyinterview_waitlist_ticket", JSON.stringify(res.ticket));
        } catch {}
      } else {
        setError(res.error || "Failed to join waitlist. Please try again.");
      }
    });
  };

  const getShareUrl = () => {
    if (typeof window === "undefined") return "https://slotmyinterview.com";
    const origin = window.location.origin;
    return `${origin}?ref=${ticketData?.referralCode || "VIP"}`;
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    const url = getShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "SlotMyInterview VIP Priority Access",
          text: role === "ENGINEER" 
            ? "I just claimed my verified engineer handle on SlotMyInterview. Skip resume screening and get booked directly. Join with my priority link:"
            : "We're booking pre-vetted engineers directly on SlotMyInterview without resume spam. Claim founding recruiter access here:",
          url,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const shareOnX = () => {
    const url = getShareUrl();
    const text = role === "ENGINEER"
      ? `Just claimed my developer handle on @SlotMyInterview! Skip resume filters with AST-verified code proof & direct interview slots. Jump the queue with my priority link:`
      : `Hiring engineers without resume spam. Just got early access to @SlotMyInterview to book pre-vetted devs directly. Join the founding recruiter cohort:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    const url = getShareUrl();
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
  };

  const shareOnWhatsApp = () => {
    const url = getShareUrl();
    const text = `Hey, check out SlotMyInterview! Claim your developer handle & skip the resume black hole with direct interview bookings: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section id="waitlist" className="relative py-20 px-4 sm:px-6 overflow-hidden">
      {/* Background Neon Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/15 to-pink-600/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-mono font-medium mb-4 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>FOUNDING ACCESS COHORT • LAUNCHING Q1</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Be First in Line.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400">
              Skip the Queue.
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-fg-3 max-w-xl mx-auto">
            Reserve your verified developer handle or lock in 0% recruiter fees. Every peer you invite jumps you 50 spots forward in line.
          </p>

          {urlRef && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Priority Invitation code <strong>{urlRef}</strong> applied (+50 spot boost!)</span>
            </div>
          )}
        </div>

        {/* Main Card */}
        <div className="relative rounded-3xl border border-white/10 bg-ink-1/90 backdrop-blur-2xl shadow-2xl p-6 sm:p-10 overflow-hidden">
          
          <AnimatePresence mode="wait">
            {!ticketData ? (
              /* ================== SIGNUP FORM ================== */
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="max-w-xl mx-auto"
              >
                {/* Role Switcher Tabs */}
                <div className="flex bg-white/[0.04] border border-white/10 p-1.5 rounded-2xl mb-8">
                  <button
                    type="button"
                    onClick={() => setRole("ENGINEER")}
                    className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                      role === "ENGINEER"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
                        : "text-fg-3 hover:text-white"
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>I&apos;m a Software Engineer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("EMPLOYER")}
                    className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                      role === "EMPLOYER"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
                        : "text-fg-3 hover:text-white"
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>I&apos;m Hiring Talent</span>
                  </button>
                </div>

                {error && (
                  <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-medium text-fg-2 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Rivera"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-11 px-4 text-xs rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-fg-3 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/60 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-fg-2 mb-1.5">
                      {role === "ENGINEER" ? "Personal / GitHub Email" : "Work Email"}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder={role === "ENGINEER" ? "alex@domain.com" : "alex@company.com"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 px-4 text-xs rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-fg-3 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/60 transition-all"
                    />
                  </div>

                  {/* Conditional: Handle for Devs, Company for Recruiters */}
                  {role === "ENGINEER" ? (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-fg-2">
                          Reserve Developer Handle
                        </label>
                        <span className="text-[10px] font-mono text-purple-400">Scarcity: First come, first served</span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-fg-3 font-mono text-xs">
                          slotmyinterview.com/u/
                        </span>
                        <input
                          type="text"
                          required
                          pattern="[a-zA-Z0-9_-]{3,30}"
                          placeholder="yourname"
                          value={username}
                          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                          className="w-full h-11 pl-44 pr-4 text-xs rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono placeholder:text-fg-3 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/60 transition-all"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-medium text-fg-2 mb-1.5">
                        Company Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Stripe, Scale AI, or Seed Startup"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full h-11 px-4 text-xs rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-fg-3 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/60 transition-all"
                      />
                    </div>
                  )}

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="mt-2 w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isPending ? (
                      <span>Reserving Priority Pass...</span>
                    ) : (
                      <>
                        <span>Claim Priority Ticket & Handle</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-4 mt-2 text-[11px] text-fg-3 font-mono">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" /> 0% Spam Guarantee
                    </span>
                    <span>•</span>
                    <span>No Resume Required</span>
                  </div>
                </form>
              </motion.div>
            ) : (
              /* ================== HOLOGRAPHIC VIP TICKET ================== */
              <motion.div
                key="ticket"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="max-w-xl mx-auto text-center"
              >
                {/* Congratulations Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold mb-6">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>VIP PRIORITY TICKET UNLOCKED</span>
                </div>

                {/* The Holographic VIP Glass Pass */}
                <div className="relative mx-auto rounded-3xl p-6 sm:p-8 border border-white/20 bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-purple-900/20 backdrop-blur-3xl shadow-[0_20px_50px_rgba(120,40,200,0.3)] text-left overflow-hidden">
                  
                  {/* Decorative Corner Watermarks */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                  
                  {/* Header Row of Ticket */}
                  <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-5">
                    <div>
                      <div className="text-[10px] font-mono tracking-widest uppercase text-purple-400 font-bold">
                        FOUNDING COHORT PASS
                      </div>
                      <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-0.5">
                        {ticketData.fullName}
                      </div>
                      {ticketData.username && (
                        <div className="text-xs font-mono text-fg-3 mt-0.5">
                          Handle: <span className="text-indigo-400 font-bold">/u/{ticketData.username}</span> (Reserved)
                        </div>
                      )}
                      {ticketData.companyName && (
                        <div className="text-xs font-mono text-fg-3 mt-0.5">
                          Organization: <span className="text-purple-400 font-bold">{ticketData.companyName}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-mono text-fg-3 uppercase">Queue Position</div>
                      <div className="text-2xl sm:text-3xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-purple-300">
                        #{ticketData.position.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Live Progress Bar & Queue Jumper */}
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-4 mb-5">
                    <div className="flex items-center justify-between text-xs font-medium text-fg-2 mb-2">
                      <span className="flex items-center gap-1.5 text-white">
                        <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                        Queue Jump Multiplier
                      </span>
                      <span className="font-mono text-purple-300">
                        +{ticketData.points} Spot Boost
                      </span>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(25, ticketData.points))}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-fg-3 mt-2 font-mono">
                      <span>{ticketData.referralCount} peers joined with your link</span>
                      <span className="text-emerald-400">+50 spots per share</span>
                    </div>
                  </div>

                  {/* Shareable Link Box */}
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-white">
                      Your Unique Priority Invite Link:
                    </div>
                    
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.04] border border-white/15">
                      <input 
                        type="text" 
                        readOnly 
                        value={getShareUrl()} 
                        className="flex-1 bg-transparent text-xs font-mono text-purple-300 outline-none px-2 select-all"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-md shadow-purple-500/30"
                      >
                        {copied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Barcode Footer Visual */}
                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-fg-3">
                    <span className="flex items-center gap-1">
                      <QrCode className="w-3.5 h-3.5 text-purple-400" />
                      SECURE ID: {ticketData.referralCode}
                    </span>
                    <span>SLOTMYINTERVIEW • 2026</span>
                  </div>

                </div>

                {/* 1-Click Viral Distribution Matrix */}
                <div className="mt-8">
                  <div className="text-xs font-mono text-fg-3 uppercase mb-3 tracking-wider">
                    Share to jump 50 spots right now:
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* Share on X */}
                    <button
                      onClick={shareOnX}
                      className="h-11 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <XIcon className="w-3.5 h-3.5 text-white" />
                      <span>Post on X</span>
                    </button>

                    {/* Share on LinkedIn */}
                    <button
                      onClick={shareOnLinkedIn}
                      className="h-11 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <LinkedInIcon className="w-3.5 h-3.5 text-blue-400" />
                      <span>LinkedIn</span>
                    </button>

                    {/* Share on WhatsApp */}
                    <button
                      onClick={shareOnWhatsApp}
                      className="h-11 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-emerald-400" />
                      <span>WhatsApp</span>
                    </button>

                    {/* Native Share Sheet */}
                    <button
                      onClick={handleNativeShare}
                      className="h-11 px-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 text-purple-300" />
                      <span>More...</span>
                    </button>
                  </div>
                </div>

                {/* Reset button to register another account */}
                <button
                  onClick={() => {
                    setTicketData(null);
                    localStorage.removeItem("slotmyinterview_waitlist_ticket");
                  }}
                  className="mt-6 text-[11px] text-fg-3 hover:text-white underline transition-colors cursor-pointer"
                >
                  Register another email or organization
                </button>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
