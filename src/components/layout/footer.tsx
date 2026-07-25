import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-[#f9fafb] dark:bg-[#0a0a0a] border-t border-border pt-20 pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7140DB] to-[#351478] flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.4" />
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-foreground group-hover:text-[#7140DB] transition-colors">
                SlotMyInterview
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              The verified portfolio and interview marketplace for AI professionals. Hire elite talent based on real code, not resumes.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <a href="#" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-4 h-4 text-foreground" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-4 h-4 text-foreground" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-foreground text-sm tracking-tight">For Candidates</h3>
              <Link href="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Create Profile</Link>
              <Link href="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">GitHub Sync</Link>
              <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Available Roles</Link>
              <Link href="/platform/security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Verification Process</Link>
            </div>
            
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-foreground text-sm tracking-tight">For Employers</h3>
              <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Search Talent</Link>
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/platform/challenges" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Assign Challenges</Link>
              <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Book Interviews</Link>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-foreground text-sm tracking-tight">Resources</h3>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
              <Link href="/platform/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Help Center</Link>
              <Link href="/platform/resources/github-analysis" className="text-sm text-muted-foreground hover:text-foreground transition-colors">API Docs</Link>
              <Link href="/platform/resources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Community</Link>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-foreground text-sm tracking-tight">Company</h3>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
              <Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SlotMyInterview Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
