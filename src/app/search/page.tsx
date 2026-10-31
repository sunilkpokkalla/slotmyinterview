import Link from "next/link";
import { ArrowRight, CalendarDays, Code2, MapPin, Star, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SearchFilters } from "@/components/search/search-filters";
import { searchSchema } from "@/lib/validations";
import { getTaxonomy, searchSeekers } from "@/lib/server/queries";

export const metadata = { title: "Find engineers | SlotMyInterview" };

const AVAILABILITY: Record<string, { label: string; bg: string; dot: string }> = {
  ACTIVELY_LOOKING: { label: "Actively Looking", bg: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  OPEN_TO_OPPORTUNITIES: { label: "Open to Opportunities", bg: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  NOT_LOOKING: { label: "Not Looking", bg: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500" },
};

function pageHref(params: Record<string, string | undefined>, page: number) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v && k !== "page" && sp.set(k, v));
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return qs ? `/search?${qs}` : "/search";
}

export default async function SearchPage(props: PageProps<"/search">) {
  const raw = await props.searchParams;
  const flat = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v || undefined]));
  const parsed = searchSchema.safeParse(flat);
  const params = parsed.success ? parsed.data : searchSchema.parse({});

  const [{ profiles, total, totalPages }, taxonomy] = await Promise.all([searchSeekers(params), getTaxonomy()]);

  return (
    <main className="min-h-screen bg-slate-50 pt-20">
      <div className="bg-slate-900 border-b border-slate-800 py-12 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Find engineers and book interviews</h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Watch 60-second video pitches, check skills and talent scores, and book straight into a candidate&apos;s open slots.
            </p>
          </div>
          <SearchFilters categories={taxonomy.map((c) => ({ slug: c.slug, name: c.name }))} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Candidates</span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">{total} profiles</span>
          </h2>
        </div>

        <div className="space-y-4">
          {profiles.map((candidate) => {
            const avail = AVAILABILITY[candidate.availability] ?? AVAILABILITY.ACTIVELY_LOOKING;
            return (
              <Card key={candidate.id} className="hover:border-indigo-400/80 transition-all bg-white shadow-sm border border-slate-200/80 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">

                    {/* Left: Avatar & Candidate Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="w-16 h-16 rounded-xl border-2 border-indigo-100 shadow-sm shrink-0">
                        <AvatarImage src={candidate.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.fullName)}&background=6366f1&color=fff`} />
                        <AvatarFallback className="bg-indigo-600 text-white font-bold">{candidate.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                            <Link href={`/u/${candidate.username}`}>
                              {candidate.fullName}
                            </Link>
                          </h3>

                          {candidate.hasVideo && (
                            <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px] px-2 py-0.5 font-semibold">
                              <Video className="w-3 h-3 mr-1 inline" /> Video pitch
                            </Badge>
                          )}
                          {candidate.hasCalendar && (
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-2 py-0.5 font-semibold">
                              <CalendarDays className="w-3 h-3 mr-1 inline" /> Open slots
                            </Badge>
                          )}

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
                          {candidate.skills.slice(0, 6).map((s) => (
                            <span key={s} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-100 text-xs font-semibold">
                              {s}
                            </span>
                          ))}
                          {candidate.skills.length > 6 && (
                            <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">+{candidate.skills.length - 6} more</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Composite Talent Score & CTA */}
                    <div className="flex sm:flex-row lg:flex-col items-start lg:items-end justify-between w-full lg:w-auto gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <div className="text-left lg:text-right">
                        <div className="flex items-center lg:justify-end gap-1.5 text-amber-500 font-extrabold text-xl">
                          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                          <span>{candidate.compositeScore.toFixed(1)}</span>
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

          {profiles.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
              <Code2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No candidates match these filters</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Try removing a filter or searching for a different skill.</p>
              <Link href="/search" className="inline-block mt-4 text-sm font-semibold text-indigo-600 hover:underline">Reset filters</Link>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-3 mt-8 text-sm" aria-label="Pagination">
            {params.page > 1 && <Link className="px-3 py-1.5 rounded-lg border bg-white" href={pageHref(flat, params.page - 1)}>Previous</Link>}
            <span className="text-slate-500">Page {params.page} of {totalPages}</span>
            {params.page < totalPages && <Link className="px-3 py-1.5 rounded-lg border bg-white" href={pageHref(flat, params.page + 1)}>Next</Link>}
          </nav>
        )}
      </div>
    </main>
  );
}
