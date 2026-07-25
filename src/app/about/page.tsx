export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-32 max-w-4xl">
      <h1 className="text-5xl font-extrabold mb-8 tracking-tight">About SlotMyInterview</h1>
      <div className="prose prose-slate max-w-none prose-lg">
        <p className="text-xl leading-relaxed text-slate-600 mb-8">
          We are building the future of technical hiring by eliminating resumes and replacing them with verified capabilities.
        </p>
        <p className="text-slate-600 mb-6">
          The traditional hiring process is broken. Resumes are full of keywords, not code. Good engineers get filtered out by broken ATS systems, and hiring managers spend countless hours interviewing candidates who look good on paper but can't build.
        </p>
        <p className="text-slate-600 mb-6">
          At SlotMyInterview, we believe your work should speak for itself. By syncing directly with GitHub and validating actual code contributions, we provide employers with a pristine pipeline of elite, verified talent.
        </p>
      </div>
    </div>
  );
}
