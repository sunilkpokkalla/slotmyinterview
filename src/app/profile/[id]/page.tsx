"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, MapPin, GitBranch, Terminal, Calendar, Code2, Link as LinkIcon, Star, GitPullRequest } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// In a real app, this would be fetched from a DB based on the ID.
const mockProfile = {
  name: "Alex Rivera",
  role: "Senior AI Engineer",
  location: "San Francisco, CA",
  github: "arivera-ai",
  verified: true,
  bio: "AI Engineer specializing in Large Language Models, optimization, and distributed training. Previously built scalable inference engines processing 10M+ reqs/day.",
  skills: ["PyTorch", "LLMs", "Rust", "CUDA", "TensorFlow", "Go", "Kubernetes"],
  repos: [
    { name: "llama-fast-inference", stars: 1205, description: "Highly optimized inference engine for LLaMA models written in Rust.", language: "Rust" },
    { name: "distributed-training-toolkit", stars: 432, description: "Utility functions for multi-node PyTorch training.", language: "Python" }
  ],
  prs: [
    { title: "Optimize matrix multiplication kernel", repo: "huggingface/transformers", status: "Merged", date: "2 weeks ago" },
    { title: "Fix memory leak in distributed dataloader", repo: "pytorch/pytorch", status: "Merged", date: "1 month ago" }
  ]
};

export default function CandidateProfile() {
  const params = useParams();
  
  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl mt-12">
        
        {/* Top Header / Back Button */}
        <div className="mb-6">
          <Link href="/search" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            ← Back to Search
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Header Card */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-[#6B47ED] to-[#9171F8] w-full" />
              <CardContent className="pt-0 relative px-8 pb-8">
                <Avatar className="w-24 h-24 border-4 border-white absolute -top-12 bg-white">
                  <AvatarImage src={`https://github.com/${mockProfile.github}.png`} />
                  <AvatarFallback>{mockProfile.name.substring(0,2)}</AvatarFallback>
                </Avatar>
                
                <div className="mt-16 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-3xl font-extrabold text-slate-900">{mockProfile.name}</h1>
                      {mockProfile.verified && (
                        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                          <ShieldCheck className="w-3 h-3" />
                          Verified
                        </div>
                      )}
                    </div>
                    <p className="text-lg font-medium text-slate-600 mb-3">{mockProfile.role}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {mockProfile.location}</span>
                      <span className="flex items-center gap-1.5"><GitBranch className="w-4 h-4" /> {mockProfile.github}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">About</h3>
                  <p className="text-slate-600 leading-relaxed">{mockProfile.bio}</p>
                </div>

                <div className="mt-8">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Verified Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockProfile.skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm py-1 px-3">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* GitHub Highlights */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GitBranch className="w-5 h-5" /> Open Source Contributions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {/* Repos */}
                  <div className="p-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Top Repositories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockProfile.repos.map(repo => (
                        <div key={repo.name} className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <a href="#" className="font-bold text-[#6B47ED] hover:underline flex items-center gap-1.5">
                              <Code2 className="w-4 h-4" /> {repo.name}
                            </a>
                          </div>
                          <p className="text-sm text-slate-600 mb-4 line-clamp-2">{repo.description}</p>
                          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400" /> {repo.language}</span>
                            <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /> {repo.stars}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* PRs */}
                  <div className="p-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Recent Major PRs</h3>
                    <div className="flex flex-col gap-3">
                      {mockProfile.prs.map((pr, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                          <div className="flex items-start gap-3">
                            <GitPullRequest className="w-5 h-5 text-purple-500 mt-0.5" />
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">{pr.title}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{pr.repo}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-2 sm:mt-0">
                            <Badge variant="outline" className="text-purple-600 bg-purple-50 border-purple-200 text-[10px] uppercase">
                              {pr.status}
                            </Badge>
                            <span className="text-xs font-medium text-slate-400">{pr.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Sidebar / CTA (Right) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 flex flex-col gap-6">
              
              <Card className="border-[#6B47ED]/20 shadow-lg shadow-indigo-100 bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Interview {mockProfile.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Button className="w-full h-12 bg-[#6B47ED] hover:bg-[#5839C7] text-white font-bold text-base shadow-md">
                    Book Interview Slot
                  </Button>
                  <Button variant="outline" className="w-full h-12 font-bold text-slate-700 border-slate-300">
                    <Terminal className="w-4 h-4 mr-2" />
                    Assign Coding Challenge
                  </Button>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500 text-center leading-relaxed">
                      By booking an interview, you agree to our Terms of Service. A credit will be deducted from your account.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm uppercase tracking-wider text-slate-500">Links</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <a href="#" className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#6B47ED] p-2 rounded-md hover:bg-slate-50 transition-colors">
                    <GitBranch className="w-4 h-4" /> github.com/{mockProfile.github}
                  </a>
                  <a href="#" className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#6B47ED] p-2 rounded-md hover:bg-slate-50 transition-colors">
                    <LinkIcon className="w-4 h-4" /> personal-site.dev
                  </a>
                </CardContent>
              </Card>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
