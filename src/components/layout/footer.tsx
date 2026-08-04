import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-hair bg-ink-0 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-[1.5fr_repeat(4,1fr)] gap-10 mb-12">
          
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7140DB] to-[#4E2A9D] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.4" />
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-bold text-fg-0">SlotMyInterview</span>
            </Link>
            <p className="mt-4 text-[13px] leading-relaxed text-fg-3 font-mono max-w-[240px]">
              Capability-based hiring marketplace for AI professionals. Verify code, skip resumes.
            </p>
          </div>

          {/* Links */}
          <div>
            <h5 className="mb-4 text-[11px] uppercase tracking-[.15em] font-medium font-mono text-fg-3">For Candidates</h5>
            <ul className="flex flex-col gap-2 text-[13px]">
              <li><Link href="/signup" className="text-fg-2 hover:text-fg-0 transition-colors">Create Profile</Link></li>
              <li><Link href="/signup" className="text-fg-2 hover:text-fg-0 transition-colors">GitHub Sync</Link></li>
              <li><Link href="/search" className="text-fg-2 hover:text-fg-0 transition-colors">Roles Directory</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="mb-4 text-[11px] uppercase tracking-[.15em] font-medium font-mono text-fg-3">For Employers</h5>
            <ul className="flex flex-col gap-2 text-[13px]">
              <li><Link href="/search" className="text-fg-2 hover:text-fg-0 transition-colors">Search Talent</Link></li>
              <li><Link href="/pricing" className="text-fg-2 hover:text-fg-0 transition-colors">Pricing Options</Link></li>
              <li><Link href="/platform/challenges" className="text-fg-2 hover:text-fg-0 transition-colors">Vetting Challenges</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="mb-4 text-[11px] uppercase tracking-[.15em] font-medium font-mono text-fg-3">Company</h5>
            <ul className="flex flex-col gap-2 text-[13px]">
              <li><Link href="/about" className="text-fg-2 hover:text-fg-0 transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-fg-2 hover:text-fg-0 transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="text-fg-2 hover:text-fg-0 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="mb-4 text-[11px] uppercase tracking-[.15em] font-medium font-mono text-fg-3">Legal</h5>
            <ul className="flex flex-col gap-2 text-[13px]">
              <li><Link href="/privacy" className="text-fg-2 hover:text-fg-0 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-fg-2 hover:text-fg-0 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-hair flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-fg-3">
          <p>© {new Date().getFullYear()} SlotMyInterview Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>All vetting pipelines operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
