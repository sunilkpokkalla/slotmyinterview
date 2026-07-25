"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, GitBranch, Code2, ArrowRight } from "lucide-react";
import Link from "next/link";

const mockCandidates = [
  {
    id: "demo",
    name: "Alex Rivera",
    role: "Senior AI Engineer",
    skills: ["PyTorch", "LLMs", "Rust"],
    location: "San Francisco, CA",
    verified: true,
    github: "arivera-ai"
  },
  {
    id: "demo-2",
    name: "Sarah Chen",
    role: "Machine Learning Researcher",
    skills: ["TensorFlow", "Computer Vision", "Python"],
    location: "London, UK",
    verified: true,
    github: "schen-ml"
  },
  {
    id: "demo-3",
    name: "David Kim",
    role: "MLOps Engineer",
    skills: ["Kubernetes", "Kubeflow", "AWS", "Go"],
    location: "Remote",
    verified: true,
    github: "dkim-ops"
  }
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="min-h-screen bg-background">
      {/* Header / Search Area */}
      <div className="bg-card border-b border-border/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Find Verified AI Talent</h1>
          <p className="text-muted-foreground mb-8">Search by skills, role, or location. All candidates are vetted based on real GitHub work.</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search 'PyTorch', 'Senior Engineer', 'Remote'..." 
                className="pl-10 h-12 text-base bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="lg" className="h-12 w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Results Area */}
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{mockCandidates.length} Candidates Found</h2>
        </div>
        
        <div className="space-y-4">
          {mockCandidates.map((candidate) => (
            <Card key={candidate.id} className="hover:border-primary/50 transition-colors bg-card/50">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                  
                  {/* Left Side: Avatar & Info */}
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16 border-2 border-background">
                      <AvatarImage src={`https://github.com/${candidate.github}.png`} />
                      <AvatarFallback>{candidate.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold">
                          <Link href={`/profile/${candidate.id}`} className="hover:text-primary transition-colors">
                            {candidate.name}
                          </Link>
                        </h3>
                        {candidate.verified && (
                          <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 text-[10px] px-1.5 py-0">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm font-medium mb-3">{candidate.role}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {candidate.location}</div>
                        <div className="flex items-center gap-1"><GitBranch className="w-3 h-3" /> {candidate.github}</div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map(skill => (
                          <Badge key={skill} variant="outline" className="text-xs font-normal">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Side: Actions */}
                  <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                    <Link href={`/profile/${candidate.id}`} className={buttonVariants({ variant: "outline", className: "flex-1 md:flex-none" })}>
                      View Profile
                    </Link>
                    <Link href={`/profile/${candidate.id}`} className={buttonVariants({ className: "flex-1 md:flex-none" })}>
                      Book Slot
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
