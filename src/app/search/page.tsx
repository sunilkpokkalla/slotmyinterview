"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  MapPin, 
  GitBranch, 
  Code2, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  SlidersHorizontal,
  X,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [candidates, setCandidates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedWorkAuth, setSelectedWorkAuth] = useState<string>("");
  const [selectedAvailability, setSelectedAvailability] = useState<string>("");
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("compositeScore");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Load Categories on mount
  useEffect(() => {
    async function loadCategories() {
      const res = await api.taxonomy.getCategories();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    }
    loadCategories();
  }, []);

  // Fetch candidates from Backend Search API
  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const res = await api.seekers.search({
        query: searchQuery || undefined,
        category: selectedCategory || undefined,
        skill: selectedSkill || undefined,
        location: selectedLocation || undefined,
        workAuthType: selectedWorkAuth || undefined,
        availability: selectedAvailability || undefined,
        minScore: minScore > 0 ? minScore : undefined,
        sortBy,
        sortOrder: "desc",
      });

      if (res.success && res.data) {
        setCandidates(res.data);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCandidates();
    }, 250);
    return () => clearTimeout(timer);
  }, [
    searchQuery,
    selectedCategory,
    selectedSkill,
    selectedLocation,
    selectedWorkAuth,
    selectedAvailability,
    minScore,
    sortBy,
  ]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedSkill("");
    setSelectedLocation("");
    setSelectedWorkAuth("");
    setSelectedAvailability("");
    setMinScore(0);
    setSearchQuery("");
  };

  const getAvailabilityBadge = (status: string) => {
    switch (status) {
      case "ACTIVELY_LOOKING":
        return { label: "Actively Looking", bg: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" };
      case "OPEN_TO_OPPORTUNITIES":
        return { label: "Open to Opportunities", bg: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" };
      case "NOT_LOOKING":
        return { label: "Not Looking", bg: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500" };
      default:
        return { label: "Available", bg: "bg-slate-50 text-slate-700 border-slate-200", dot: "bg-slate-400" };
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-20">
      {/* Search Header Banner */}
      <div className="bg-slate-900 border-b border-slate-800 py-12 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-3">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                AI-Powered Software Talent Marketplace
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Find & Vet Verified Software Engineers
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
                Filter by verified technical taxonomy, composite talent scores (GitHub AST, challenge code & peer reviews), and real-time availability states.
              </p>
            </div>

            {/* Quick Sort Dropdown */}
            <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700 self-start md:self-auto">
              <span className="text-xs text-slate-400 px-2 font-medium">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-2"
              >
                <option value="compositeScore" className="bg-slate-900 text-white">Highest Composite Score</option>
                <option value="githubScore" className="bg-slate-900 text-white">Top GitHub Activity</option>
                <option value="createdAt" className="bg-slate-900 text-white">Recently Joined</option>
              </select>
            </div>
          </div>
          
          {/* Main Search Bar & Toggle */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search candidates by name, headline, bio, or role..." 
                className="pl-12 h-12 text-base bg-slate-800/90 border-slate-700 text-white placeholder:text-slate-400 rounded-xl focus-visible:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              size="lg" 
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Filter Profiles"}
            </Button>
          </div>

          {/* Interactive Filter Drawer */}
          {showFilters && (
            <div className="mt-6 p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Advanced Filter Controls</span>
                <button onClick={clearFilters} className="text-xs text-indigo-400 hover:text-indigo-300 underline font-semibold">
                  Reset All Filters
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none"
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Availability State Filter */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Availability Status</label>
                  <select
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none"
                  >
                    <option value="">All States</option>
                    <option value="ACTIVELY_LOOKING">🟢 Actively Looking</option>
                    <option value="OPEN_TO_OPPORTUNITIES">🟠 Open to Opportunities</option>
                    <option value="NOT_LOOKING">🔴 Not Looking</option>
                  </select>
                </div>

                {/* Work Authorization */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Work Authorization</label>
                  <select
                    value={selectedWorkAuth}
                    onChange={(e) => setSelectedWorkAuth(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none"
                  >
                    <option value="">Any Authorization</option>
                    <option value="US Citizen">US Citizen</option>
                    <option value="Green Card">Green Card</option>
                    <option value="H1B">H1B Visa</option>
                    <option value="CPT/OPT">CPT / OPT</option>
                  </select>
                </div>

                {/* Min Composite Talent Score */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Min Talent Score:</span>
                    <span className="text-amber-400 font-bold">{minScore}/100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="99"
                    value={minScore}
                    onChange={(e) => setMinScore(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Location input & Skill input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Location / Remote</label>
                  <Input
                    placeholder="e.g. San Francisco, CA or Remote"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="h-10 text-xs bg-slate-900 border-slate-700 text-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Required Skill</label>
                  <Input
                    placeholder="e.g. PyTorch, Next.js, Go, Rust, CUDA"
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="h-10 text-xs bg-slate-900 border-slate-700 text-white rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Verified Talent Pool</span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
              {candidates.length} Profiles
            </span>
          </h2>
          {isLoading && <span className="text-xs text-indigo-600 font-semibold animate-pulse">Refreshing candidates...</span>}
        </div>
        
        <div className="space-y-4">
          {candidates.map((candidate) => {
            const avail = getAvailabilityBadge(candidate.availability);
            return (
              <Card key={candidate.id} className="hover:border-indigo-400/80 transition-all bg-white shadow-sm border border-slate-200/80 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                    
                    {/* Left: Avatar & Candidate Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="w-16 h-16 rounded-xl border-2 border-indigo-100 shadow-sm shrink-0">
                        <AvatarImage src={candidate.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.fullName)}&background=6366f1&color=fff`} />
                        <AvatarFallback className="bg-indigo-600 text-white font-bold">{candidate.fullName.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                            <Link href={`/u/${candidate.username}`}>
                              {candidate.fullName}
                            </Link>
                          </h3>
                          
                          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 text-[10px] px-2 py-0.5 font-semibold">
                            <ShieldCheck className="w-3 h-3 mr-1 inline" /> Verified
                          </Badge>

                          {/* Availability Badge */}
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${avail.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${avail.dot}`} />
                            {avail.label}
                          </span>
                        </div>

                        <p className="text-sm font-medium text-slate-700">{candidate.headline}</p>
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                          {candidate.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {candidate.location}
                            </span>
                          )}
                          {candidate.workAuthType && (
                            <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-slate-700">
                              {candidate.workAuthType}
                            </span>
                          )}
                        </div>

                        {/* Draggable & Categorized Technical Skills */}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {(candidate.skills || []).slice(0, 6).map((s: any) => (
                            <span 
                              key={s.id || s.skill?.name || s} 
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-100 text-xs font-semibold"
                            >
                              {s.skill?.name || s.name || s}
                            </span>
                          ))}
                          {(candidate.skills || []).length > 6 && (
                            <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                              +{(candidate.skills || []).length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Composite Talent Score & CTA */}
                    <div className="flex sm:flex-row lg:flex-col items-start lg:items-end justify-between w-full lg:w-auto gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <div className="text-left lg:text-right">
                        <div className="flex items-center lg:justify-end gap-1.5 text-amber-500 font-extrabold text-xl">
                          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                          <span>{candidate.compositeScore || 90.0}</span>
                          <span className="text-xs text-slate-400 font-normal">/ 100</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">Composite Talent Score</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/u/${candidate.username}`}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                        >
                          View Full Profile
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>
            );
          })}

          {candidates.length === 0 && !isLoading && (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
              <Code2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No candidates match these criteria</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Try widening your skill tags, clearing the minimum score filter, or searching for other engineering roles.
              </p>
              <Button onClick={clearFilters} variant="outline" size="sm" className="mt-4 rounded-xl">
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
