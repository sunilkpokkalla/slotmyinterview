"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Sparkles, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, type AuthFormState } from "@/app/actions/auth";

export function LoginForm({ next, initialError }: { next?: string; initialError?: string }) {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    signIn, 
    initialError ? { error: initialError } : undefined
  );

  return (
    <div className="w-full max-w-[460px] rounded-3xl border border-white/10 bg-ink-1/90 backdrop-blur-2xl shadow-2xl p-8 text-white">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-mono font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>SlotMyInterview Portal</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
        <p className="text-fg-3 text-xs mt-1">Sign in to your candidate or recruiter account</p>
      </div>

      {state?.error && (
        <div role="alert" className="mb-5 text-xs font-medium text-rose-300 bg-rose-950/40 border border-rose-500/30 p-3.5 rounded-xl text-center leading-relaxed">
          {state.error}
        </div>
      )}

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="next" value={next ?? ""} />
        
        <label className="text-xs font-medium text-fg-2">
          <span className="block mb-1.5">Email address</span>
          <Input 
            name="email" 
            type="email" 
            required 
            autoComplete="email" 
            placeholder="name@company.com" 
            className="h-11 bg-white/[0.04] border-white/10 text-white placeholder:text-fg-3 rounded-xl focus:border-purple-500/50" 
          />
        </label>
        
        <label className="text-xs font-medium text-fg-2">
          <div className="flex items-center justify-between mb-1.5">
            <span>Password</span>
          </div>
          <Input 
            name="password" 
            type="password" 
            required 
            autoComplete="current-password" 
            placeholder="••••••••" 
            className="h-11 bg-white/[0.04] border-white/10 text-white placeholder:text-fg-3 rounded-xl focus:border-purple-500/50" 
          />
        </label>

        <Button 
          type="submit" 
          disabled={pending} 
          className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold mt-2 rounded-xl text-xs shadow-lg shadow-purple-500/25 transition-all"
        >
          {pending ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="text-center text-xs text-fg-3 mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-purple-400 font-semibold hover:text-purple-300 hover:underline">
          Sign up as an engineer or recruiter
        </Link>
      </p>
    </div>
  );
}
