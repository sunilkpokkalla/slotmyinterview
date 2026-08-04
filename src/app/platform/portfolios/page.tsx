import { CheckCircle2, GitCommit, GitPullRequest } from "lucide-react";

export default function LivingPortfoliosPage() {
  return (
    <div className="min-h-screen bg-ink-0 pt-32 pb-24 border-t border-hair">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="max-w-3xl mx-auto text-center">
          <span className="eyebrow">Cryptographic Passports</span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-fg-0 tracking-tight mb-6 mt-6 leading-tight">
            Replace resumes with proof.<br />
            Meet the <em>Verifiable Skill Passport.</em>
          </h1>
          <p className="text-xl text-fg-2 leading-relaxed mb-10">
            A dynamic, continually updating record of a candidate's actual engineering capabilities, automatically synced with AST codebase analysis and sandbox scores.
          </p>
          <div className="flex justify-center gap-4">
            <button className="btn btn-primary">
              View an Example Passport
            </button>
            <button className="btn btn-ghost">
              Start Vetting Now
            </button>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bezel-outer">
            <div className="bezel-inner h-full">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                <GitCommit className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-fg-0 mb-3">Continuous AST Sync</h3>
              <p className="text-fg-2 text-sm leading-relaxed">
                Every code submission parses live. The platform evaluates codebase structures and updates the passport's structural difficulty score automatically.
              </p>
            </div>
          </div>

          <div className="bezel-outer">
            <div className="bezel-inner h-full">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-fg-0 mb-3">Proven Capabilities</h3>
              <p className="text-fg-2 text-sm leading-relaxed">
                Banish resume exaggerations. If an engineer claims competence in a language, our syntax analyzer maps actual commits to confirm language density.
              </p>
            </div>
          </div>

          <div className="bezel-outer">
            <div className="bezel-inner h-full">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                <GitPullRequest className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-fg-0 mb-3">Trust Score Ledger</h3>
              <p className="text-fg-2 text-sm leading-relaxed">
                Integrates anti-plagiarism metrics, biometric validation signatures, and sandbox scores into a single verifiable trust rating.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
