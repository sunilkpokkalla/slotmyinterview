"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GitBranch, Building, User, ArrowRight } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<"employer" | "candidate">("candidate");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("https://");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in email and password");
      return;
    }

    setIsLoading(true);

    try {
      if (accountType === "candidate") {
        const fullName = `${firstName} ${lastName}`.trim() || "Software Engineer";
        const cleanUsername = (username || email.split("@")[0]).replace(/[^a-zA-Z0-9_-]/g, "");

        const res = await api.auth.registerSeeker({
          email,
          password,
          fullName,
          username: cleanUsername,
          headline: "Software Engineer",
        });

        if (res.success && res.data) {
          localStorage.setItem("smi_token", res.data.accessToken);
          localStorage.setItem("smi_refresh_token", res.data.refreshToken);
          localStorage.setItem("smi_user", JSON.stringify(res.data.user));
          router.push("/dashboard");
          return;
        }

        setError(res.message || "Failed to register candidate");
      } else {
        const res = await api.auth.registerProvider({
          email,
          password,
          companyName: companyName || `${firstName}'s Company`,
          website: companyWebsite.startsWith("http") ? companyWebsite : `https://${companyWebsite}`,
          description: "Innovative engineering team hiring verified talent on SlotMyInterview.",
        });

        if (res.success && res.data) {
          localStorage.setItem("smi_token", res.data.accessToken);
          localStorage.setItem("smi_refresh_token", res.data.refreshToken);
          localStorage.setItem("smi_user", JSON.stringify(res.data.user));
          router.push("/dashboard");
          return;
        }

        setError(res.message || "Failed to register company");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] mt-20 flex items-center justify-center bg-[#f8f9fc] p-4 py-12 text-slate-900">
      <div className="w-full max-w-[460px] bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
          <p className="text-slate-500 text-xs">Join the standard for AI-verified software talent</p>
        </div>

        {/* Account Type Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
          <button 
            type="button"
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${accountType === "candidate" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            onClick={() => setAccountType("candidate")}
          >
            <User className="w-3.5 h-3.5 text-indigo-600" />
            Software Engineer
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${accountType === "employer" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            onClick={() => setAccountType("employer")}
          >
            <Building className="w-3.5 h-3.5 text-purple-600" />
            Job Provider (Employer)
          </button>
        </div>

        {error && (
          <div className="mb-4 text-xs font-medium text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">First Name</label>
              <Input 
                placeholder="Jane" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="h-10 text-xs bg-slate-50 border-slate-200 rounded-xl" 
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Last Name</label>
              <Input 
                placeholder="Doe" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="h-10 text-xs bg-slate-50 border-slate-200 rounded-xl" 
              />
            </div>
          </div>

          {accountType === "candidate" ? (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Desired Username (for slotmyinterview.com/u/:username)</label>
              <Input 
                placeholder="janedoe" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-10 text-xs bg-slate-50 border-slate-200 rounded-xl font-mono" 
              />
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Company Name</label>
                <Input 
                  placeholder="Acme AI Corp" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="h-10 text-xs bg-slate-50 border-slate-200 rounded-xl" 
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Company Website</label>
                <Input 
                  placeholder="https://acme.ai" 
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  className="h-10 text-xs bg-slate-50 border-slate-200 rounded-xl" 
                />
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Work Email</label>
            <Input 
              type="email" 
              placeholder="name@domain.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 text-xs bg-slate-50 border-slate-200 rounded-xl" 
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 text-xs bg-slate-50 border-slate-200 rounded-xl" 
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-11 bg-[#6B47ED] hover:bg-[#5839C7] text-white font-bold mt-2 text-sm rounded-xl shadow-md transition-all"
          >
            {isLoading ? "Creating Profile..." : "Create Account & Enter Platform"}
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already have an account? <Link href="/login" className="text-[#6B47ED] font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
