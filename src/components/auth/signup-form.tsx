"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Building, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp, type AuthFormState } from "@/app/actions/auth";

const inputClass = "h-10 text-xs bg-slate-50 border-slate-200 rounded-xl";

export function SignupForm({ initialType }: { initialType: "candidate" | "employer" }) {
  const [accountType, setAccountType] = useState(initialType);
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(signUp, undefined);

  if (state?.message) {
    return (
      <div className="w-full max-w-[460px] bg-white rounded-3xl shadow-xl p-8 border border-slate-100 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Check your inbox</h1>
        <p className="text-sm text-slate-600">{state.message}</p>
        <Link href="/login" className="inline-block mt-6 text-sm font-semibold text-[#6B47ED] hover:underline">Go to sign in</Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[460px] bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
        <p className="text-slate-500 text-xs">Candidates get booked. Recruiters book directly.</p>
      </div>

      <div className="flex bg-slate-100 p-1 rounded-2xl mb-6" role="tablist">
        {([
          ["candidate", "Candidate", User],
          ["employer", "Recruiter", Building],
        ] as const).map(([value, label, Icon]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={accountType === value}
            onClick={() => setAccountType(value)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${accountType === value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Icon className="w-3.5 h-3.5 text-indigo-600" />
            {label}
          </button>
        ))}
      </div>

      {state?.error && (
        <div role="alert" className="mb-4 text-xs font-medium text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 text-center">
          {state.error}
        </div>
      )}

      <form action={formAction} className="flex flex-col gap-3.5">
        <input type="hidden" name="accountType" value={accountType} />
        <label className="text-xs font-semibold text-slate-700">
          <span className="block mb-1">Full name</span>
          <Input name="fullName" required autoComplete="name" placeholder="Jane Doe" className={inputClass} />
        </label>

        {accountType === "candidate" ? (
          <label className="text-xs font-semibold text-slate-700">
            <span className="block mb-1">Username (your profile will live at /u/username)</span>
            <Input name="username" required pattern="[a-zA-Z0-9_-]{3,30}" placeholder="janedoe" className={`${inputClass} font-mono`} />
          </label>
        ) : (
          <>
            <label className="text-xs font-semibold text-slate-700">
              <span className="block mb-1">Company name</span>
              <Input name="companyName" required placeholder="Acme Inc." className={inputClass} />
            </label>
            <label className="text-xs font-semibold text-slate-700">
              <span className="block mb-1">Company website</span>
              <Input name="website" type="url" required placeholder="https://acme.com" className={inputClass} />
            </label>
          </>
        )}

        <label className="text-xs font-semibold text-slate-700">
          <span className="block mb-1">{accountType === "employer" ? "Work email" : "Email"}</span>
          <Input name="email" type="email" required autoComplete="email" placeholder="name@domain.com" className={inputClass} />
        </label>
        <label className="text-xs font-semibold text-slate-700">
          <span className="block mb-1">Password (8+ characters)</span>
          <Input name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="••••••••" className={inputClass} />
        </label>

        <Button type="submit" disabled={pending} className="w-full h-11 bg-[#6B47ED] hover:bg-[#5839C7] text-white font-bold mt-2 text-sm rounded-xl shadow-md">
          {pending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-[#6B47ED] font-semibold hover:underline">Log in</Link>
      </p>
    </div>
  );
}
