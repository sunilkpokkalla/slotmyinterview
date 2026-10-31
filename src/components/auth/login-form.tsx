"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, type AuthFormState } from "@/app/actions/auth";

export function LoginForm({ next, initialError }: { next?: string; initialError?: string }) {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(signIn, initialError ? { error: initialError } : undefined);

  return (
    <div className="w-full max-w-[460px] bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
        <p className="text-slate-500 text-xs">Sign in to your SlotMyInterview account</p>
      </div>

      {state?.error && (
        <div role="alert" className="mb-4 text-xs font-medium text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 text-center">
          {state.error}
        </div>
      )}

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="next" value={next ?? ""} />
        <label className="text-xs font-semibold text-slate-700">
          <span className="block mb-1.5">Email address</span>
          <Input name="email" type="email" required autoComplete="email" placeholder="name@company.com" className="h-11 bg-slate-50 border-slate-200 text-slate-900 rounded-xl" />
        </label>
        <label className="text-xs font-semibold text-slate-700">
          <span className="block mb-1.5">Password</span>
          <Input name="password" type="password" required autoComplete="current-password" placeholder="••••••••" className="h-11 bg-slate-50 border-slate-200 text-slate-900 rounded-xl" />
        </label>
        <Button type="submit" disabled={pending} className="w-full h-11 bg-[#6B47ED] hover:bg-[#5835dc] text-white font-semibold mt-2 rounded-xl shadow-md">
          {pending ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500 mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-[#6B47ED] font-semibold hover:underline">
          Sign up as an engineer or recruiter
        </Link>
      </p>
    </div>
  );
}
