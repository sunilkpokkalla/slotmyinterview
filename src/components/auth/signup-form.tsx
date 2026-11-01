"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Building, User, Mail, Lock, UserCheck, Globe, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp, type AuthFormState } from "@/app/actions/auth";

const inputClass = "h-11 text-xs bg-white/[0.04] border-white/10 rounded-xl text-white placeholder:text-fg-3 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50";

export function SignupForm({ initialType }: { initialType: "candidate" | "employer" }) {
  const [accountType, setAccountType] = useState(initialType);
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(signUp, undefined);

  if (state?.message) {
    return (
      <div className="w-full max-w-[460px] rounded-3xl border border-white/10 bg-ink-1/90 backdrop-blur-2xl shadow-2xl p-8 text-center text-white">
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Check your inbox</h1>
        <p className="text-xs text-fg-2 leading-relaxed max-w-sm mx-auto">{state.message}</p>
        <Link 
          href="/login" 
          className="inline-block mt-6 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold text-white border border-white/10 transition-colors"
        >
          Go to Sign In →
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[480px] rounded-3xl border border-white/10 bg-ink-1/90 backdrop-blur-2xl shadow-2xl p-8 text-white">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-mono font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Proof-Based Talent Network</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Create your account</h1>
        <p className="text-fg-3 text-xs mt-1">
          {accountType === "candidate" ? "Publish your verified proof & get booked directly." : "Access pre-vetted engineers & direct calendar slotting."}
        </p>
      </div>

      {/* Account Type Toggle */}
      <div className="flex bg-white/[0.03] border border-white/10 p-1 rounded-2xl mb-6" role="tablist">
        {([
          ["candidate", "Software Engineer", User],
          ["employer", "Hiring Recruiter", Building],
        ] as const).map(([value, label, Icon]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={accountType === value}
            onClick={() => setAccountType(value)}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              accountType === value 
                ? "bg-purple-600/30 text-white border border-purple-500/40 shadow-sm" 
                : "text-fg-3 hover:text-white"
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${accountType === value ? "text-purple-400" : "text-fg-3"}`} />
            {label}
          </button>
        ))}
      </div>

      {state?.error && (
        <div role="alert" className="mb-5 text-xs font-medium text-rose-300 bg-rose-950/40 border border-rose-500/30 p-3.5 rounded-xl text-center leading-relaxed">
          {state.error}
        </div>
      )}

      <form action={formAction} className="flex flex-col gap-3.5">
        <input type="hidden" name="accountType" value={accountType} />
        
        <label className="text-xs font-medium text-fg-2">
          <span className="block mb-1.5">Full name</span>
          <Input 
            name="fullName" 
            required 
            autoComplete="name" 
            placeholder="Jane Doe" 
            className={inputClass} 
          />
        </label>

        {accountType === "candidate" ? (
          <label className="text-xs font-medium text-fg-2">
            <span className="block mb-1.5">Username (your profile will live at /u/username)</span>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-fg-3 font-mono text-xs">/u/</span>
              <Input 
                name="username" 
                required 
                pattern="[a-zA-Z0-9_-]{3,30}" 
                placeholder="janedoe" 
                className={`${inputClass} pl-10 font-mono`} 
              />
            </div>
          </label>
        ) : (
          <>
            <label className="text-xs font-medium text-fg-2">
              <span className="block mb-1.5">Company name</span>
              <Input 
                name="companyName" 
                required 
                placeholder="Acme Systems" 
                className={inputClass} 
              />
            </label>
            <label className="text-xs font-medium text-fg-2">
              <span className="block mb-1.5">Company website</span>
              <Input 
                name="website" 
                type="url" 
                required 
                placeholder="https://acme.com" 
                className={inputClass} 
              />
            </label>
          </>
        )}

        <label className="text-xs font-medium text-fg-2">
          <span className="block mb-1.5">{accountType === "employer" ? "Work email" : "Email address"}</span>
          <Input 
            name="email" 
            type="email" 
            required 
            autoComplete="email" 
            placeholder="name@company.com" 
            className={inputClass} 
          />
        </label>
        
        <label className="text-xs font-medium text-fg-2">
          <span className="block mb-1.5">Password (8+ characters)</span>
          <Input 
            name="password" 
            type="password" 
            required 
            minLength={8} 
            autoComplete="new-password" 
            placeholder="••••••••" 
            className={inputClass} 
          />
        </label>

        <Button 
          type="submit" 
          disabled={pending} 
          className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold mt-3 text-xs rounded-xl shadow-lg shadow-purple-500/25 transition-all"
        >
          {pending ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="text-center text-xs text-fg-3 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-purple-400 font-semibold hover:text-purple-300 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
