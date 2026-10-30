"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GitBranch, ShieldCheck, ArrowRight, Building, User } from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const performLogin = async (loginEmail: string, loginPass: string) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await api.auth.login(loginEmail, loginPass);
      if (res.success && res.data) {
        localStorage.setItem("smi_token", res.data.accessToken);
        localStorage.setItem("smi_refresh_token", res.data.refreshToken);
        localStorage.setItem("smi_user", JSON.stringify(res.data.user));
        router.push("/dashboard");
        return;
      }

      // Fallback for simple admin demo login
      if (loginEmail === "admin" && loginPass === "admin") {
        const adminRes = await api.auth.login("sunil@slotmyinterview.com", "Password123!");
        if (adminRes.success && adminRes.data) {
          localStorage.setItem("smi_token", adminRes.data.accessToken);
          localStorage.setItem("smi_refresh_token", adminRes.data.refreshToken);
          localStorage.setItem("smi_user", JSON.stringify(adminRes.data.user));
          router.push("/dashboard");
          return;
        }
      }

      setError(res.message || "Invalid email or password");
    } catch (err: any) {
      setError(err.message || "Failed to connect to authentication server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }
    performLogin(email, password);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] mt-20 flex items-center justify-center bg-[#f8f9fc] p-4 text-slate-900">
      <div className="w-full max-w-[460px] bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-slate-500 text-xs">Sign in to your SlotMyInterview account</p>
        </div>

        {/* Demo Fast Switcher Accounts */}
        <div className="mb-6 p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
          <div className="flex items-center gap-2 text-indigo-800 text-xs font-bold mb-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>One-Click Test Accounts</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => performLogin("sunil@slotmyinterview.com", "Password123!")}
              className="p-2 rounded-xl bg-white border border-indigo-200 text-left hover:border-indigo-400 transition-all shadow-xs"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                Sunil Kumar
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Candidate (Architect)</div>
            </button>

            <button
              type="button"
              onClick={() => performLogin("alex@arivera.ai", "Password123!")}
              className="p-2 rounded-xl bg-white border border-indigo-200 text-left hover:border-indigo-400 transition-all shadow-xs"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                Alex Rivera
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Candidate (AI/PyTorch)</div>
            </button>

            <button
              type="button"
              onClick={() => performLogin("recruiting@scale.ai", "Password123!")}
              className="p-2 rounded-xl bg-white border border-indigo-200 text-left hover:border-indigo-400 transition-all shadow-xs"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Building className="w-3.5 h-3.5 text-purple-600" />
                Scale AI
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Employer (Kanban Board)</div>
            </button>

            <button
              type="button"
              onClick={() => performLogin("careers@stripe.com", "Password123!")}
              className="p-2 rounded-xl bg-white border border-indigo-200 text-left hover:border-indigo-400 transition-all shadow-xs"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                Stripe
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Employer (Scheduler)</div>
            </button>
          </div>
        </div>

        <div className="relative flex items-center py-2 mb-4">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-3 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">or login with credentials</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {error && (
          <div className="mb-4 text-xs font-medium text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Email Address</label>
            <Input 
              type="email" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 bg-slate-50 border-slate-200 text-slate-900 rounded-xl" 
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Password</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 bg-slate-50 border-slate-200 text-slate-900 rounded-xl" 
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-11 bg-[#6B47ED] hover:bg-[#5835dc] text-white font-semibold mt-2 rounded-xl shadow-md transition-all"
          >
            {isLoading ? "Authenticating..." : "Sign In to Dashboard"}
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Don't have an account? <Link href="/signup" className="text-[#6B47ED] font-semibold hover:underline">Sign up as Engineer or Employer</Link>
        </p>
      </div>
    </div>
  );
}
