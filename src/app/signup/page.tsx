"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GitBranch } from "lucide-react";
import { useState } from "react";

export default function SignupPage() {
  const [accountType, setAccountType] = useState<"employer" | "candidate">("employer");

  return (
    <div className="min-h-[calc(100vh-80px)] mt-20 flex items-center justify-center bg-[#f8f9fc] p-4 py-12">
      <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Create your account</h1>
          <p className="text-slate-500 text-sm">Join the standard for elite AI talent</p>
        </div>

        {/* Account Type Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-lg mb-8">
          <button 
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${accountType === "employer" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            onClick={() => setAccountType("employer")}
          >
            I'm Hiring
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${accountType === "candidate" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            onClick={() => setAccountType("candidate")}
          >
            I'm an Engineer
          </button>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          {accountType === "candidate" ? (
            <Button variant="outline" className="h-12 w-full font-semibold relative bg-slate-900 text-white hover:bg-slate-800 hover:text-white border-0">
              <GitBranch className="w-5 h-5 absolute left-4" />
              Sign up with GitHub (Required)
            </Button>
          ) : (
            <Button variant="outline" className="h-12 w-full font-semibold relative">
              <svg className="w-5 h-5 absolute left-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign up with Google
            </Button>
          )}
        </div>

        <div className="relative flex items-center py-2 mb-6">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">or with email</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">First Name</label>
              <Input placeholder="Jane" className="h-11 bg-slate-50 border-slate-200" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">Last Name</label>
              <Input placeholder="Doe" className="h-11 bg-slate-50 border-slate-200" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">Work Email</label>
            <Input type="email" placeholder="name@company.com" className="h-11 bg-slate-50 border-slate-200" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">Password</label>
            <Input type="password" placeholder="••••••••" className="h-11 bg-slate-50 border-slate-200" />
          </div>
          <Button className="w-full h-11 bg-[#6B47ED] hover:bg-[#5839C7] text-white font-bold mt-4 text-base">
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8">
          Already have an account? <Link href="/login" className="text-[#6B47ED] font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
