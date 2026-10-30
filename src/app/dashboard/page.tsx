"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User, Briefcase, Calendar, Clock, CheckCircle2, XCircle, 
  Search, Filter, Plus, ChevronRight, Settings, DollarSign, 
  GitBranch, Code2, Award, ShieldCheck, Sparkles, Star, 
  ArrowUpRight, Users, LayoutDashboard, FileText, CheckSquare, 
  LogOut, Sliders, Play, MessageSquare, AlertCircle, Link as LinkIcon,
  Upload, Trash2, Edit3, Send, Video, Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [roleMode, setRoleMode] = useState<"employee" | "employer">("employee");
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Seeker State
  const [seekerProfile, setSeekerProfile] = useState<any>(null);
  const [availability, setAvailability] = useState<string>("ACTIVELY_LOOKING");
  const [alertCap, setAlertCap] = useState<number>(3);
  const [alertsPaused, setAlertsPaused] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>("");

  // Seeker 5 Sections State
  const [identity, setIdentity] = useState({ fullName: "", headline: "", location: "", workAuthType: "", photoUrl: "" });
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [nonTechSkills, setNonTechSkills] = useState<string[]>([]);
  const [newNonTechInput, setNewNonTechInput] = useState("");
  const [experiences, setExperiences] = useState<any[]>([]);
  const [newExp, setNewExp] = useState({ company: "", role: "", startDate: "2022-01-01T00:00:00.000Z", isCurrent: true, description: "", link: "" });
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [newPort, setNewPort] = useState({ platform: "GitHub", url: "https://github.com/", title: "" });
  const [bio, setBio] = useState("");
  const [socials, setSocials] = useState<any[]>([]);

  // Employer / Provider State
  const [providerJobs, setProviderJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [kanbanBoard, setKanbanBoard] = useState<any[]>([]);
  const [taskModalCandidate, setTaskModalCandidate] = useState<any>(null);
  const [taskForm, setTaskForm] = useState({ taskType: "TECHNICAL_CHALLENGE", title: "", instructions: "", deadlineDays: 3 });
  
  // Post Job Modal State
  const [showPostJob, setShowPostJob] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    categoryId: "",
    salaryMin: 180000,
    salaryMax: 240000,
    location: "San Francisco, CA (Remote)",
    workLocation: "REMOTE",
    workType: "FULL_TIME",
  });

  // Interview Slot State
  const [newSlot, setNewSlot] = useState({ format: "REMOTE", location: "https://meet.google.com/xyz", startTime: "", endTime: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("smi_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        if (parsed.role === "JOB_PROVIDER") {
          setRoleMode("employer");
        }
      } catch {
        setUser({ name: "Sunil Kumar", email: "sunil@slotmyinterview.com", role: "JOB_SEEKER" });
      }
    } else {
      setUser({ name: "Sunil Kumar", email: "sunil@slotmyinterview.com", role: "JOB_SEEKER" });
    }

    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load Skill Categories
      const catRes = await api.taxonomy.getCategories();
      if (catRes.success && catRes.data) {
        setAllCategories(catRes.data);
        if (catRes.data.length > 0) {
          setNewJob(prev => ({ ...prev, categoryId: catRes.data[0].id }));
        }
      }

      // Load Current User Profile
      const meRes = await api.auth.getMe();
      if (meRes.success && meRes.data) {
        const u = meRes.data;
        if (u.seekerProfile) {
          const sp = u.seekerProfile;
          setSeekerProfile(sp);
          setAvailability(sp.availability);
          setAlertCap(sp.alertFrequencyMaxPerWeek || 3);
          setAlertsPaused(sp.alertsPaused || false);
          setIdentity({
            fullName: sp.fullName || "",
            headline: sp.headline || "",
            location: sp.location || "",
            workAuthType: sp.workAuthType || "US Citizen",
            photoUrl: sp.photoUrl || "",
          });
          setSelectedSkills((sp.skills || []).map((s: any) => s.skill?.name || s.name || s));
          setNonTechSkills(sp.nonTechSkills || []);
          setExperiences(sp.experiences || []);
          setPortfolios(sp.portfolioLinks || []);
          setBio(sp.bio || "");
          setSocials(sp.socialProfiles || []);
        }

        if (u.providerProfile) {
          loadProviderJobs();
        }
      }
    } catch {
      // Offline fallback
    }
  };

  const loadProviderJobs = async () => {
    try {
      const res = await api.providers.getMyJobs();
      if (res.success && res.data && res.data.length > 0) {
        setProviderJobs(res.data);
        setSelectedJobId(res.data[0].id);
        loadPipeline(res.data[0].id);
      }
    } catch {
      // Ignored
    }
  };

  const loadPipeline = async (jobId: string) => {
    try {
      const res = await api.providers.getPipeline(jobId);
      if (res.success && res.data) {
        setKanbanBoard(res.data.columns || []);
      }
    } catch {
      // Ignored
    }
  };

  const handleLogout = () => {
    api.auth.logout();
    router.push("/login");
  };

  // Seeker Section 1: Save Identity
  const handleSaveIdentity = async () => {
    const res = await api.seekers.updateIdentity(identity);
    if (res.success) {
      setSaveMessage("Section 1 (Identity) updated successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  // Seeker Section 2: Add Non-tech skill
  const handleAddNonTech = () => {
    if (!newNonTechInput.trim()) return;
    setNonTechSkills([...nonTechSkills, newNonTechInput.trim()]);
    setNewNonTechInput("");
  };

  // Seeker Section 3: Add Experience
  const handleAddExperience = async () => {
    if (!newExp.company || !newExp.role) return;
    const res = await api.seekers.addExperience({
      company: newExp.company,
      role: newExp.role,
      startDate: new Date().toISOString(),
      isCurrent: newExp.isCurrent,
      description: newExp.description || "Contributed to core product features.",
      link: newExp.link || undefined,
    });
    if (res.success && res.data) {
      setExperiences([res.data, ...experiences]);
      setNewExp({ company: "", role: "", startDate: "2022-01-01T00:00:00.000Z", isCurrent: true, description: "", link: "" });
      setSaveMessage("Section 3 (Experience) added!");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  // Seeker Section 4: Add Portfolio
  const handleAddPortfolio = async () => {
    if (!newPort.url) return;
    const res = await api.seekers.addPortfolio(newPort);
    if (res.success && res.data) {
      setPortfolios([res.data, ...portfolios]);
      setNewPort({ platform: "GitHub", url: "https://github.com/", title: "" });
      setSaveMessage("Section 4 (Portfolio) added with auto-detected tech stack!");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  // Seeker Section 5: Save Bio
  const handleSaveBio = async () => {
    const res = await api.seekers.updateSocialsAndBio({ bio });
    if (res.success) {
      setSaveMessage("Section 5 (Bio & Socials) updated!");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  // Availability Toggle
  const handleAvailabilityToggle = async (status: string) => {
    setAvailability(status);
    await api.seekers.updateAvailability(status as any);
  };

  // Alert Settings
  const handleSaveAlerts = async () => {
    const res = await api.seekers.updateAlertSettings({
      alertFrequencyMaxPerWeek: alertCap,
      alertsPaused,
    });
    if (res.success) {
      setSaveMessage("Alert settings saved (Capped at 3/week)!");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  // Recruiter: Post Job
  const handleCreateJob = async () => {
    if (!newJob.title || !newJob.categoryId) return;
    
    // Pick first 2 skills from taxonomy for demo
    const skillsRes = await api.taxonomy.getSkills();
    const reqSkills = (skillsRes.data?.all || []).slice(0, 2).map((s: any) => s.id);

    const res = await api.providers.createJob({
      ...newJob,
      requiredSkillIds: reqSkills,
      preferredSkillIds: [],
    });

    if (res.success) {
      setShowPostJob(false);
      loadProviderJobs();
      alert("Job posted! Matching background worker enqueued and candidate match alerts dispatched.");
    }
  };

  // Recruiter: Assign Task to Candidate
  const handleAssignTask = async () => {
    if (!taskModalCandidate) return;

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + taskForm.deadlineDays);

    const res = await api.providers.assignTask(taskModalCandidate.id, {
      taskType: taskForm.taskType,
      title: taskForm.title || "Technical Challenge Evaluation",
      instructions: taskForm.instructions || "Implement the solution within the deadline and submit repository link.",
      deadline: deadline.toISOString(),
    });

    if (res.success) {
      setTaskModalCandidate(null);
      if (selectedJobId) loadPipeline(selectedJobId);
      alert("Task assigned and notification email dispatched to candidate!");
    }
  };

  const availabilityMap: Record<string, { label: string; color: string; badge: string }> = {
    ACTIVELY_LOOKING: { label: "Actively Looking", color: "text-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    OPEN_TO_OPPORTUNITIES: { label: "Open to Opportunities", color: "text-amber-500", badge: "bg-amber-50 text-amber-700 border-amber-200" },
    NOT_LOOKING: { label: "Not Looking", color: "text-rose-500", badge: "bg-rose-50 text-rose-700 border-rose-200" },
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col text-slate-900 pt-20">
      
      {/* Top Banner Bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-white py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* User Info */}
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border border-slate-700">
              <AvatarImage src={seekerProfile?.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&q=80"} />
              <AvatarFallback className="bg-indigo-600 text-white font-bold">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : "SK"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">{user?.name || identity.fullName || "Verified User"}</span>
                <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]">
                  Verified Account
                </Badge>
              </div>
              <span className="text-xs text-slate-400 font-mono">{user?.email || "user@slotmyinterview.com"}</span>
            </div>
          </div>

          {/* Role Mode Switcher (Employee vs Employer) */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <span className="text-xs font-semibold text-slate-400 px-2">Role Mode:</span>
            <button
              onClick={() => { setRoleMode("employee"); setActiveTab("overview"); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                roleMode === "employee" 
                  ? "bg-[#6B47ED] text-white shadow-md" 
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Job Seeker (5 Sections)</span>
            </button>

            <button
              onClick={() => { setRoleMode("employer"); setActiveTab("kanban"); loadProviderJobs(); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                roleMode === "employer" 
                  ? "bg-[#6B47ED] text-white shadow-md" 
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Job Provider (Kanban Pipeline)</span>
            </button>
          </div>

          <Button onClick={handleLogout} variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800 text-xs">
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            Sign Out
          </Button>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col md:flex-row gap-8">
        
        {/* Left Navigation */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-3">
          
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-2 font-mono">
              {roleMode === "employee" ? "Domain One: Seeker" : "Domain Two: Provider"}
            </span>
            
            <nav className="flex flex-col gap-1">
              {roleMode === "employee" ? (
                <>
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === "overview" ? "bg-[#6B47ED] text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Overview & Score</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("section1")}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === "section1" ? "bg-[#6B47ED] text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5" />
                      <span>1. Identity & Photo</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("section2")}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === "section2" ? "bg-[#6B47ED] text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>2. Skill Tag Cloud</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("section3")}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === "section3" ? "bg-[#6B47ED] text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>3. Experience</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("section4")}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === "section4" ? "bg-[#6B47ED] text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>4. Portfolio & Tech</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("section5")}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === "section5" ? "bg-[#6B47ED] text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5" />
                      <span>5. Socials & Bio</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("alerts")}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === "alerts" ? "bg-[#6B47ED] text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Alert Settings (Cap 3/w)</span>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setActiveTab("kanban")}
                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === "kanban" ? "bg-[#6B47ED] text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Kanban Pipeline</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("post-job")}
                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === "post-job" ? "bg-[#6B47ED] text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      <span>Post a Job & Match</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("scheduler")}
                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === "scheduler" ? "bg-[#6B47ED] text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Interview Slots</span>
                    </div>
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Vanity Profile Link Box */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-4 rounded-2xl text-white shadow-md flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-indigo-300 font-bold uppercase">Public Profile URL</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="bg-white/10 p-2 rounded-xl flex items-center justify-between border border-white/10 text-xs font-mono">
              <span className="truncate text-slate-200">/u/{seekerProfile?.username || "sunil-kumar-pokkalla"}</span>
              <Link href={`/u/${seekerProfile?.username || "sunil-kumar-pokkalla"}`} target="_blank" className="text-indigo-300 hover:text-white ml-2">
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Recruiters can view and filter your public profile with live availability state.
            </p>
          </div>

        </aside>

        {/* Right Content Area */}
        <main className="flex-1 space-y-6">
          
          {saveMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {saveMessage}
            </div>
          )}

          {/* ========================================================
              SEEKER: OVERVIEW TAB
          ======================================================== */}
          {roleMode === "employee" && activeTab === "overview" && (
            <div className="space-y-6">
              
              {/* Availability Indicator & 3-State Toggle */}
              <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${availabilityMap[availability]?.color.replace("text-", "bg-")} animate-ping`} />
                        Availability State Toggle
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Visible on your public vanity profile <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">/u/{seekerProfile?.username || "username"}</code>
                      </p>
                    </div>

                    {/* 3 States Toggle */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl text-xs font-bold">
                      <button
                        onClick={() => handleAvailabilityToggle("ACTIVELY_LOOKING")}
                        className={`px-3 py-1.5 rounded-lg transition-all ${
                          availability === "ACTIVELY_LOOKING" 
                            ? "bg-emerald-600 text-white shadow-sm" 
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        🟢 Green: Actively Looking
                      </button>
                      <button
                        onClick={() => handleAvailabilityToggle("OPEN_TO_OPPORTUNITIES")}
                        className={`px-3 py-1.5 rounded-lg transition-all ${
                          availability === "OPEN_TO_OPPORTUNITIES" 
                            ? "bg-amber-500 text-white shadow-sm" 
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        🟠 Orange: Open
                      </button>
                      <button
                        onClick={() => handleAvailabilityToggle("NOT_LOOKING")}
                        className={`px-3 py-1.5 rounded-lg transition-all ${
                          availability === "NOT_LOOKING" 
                            ? "bg-rose-600 text-white shadow-sm" 
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        🔴 Red: Not Looking
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Composite Talent Score Card */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-lg border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                      Composite Talent Score (Domain Three)
                    </h2>
                    <p className="text-xs text-slate-400">Deterministic auto-computed score synthesized from 4 pillars</p>
                  </div>
                  <div className="text-3xl font-black text-amber-400">
                    {seekerProfile?.compositeScore || 96.5} <span className="text-xs font-normal text-slate-400">/ 100</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700">
                    <div className="text-[11px] text-slate-400">GitHub Quality (35%)</div>
                    <div className="text-xl font-bold text-emerald-400">{seekerProfile?.githubScore || 98.0}%</div>
                  </div>
                  <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700">
                    <div className="text-[11px] text-slate-400">Assessments (25%)</div>
                    <div className="text-xl font-bold text-indigo-400">{seekerProfile?.assessmentScore || 95.0}%</div>
                  </div>
                  <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700">
                    <div className="text-[11px] text-slate-400">Completeness (25%)</div>
                    <div className="text-xl font-bold text-sky-400">{seekerProfile?.completenessScore || 100.0}%</div>
                  </div>
                  <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700">
                    <div className="text-[11px] text-slate-400">Endorsements (15%)</div>
                    <div className="text-xl font-bold text-purple-400">{seekerProfile?.endorsementScore || 90.0}%</div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              SEEKER: SECTION 1 IDENTITY
          ======================================================== */}
          {roleMode === "employee" && activeTab === "section1" && (
            <Card className="bg-white border-slate-200 rounded-2xl shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-base font-bold text-slate-900">Section 1: Identity & Professional Headline</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Full Name</label>
                    <Input 
                      value={identity.fullName} 
                      onChange={(e) => setIdentity({ ...identity, fullName: e.target.value })} 
                      className="text-xs h-10" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Work Authorization Type</label>
                    <Input 
                      value={identity.workAuthType} 
                      onChange={(e) => setIdentity({ ...identity, workAuthType: e.target.value })} 
                      className="text-xs h-10" 
                      placeholder="US Citizen, Green Card, H1B, CPT/OPT" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">One-Line Headline</label>
                  <Input 
                    value={identity.headline} 
                    onChange={(e) => setIdentity({ ...identity, headline: e.target.value })} 
                    className="text-xs h-10" 
                    placeholder="e.g. Senior Frontend Architect & UI/UX Engineer" 
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Location</label>
                  <Input 
                    value={identity.location} 
                    onChange={(e) => setIdentity({ ...identity, location: e.target.value })} 
                    className="text-xs h-10" 
                    placeholder="San Francisco, CA or Remote" 
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Photo URL (Cloud Storage)</label>
                  <Input 
                    value={identity.photoUrl} 
                    onChange={(e) => setIdentity({ ...identity, photoUrl: e.target.value })} 
                    className="text-xs h-10 font-mono" 
                    placeholder="https://..." 
                  />
                </div>

                <Button onClick={handleSaveIdentity} className="bg-[#6B47ED] text-white text-xs font-bold rounded-xl mt-2">
                  Save Identity
                </Button>
              </CardContent>
            </Card>
          )}

          {/* ========================================================
              SEEKER: SECTION 2 SKILLS
          ======================================================== */}
          {roleMode === "employee" && activeTab === "section2" && (
            <Card className="bg-white border-slate-200 rounded-2xl shadow-sm">
              <CardContent className="p-6 space-y-5">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Section 2: Technical Skill Cloud & Non-Technical List</h2>
                  <p className="text-xs text-slate-500">Grouped by category: Languages, Frameworks, Cloud, Databases, DevOps</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Technical Skills Tag Cloud</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((s) => (
                      <span key={s} className="px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                        {s}
                        <button onClick={() => setSelectedSkills(selectedSkills.filter(x => x !== s))} className="hover:text-red-500">
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Non-Technical Skills (Free-text list)</h3>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {nonTechSkills.map((nts) => (
                      <span key={nts} className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
                        {nts}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add soft skill (e.g. Design Systems, Mentorship, Sprint Planning)..." 
                      value={newNonTechInput}
                      onChange={(e) => setNewNonTechInput(e.target.value)}
                      className="text-xs h-10 max-w-md"
                    />
                    <Button onClick={handleAddNonTech} variant="outline" size="sm" className="text-xs h-10">Add</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ========================================================
              SEEKER: SECTION 3 EXPERIENCE
          ======================================================== */}
          {roleMode === "employee" && activeTab === "section3" && (
            <Card className="bg-white border-slate-200 rounded-2xl shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Section 3: Repeatable Experience Entries</h2>
                  <p className="text-xs text-slate-500">Company, role, dates, description, and optional link</p>
                </div>

                {/* Existing entries */}
                <div className="space-y-3">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between">
                      <div>
                        <div className="font-bold text-sm text-slate-900">{exp.role} &bull; <span className="text-indigo-600">{exp.company}</span></div>
                        <p className="text-xs text-slate-600 mt-1">{exp.description}</p>
                        {exp.link && <a href={exp.link} target="_blank" className="text-[11px] text-indigo-500 hover:underline mt-1 block">Project link: {exp.link}</a>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Entry Form */}
                <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-white space-y-3">
                  <h3 className="text-xs font-bold text-slate-700">Add Work Experience</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Company Name" value={newExp.company} onChange={(e) => setNewExp({ ...newExp, company: e.target.value })} className="text-xs h-9" />
                    <Input placeholder="Role Title" value={newExp.role} onChange={(e) => setNewExp({ ...newExp, role: e.target.value })} className="text-xs h-9" />
                  </div>
                  <Input placeholder="Description of architectural achievements..." value={newExp.description} onChange={(e) => setNewExp({ ...newExp, description: e.target.value })} className="text-xs h-9" />
                  <Input placeholder="Optional project link (https://...)" value={newExp.link} onChange={(e) => setNewExp({ ...newExp, link: e.target.value })} className="text-xs h-9" />
                  <Button onClick={handleAddExperience} size="sm" className="bg-[#6B47ED] text-white text-xs">Add Experience Entry</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ========================================================
              SEEKER: SECTION 4 PORTFOLIO
          ======================================================== */}
          {roleMode === "employee" && activeTab === "section4" && (
            <Card className="bg-white border-slate-200 rounded-2xl shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Section 4: Portfolio & Auto-Detected Technology</h2>
                  <p className="text-xs text-slate-500">GitHub, Behance, Dribbble, personal site, and other links auto-grouped by detected technology</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {portfolios.map((port) => (
                    <div key={port.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                        <span>{port.platform}</span>
                        <a href={port.url} target="_blank" className="text-indigo-600 hover:underline">Visit</a>
                      </div>
                      <div className="text-sm font-bold text-slate-900">{port.title || port.url}</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(port.detectedTechStack || []).map((tech: string) => (
                          <span key={tech} className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Portfolio */}
                <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-white space-y-3">
                  <h3 className="text-xs font-bold text-slate-700">Add Portfolio Item</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <select 
                      value={newPort.platform} 
                      onChange={(e) => setNewPort({ ...newPort, platform: e.target.value })}
                      className="h-9 px-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold"
                    >
                      <option value="GitHub">GitHub</option>
                      <option value="Behance">Behance</option>
                      <option value="Dribbble">Dribbble</option>
                      <option value="Personal">Personal Website</option>
                      <option value="Other">Other</option>
                    </select>
                    <Input placeholder="Portfolio Title" value={newPort.title} onChange={(e) => setNewPort({ ...newPort, title: e.target.value })} className="text-xs h-9" />
                  </div>
                  <Input placeholder="URL (e.g. https://github.com/username/repo)" value={newPort.url} onChange={(e) => setNewPort({ ...newPort, url: e.target.value })} className="text-xs h-9" />
                  <Button onClick={handleAddPortfolio} size="sm" className="bg-[#6B47ED] text-white text-xs">Add Portfolio & Auto-Detect Stack</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ========================================================
              SEEKER: SECTION 5 BIO & SOCIALS
          ======================================================== */}
          {roleMode === "employee" && activeTab === "section5" && (
            <Card className="bg-white border-slate-200 rounded-2xl shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-base font-bold text-slate-900">Section 5: Social Profiles and Short Summary Bio</h2>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Short Summary Bio</label>
                  <textarea 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    rows={5}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Write a short summary bio highlighting your technical background and engineering philosophy..."
                  />
                </div>
                <Button onClick={handleSaveBio} className="bg-[#6B47ED] text-white text-xs font-bold rounded-xl">Save Bio</Button>
              </CardContent>
            </Card>
          )}

          {/* ========================================================
              SEEKER: ALERT SETTINGS (CAP 3/WEEK)
          ======================================================== */}
          {roleMode === "employee" && activeTab === "alerts" && (
            <Card className="bg-white border-slate-200 rounded-2xl shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-base font-bold text-slate-900">Job Match Alert Controls</h2>
                <p className="text-xs text-slate-500">
                  Cap alerts at three per seeker per week and let seekers tune or pause them in settings.
                </p>

                <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Weekly Alert Frequency Cap</div>
                      <div className="text-[11px] text-slate-500">Maximum personalized email match alerts delivered per 7 days</div>
                    </div>
                    <span className="text-sm font-bold text-indigo-600 font-mono">{alertCap} / week (Max 3)</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="3" 
                    value={alertCap} 
                    onChange={(e) => setAlertCap(Number(e.target.value))} 
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Pause All Match Alerts</div>
                    <div className="text-[11px] text-slate-500">Temporarily stop receiving email notifications when matching jobs are posted</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={alertsPaused} 
                    onChange={(e) => setAlertsPaused(e.target.checked)} 
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                <Button onClick={handleSaveAlerts} className="bg-[#6B47ED] text-white text-xs font-bold rounded-xl">Save Alert Preferences</Button>
              </CardContent>
            </Card>
          )}

          {/* ========================================================
              EMPLOYER: KANBAN PIPELINE BOARD
          ======================================================== */}
          {roleMode === "employer" && activeTab === "kanban" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Kanban Candidate Pipeline</h2>
                  <p className="text-xs text-slate-500">Columns: submitted, tasked, shortlisted, interviewed, offered, rejected</p>
                </div>
                <div className="flex items-center gap-2">
                  <select 
                    value={selectedJobId} 
                    onChange={(e) => { setSelectedJobId(e.target.value); loadPipeline(e.target.value); }}
                    className="h-9 px-3 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                  >
                    {providerJobs.map((j) => (
                      <option key={j.id} value={j.id}>{j.title}</option>
                    ))}
                  </select>
                  <Button onClick={() => setShowPostJob(true)} size="sm" className="bg-[#6B47ED] text-white text-xs rounded-xl flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Post Job
                  </Button>
                </div>
              </div>

              {/* 6 Kanban Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-4">
                {["SUBMITTED", "TASKED", "SHORTLISTED", "INTERVIEWED", "OFFERED", "REJECTED"].map((stage) => {
                  const colData = kanbanBoard.find((c) => c.stage === stage) || { submissions: [] };
                  const count = colData.submissions?.length || 0;

                  return (
                    <div key={stage} className="bg-slate-100/80 p-3 rounded-2xl border border-slate-200/90 flex flex-col min-h-[380px]">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
                        <span className="text-[11px] font-extrabold text-slate-700 tracking-wider font-mono">
                          {stage}
                        </span>
                        <Badge className="bg-white border-slate-200 text-slate-700 text-[10px] px-1.5 py-0">
                          {count}
                        </Badge>
                      </div>

                      <div className="space-y-2.5 flex-1">
                        {(colData.submissions || []).map((sub: any) => (
                          <div key={sub.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 transition-all space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900">{sub.seeker?.fullName || "Candidate"}</span>
                              <span className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                {sub.seeker?.compositeScore || 95}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-500 line-clamp-1">{sub.seeker?.headline || "Software Engineer"}</p>

                            {/* Task status indicator if in TASKED */}
                            {stage === "TASKED" && (
                              <div className="pt-1 border-t border-slate-100 flex flex-col gap-1">
                                <Button 
                                  onClick={() => setTaskModalCandidate({ id: sub.id, name: sub.seeker?.fullName })}
                                  size="sm" 
                                  variant="outline" 
                                  className="h-7 text-[10px] font-bold text-indigo-700 border-indigo-200 hover:bg-indigo-50 w-full"
                                >
                                  Assign Challenge / Task
                                </Button>
                              </div>
                            )}

                            {/* Shortlisted indicator */}
                            {stage === "SHORTLISTED" && (
                              <div className="pt-1 text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Ready for Interview Slots
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================
              EMPLOYER: POST JOB TAB
          ======================================================== */}
          {roleMode === "employer" && (activeTab === "post-job" || showPostJob) && (
            <Card className="bg-white border-slate-200 rounded-2xl shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900">Post a Job & Trigger Auto-Match Alerts</h2>
                  {showPostJob && (
                    <button onClick={() => setShowPostJob(false)} className="text-xs text-slate-400 hover:text-slate-600 font-bold">
                      &times; Close
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Job Title</label>
                    <Input 
                      placeholder="e.g. Senior PyTorch / MLOps Infrastructure Engineer" 
                      value={newJob.title}
                      onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      className="text-xs h-10" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Category</label>
                    <select 
                      value={newJob.categoryId} 
                      onChange={(e) => setNewJob({ ...newJob, categoryId: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                    >
                      {allCategories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Salary Min (USD)</label>
                    <Input 
                      type="number"
                      value={newJob.salaryMin}
                      onChange={(e) => setNewJob({ ...newJob, salaryMin: Number(e.target.value) })}
                      className="text-xs h-10" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Salary Max (USD)</label>
                    <Input 
                      type="number"
                      value={newJob.salaryMax}
                      onChange={(e) => setNewJob({ ...newJob, salaryMax: Number(e.target.value) })}
                      className="text-xs h-10" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Work Type</label>
                    <select 
                      value={newJob.workType} 
                      onChange={(e) => setNewJob({ ...newJob, workType: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                    >
                      <option value="FULL_TIME">Full-Time</option>
                      <option value="W2">W-2</option>
                      <option value="CORP_TO_CORP">Corp-to-Corp (C2C)</option>
                      <option value="CORP_TO_H1B">Corp-to-H1B</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Description</label>
                  <textarea 
                    rows={4}
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900" 
                    placeholder="Describe required skills, deliverables, and architecture..."
                  />
                </div>

                <Button onClick={handleCreateJob} className="bg-[#6B47ED] text-white text-xs font-bold rounded-xl">
                  Post Job & Dispatch Match Alerts
                </Button>
              </CardContent>
            </Card>
          )}

          {/* ========================================================
              EMPLOYER: INTERVIEW SCHEDULER TAB
          ======================================================== */}
          {roleMode === "employer" && activeTab === "scheduler" && (
            <Card className="bg-white border-slate-200 rounded-2xl shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-base font-bold text-slate-900">Interview Scheduler for Shortlisted Candidates</h2>
                <p className="text-xs text-slate-500">Define remote (Google Meet/Zoom) or in-person slots for candidates to book</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Format</label>
                    <select 
                      value={newSlot.format} 
                      onChange={(e) => setNewSlot({ ...newSlot, format: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                    >
                      <option value="REMOTE">Remote Video (Google Meet / Zoom)</option>
                      <option value="IN_PERSON">In-Person (HQ Office)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Meeting URL or Physical Location</label>
                    <Input 
                      value={newSlot.location} 
                      onChange={(e) => setNewSlot({ ...newSlot, location: e.target.value })} 
                      className="text-xs h-10" 
                    />
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                  Shortlisted candidates will receive one-click booking links synchronizing into Google Meet and their candidate dashboard.
                </div>
              </CardContent>
            </Card>
          )}

        </main>
      </div>

      {/* Task Assignment Modal from Tasked Column */}
      {taskModalCandidate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Assign Task to {taskModalCandidate.name}</h3>
              <button onClick={() => setTaskModalCandidate(null)} className="text-slate-400 hover:text-slate-600 font-bold">&times;</button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Evaluation Type</label>
              <select 
                value={taskForm.taskType} 
                onChange={(e) => setTaskForm({ ...taskForm, taskType: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
              >
                <option value="TECHNICAL_CHALLENGE">Technical Challenge</option>
                <option value="TAKE_HOME">Take-Home Project</option>
                <option value="VIDEO_INTRODUCTION">Video Introduction</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Task Title</label>
              <Input 
                value={taskForm.title} 
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} 
                placeholder="e.g. PyTorch AST Transformer Optimization"
                className="text-xs h-10"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Instructions</label>
              <textarea 
                rows={4}
                value={taskForm.instructions} 
                onChange={(e) => setTaskForm({ ...taskForm, instructions: e.target.value })} 
                placeholder="Detailed challenge instructions..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button onClick={() => setTaskModalCandidate(null)} variant="outline" size="sm" className="text-xs">Cancel</Button>
              <Button onClick={handleAssignTask} size="sm" className="bg-[#6B47ED] text-white text-xs font-bold">Dispatch Task</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
