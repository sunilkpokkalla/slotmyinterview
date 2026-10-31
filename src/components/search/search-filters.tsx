"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const selectClass = "w-full h-10 px-3 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none";

/** Filter controls write to the URL; the server page re-renders with fresh results. */
export function SearchFilters({ categories }: { categories: { slug: string; name: string }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showFilters, setShowFilters] = useState(() => ["category", "availability", "workAuthType", "minScore", "location", "skill", "hasVideo"].some((k) => searchParams.has(k)));
  const [query, setQuery] = useState(searchParams.get("query") ?? "");

  const setParam = (key: string, value: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (value) sp.set(key, value);
    else sp.delete(key);
    sp.delete("page");
    startTransition(() => router.replace(`${pathname}${sp.size ? `?${sp}` : ""}`, { scroll: false }));
  };

  // Debounce free-text search.
  useEffect(() => {
    if (query === (searchParams.get("query") ?? "")) return;
    const t = setTimeout(() => setParam("query", query.trim()), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const get = (k: string) => searchParams.get(k) ?? "";

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
          <Input
            aria-label="Search candidates"
            placeholder="Search by name, headline or bio..."
            className="pl-12 h-12 text-base bg-slate-800/90 border-slate-700 text-white placeholder:text-slate-400 rounded-xl"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select aria-label="Sort by" value={get("sortBy") || "compositeScore"} onChange={(e) => setParam("sortBy", e.target.value === "compositeScore" ? "" : e.target.value)} className="h-12 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold">
          <option value="compositeScore">Highest talent score</option>
          <option value="githubScore">Top GitHub activity</option>
          <option value="createdAt">Recently joined</option>
        </select>
        <Button size="lg" onClick={() => setShowFilters((v) => !v)} className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          {showFilters ? "Hide filters" : "Filters"}
        </Button>
      </div>

      {showFilters && (
        <div className="mt-6 p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Filters {isPending && <span className="ml-2 text-indigo-300 normal-case">Updating…</span>}</span>
            <button onClick={() => { setQuery(""); startTransition(() => router.replace(pathname, { scroll: false })); }} className="text-xs text-indigo-400 hover:text-indigo-300 underline font-semibold">
              Reset all
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <label className="text-xs font-semibold text-slate-300">
              <span className="mb-1.5 block">Category</span>
              <select value={get("category")} onChange={(e) => setParam("category", e.target.value)} className={selectClass}>
                <option value="">All categories</option>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </label>
            <label className="text-xs font-semibold text-slate-300">
              <span className="mb-1.5 block">Availability</span>
              <select value={get("availability")} onChange={(e) => setParam("availability", e.target.value)} className={selectClass}>
                <option value="">Any</option>
                <option value="ACTIVELY_LOOKING">Actively looking</option>
                <option value="OPEN_TO_OPPORTUNITIES">Open to opportunities</option>
                <option value="NOT_LOOKING">Not looking</option>
              </select>
            </label>
            <label className="text-xs font-semibold text-slate-300">
              <span className="mb-1.5 block">Work authorization</span>
              <select value={get("workAuthType")} onChange={(e) => setParam("workAuthType", e.target.value)} className={selectClass}>
                <option value="">Any</option>
                <option value="US Citizen">US Citizen</option>
                <option value="Green Card">Green Card</option>
                <option value="H1B">H1B</option>
                <option value="CPT/OPT">CPT / OPT</option>
              </select>
            </label>
            <label className="text-xs font-semibold text-slate-300">
              <span className="mb-1.5 flex justify-between"><span>Min talent score</span><span className="text-amber-400">{get("minScore") || 0}</span></span>
              <input type="range" min="0" max="99" defaultValue={get("minScore") || "0"} onMouseUp={(e) => setParam("minScore", e.currentTarget.value === "0" ? "" : e.currentTarget.value)} onKeyUp={(e) => setParam("minScore", e.currentTarget.value === "0" ? "" : e.currentTarget.value)} onTouchEnd={(e) => setParam("minScore", e.currentTarget.value === "0" ? "" : e.currentTarget.value)} className="w-full accent-indigo-500" />
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="text-xs font-semibold text-slate-300">
              <span className="mb-1.5 block">Location</span>
              <Input defaultValue={get("location")} onBlur={(e) => setParam("location", e.target.value.trim())} onKeyDown={(e) => e.key === "Enter" && setParam("location", e.currentTarget.value.trim())} placeholder="e.g. San Francisco or Remote" className="h-10 text-xs bg-slate-900 border-slate-700 text-white rounded-lg" />
            </label>
            <label className="text-xs font-semibold text-slate-300">
              <span className="mb-1.5 block">Skill</span>
              <Input defaultValue={get("skill")} onBlur={(e) => setParam("skill", e.target.value.trim())} onKeyDown={(e) => e.key === "Enter" && setParam("skill", e.currentTarget.value.trim())} placeholder="e.g. PyTorch, Next.js, Go" className="h-10 text-xs bg-slate-900 border-slate-700 text-white rounded-lg" />
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 sm:pt-6">
              <input type="checkbox" checked={get("hasVideo") === "1"} onChange={(e) => setParam("hasVideo", e.target.checked ? "1" : "")} className="accent-indigo-500" />
              Has a video pitch
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
