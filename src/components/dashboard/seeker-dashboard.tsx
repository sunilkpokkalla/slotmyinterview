"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight, Bell, Briefcase, CalendarDays, Code2, FileText, FolderGit2, LayoutDashboard, RefreshCw, Trash2, User, Video,
} from "lucide-react";
import type { getSeekerDashboard, Taxonomy } from "@/lib/server/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { DashboardShell, Field, Panel, fmtDateTime, useAction } from "./shell";
import { VideoPitchUploader } from "./video-pitch-uploader";
import {
  addExperience, addPortfolioLink, deleteExperience, deletePortfolioLink, recalculateScore, updateAlertSettings,
  updateAvailability, updateBioAndSocials, updateCalcomLink, updateIdentity, updateSkills,
} from "@/app/actions/seeker";
import { applyToJob, bookInterviewSlot, submitTaskSolution } from "@/app/actions/submission";

type Data = Awaited<ReturnType<typeof getSeekerDashboard>>;
type Profile = Data["profile"];

const AVAILABILITY = [
  { value: "ACTIVELY_LOOKING", label: "Actively looking", cls: "border-emerald-300 bg-emerald-50 text-emerald-800" },
  { value: "OPEN_TO_OPPORTUNITIES", label: "Open to opportunities", cls: "border-amber-300 bg-amber-50 text-amber-800" },
  { value: "NOT_LOOKING", label: "Not looking", cls: "border-rose-300 bg-rose-50 text-rose-800" },
] as const;

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "video", label: "Video pitch", icon: Video },
  { id: "scheduling", label: "Interview slots", icon: CalendarDays },
  { id: "identity", label: "Profile basics", icon: User },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "portfolio", label: "Portfolio", icon: FolderGit2 },
  { id: "bio", label: "Bio & links", icon: FileText },
  { id: "jobs", label: "Jobs & tasks", icon: Briefcase },
  { id: "alerts", label: "Job alerts", icon: Bell },
];

export function SeekerDashboard({
  data, taxonomy, email, initialTab, webhookUrl,
}: { data: Data; taxonomy: Taxonomy; email: string; initialTab?: string; webhookUrl: string }) {
  const p = data.profile;
  return (
    <DashboardShell
      name={p.fullName}
      email={email}
      avatarUrl={p.photoUrl}
      roleLabel="Candidate"
      tabs={TABS}
      initialTab={initialTab}
      aside={
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-4 rounded-2xl text-white shadow-md flex flex-col gap-2.5">
          <span className="text-[11px] font-mono text-indigo-300 font-bold uppercase">Your public profile</span>
          <div className="bg-white/10 p-2 rounded-xl flex items-center justify-between border border-white/10 text-xs font-mono">
            <span className="truncate text-slate-200">/u/{p.username}</span>
            <Link href={`/u/${p.username}`} target="_blank" className="text-indigo-300 hover:text-white ml-2" aria-label="Open public profile">
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      }
    >
      {(tab) => (
        <>
          {tab === "overview" && <Overview p={p} hasVideo={Boolean(data.videoUrl)} />}
          {tab === "video" && (
            <Panel title="60-second video pitch" description="Recruiters see this at the top of your profile. Introduce yourself, what you build, and what you're looking for.">
              <VideoPitchUploader currentUrl={data.videoUrl} currentDuration={p.videoPitchDurationSec} />
            </Panel>
          )}
          {tab === "scheduling" && <Scheduling p={p} webhookUrl={webhookUrl} />}
          {tab === "identity" && <Identity p={p} />}
          {tab === "skills" && <Skills p={p} taxonomy={taxonomy} />}
          {tab === "experience" && <Experience p={p} />}
          {tab === "portfolio" && <Portfolio p={p} />}
          {tab === "bio" && <Bio p={p} />}
          {tab === "jobs" && <Jobs p={p} openJobs={data.openJobs} />}
          {tab === "alerts" && <Alerts p={p} />}
        </>
      )}
    </DashboardShell>
  );
}

function Overview({ p, hasVideo }: { p: Profile; hasVideo: boolean }) {
  const { run, pending } = useAction();
  const [availability, setAvailability] = useState(p.availability);
  const upcomingSlots = p.submissions.flatMap((s) => s.interviews.filter((i) => i.status === "SCHEDULED" && new Date(i.slot.endTime) > new Date()).map((i) => ({ i, job: s.job })));
  const upcomingCal = p.calBookings.filter((b) => b.status === "CONFIRMED");
  const checklist = [
    { done: hasVideo, label: "Record your 60-second video pitch", tab: "video" },
    { done: Boolean(p.calcomLink), label: "Connect Cal.com so recruiters can book you", tab: "scheduling" },
    { done: p.skills.length >= 3, label: "Add at least 3 skills", tab: "skills" },
    { done: p.experiences.length > 0, label: "Add your experience", tab: "experience" },
  ];

  return (
    <>
      <Panel title="Availability" description="Shown on your public profile and used in recruiter search.">
        <div className="flex flex-wrap gap-2">
          {AVAILABILITY.map((a) => (
            <button
              key={a.value}
              disabled={pending}
              onClick={() => {
                setAvailability(a.value);
                run(() => updateAvailability(a.value));
              }}
              className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${availability === a.value ? a.cls : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </Panel>

      {checklist.some((c) => !c.done) && (
        <Panel title="Get booked faster">
          <ul className="space-y-2 text-sm">
            {checklist.map((c) => (
              <li key={c.label} className={`flex items-center gap-2 ${c.done ? "text-slate-400 line-through" : "text-slate-700"}`}>
                <span className={`w-2 h-2 rounded-full ${c.done ? "bg-emerald-500" : "bg-slate-300"}`} />
                {c.label}
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel
        title="Talent score"
        description={p.lastScoredAt ? `Last updated ${fmtDateTime(p.lastScoredAt)}` : "Not calculated yet"}
        actions={
          <Button variant="outline" size="sm" disabled={pending} onClick={() => run(() => recalculateScore())} className="text-xs">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Recalculate
          </Button>
        }
      >
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          {[
            ["Overall", p.compositeScore],
            ["GitHub", p.githubScore],
            ["Assessments", p.assessmentScore],
            ["Completeness", p.completenessScore],
            ["Endorsements", p.endorsementScore],
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-xl bg-slate-50 border border-slate-200 p-3">
              <div className="text-xl font-extrabold text-slate-900">{Math.round(value as number)}</div>
              <div className="text-[11px] text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Upcoming interviews">
        {upcomingCal.length === 0 && upcomingSlots.length === 0 ? (
          <p className="text-sm text-slate-500">No interviews booked yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {upcomingCal.map((b) => (
              <li key={b.id} className="py-2 flex flex-wrap justify-between gap-2">
                <span><strong>{b.attendeeName ?? b.attendeeEmail}</strong> · {b.title ?? "Interview"}</span>
                <span className="text-slate-500">{fmtDateTime(b.startTime)}{b.meetingUrl && <> · <a className="text-indigo-600 hover:underline" href={b.meetingUrl} target="_blank" rel="noreferrer">Join</a></>}</span>
              </li>
            ))}
            {upcomingSlots.map(({ i, job }) => (
              <li key={i.id} className="py-2 flex flex-wrap justify-between gap-2">
                <span><strong>{job.provider.companyName}</strong> · {job.title}</span>
                <span className="text-slate-500">{fmtDateTime(i.slot.startTime)} · {i.slot.location}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}

function Scheduling({ p, webhookUrl }: { p: Profile; webhookUrl: string }) {
  const { run, pending } = useAction();
  const [link, setLink] = useState(p.calcomLink ?? "");
  return (
    <Panel title="Open interview slots (Cal.com)" description="Recruiters book directly into your Cal.com calendar from your profile.">
      <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-600">
        <li>Create a free account at <a className="text-indigo-600 hover:underline" href="https://cal.com/signup" target="_blank" rel="noreferrer">cal.com</a> and connect your calendar.</li>
        <li>Create an event type (for example &quot;30 min interview&quot;) with the hours you want to offer.</li>
        <li>Paste the event link below.</li>
      </ol>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="cal.com/your-name/30min" className="h-10 text-sm" aria-label="Cal.com event link" />
        <Button disabled={pending} onClick={() => run(() => updateCalcomLink(link))} className="bg-[#6B47ED] text-white text-xs h-10">Save link</Button>
      </div>

      {p.calcomLink && p.calcomWebhookSecret && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
          <p className="font-bold text-slate-800">Optional: show bookings in your dashboard</p>
          <p className="text-slate-600">In Cal.com go to Settings → Developer → Webhooks → New, and enter:</p>
          <Field label="Subscriber URL"><Input readOnly value={webhookUrl} className="h-9 font-mono text-xs" onFocus={(e) => e.currentTarget.select()} /></Field>
          <Field label="Secret"><Input readOnly value={p.calcomWebhookSecret} className="h-9 font-mono text-xs" onFocus={(e) => e.currentTarget.select()} /></Field>
          <p className="text-slate-500">Turn on the Booking created, rescheduled and cancelled triggers. Keep the secret private.</p>
        </div>
      )}
    </Panel>
  );
}

function Identity({ p }: { p: Profile }) {
  const { run, pending } = useAction();
  const [f, setF] = useState({ fullName: p.fullName, headline: p.headline ?? "", location: p.location ?? "", workAuthType: p.workAuthType ?? "", photoUrl: p.photoUrl ?? "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  return (
    <Panel title="Profile basics">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full name"><Input value={f.fullName} onChange={set("fullName")} className="h-10" /></Field>
        <Field label="Headline"><Input value={f.headline} onChange={set("headline")} maxLength={140} placeholder="Senior Backend Engineer" className="h-10" /></Field>
        <Field label="Location"><Input value={f.location} onChange={set("location")} placeholder="Bengaluru, India (Remote)" className="h-10" /></Field>
        <Field label="Work authorization">
          <NativeSelect value={f.workAuthType} onChange={set("workAuthType")} className="h-10">
            <option value="">Prefer not to say</option>
            {["US Citizen", "Green Card", "H1B", "CPT/OPT", "EU Citizen", "Needs sponsorship"].map((o) => <option key={o}>{o}</option>)}
          </NativeSelect>
        </Field>
        <Field label="Photo URL" hint="Link to a square photo (https://…)"><Input value={f.photoUrl} onChange={set("photoUrl")} className="h-10" /></Field>
      </div>
      <Button disabled={pending} onClick={() => run(() => updateIdentity(f))} className="bg-[#6B47ED] text-white text-xs">Save</Button>
    </Panel>
  );
}

function Skills({ p, taxonomy }: { p: Profile; taxonomy: Taxonomy }) {
  const { run, pending } = useAction();
  const [selected, setSelected] = useState<string[]>(p.skills.map((s) => s.skillId));
  const [nonTech, setNonTech] = useState<string[]>(p.nonTechSkills);
  const [draft, setDraft] = useState("");
  const toggle = (id: string) => setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  return (
    <Panel title="Skills" description="Pick the technologies you work with. Recruiters filter by these.">
      {taxonomy.map((cat) => (
        <div key={cat.id}>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">{cat.name}</h3>
          <div className="flex flex-wrap gap-1.5">
            {cat.skills.map((s) => (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                aria-pressed={selected.includes(s.id)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${selected.includes(s.id) ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300"}`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Other skills</h3>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {nonTech.map((s) => (
            <span key={s} className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1">
              {s}
              <button onClick={() => setNonTech(nonTech.filter((x) => x !== s))} aria-label={`Remove ${s}`} className="hover:text-rose-600">&times;</button>
            </span>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const v = draft.trim();
            if (v && !nonTech.includes(v)) setNonTech([...nonTech, v]);
            setDraft("");
          }}
        >
          <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Mentoring, system design, sprint planning…" className="h-10 max-w-md" />
          <Button type="submit" variant="outline" className="h-10 text-xs">Add</Button>
        </form>
      </div>
      <Button disabled={pending} onClick={() => run(() => updateSkills({ skillIds: selected, nonTechSkills: nonTech }))} className="bg-[#6B47ED] text-white text-xs">
        Save skills ({selected.length})
      </Button>
    </Panel>
  );
}

function Experience({ p }: { p: Profile }) {
  const { run, pending } = useAction();
  const empty = { company: "", role: "", startDate: "", endDate: "", isCurrent: true, description: "", link: "" };
  const [f, setF] = useState(empty);
  return (
    <Panel title="Experience">
      <ul className="space-y-3">
        {p.experiences.map((e) => (
          <li key={e.id} className="p-4 rounded-xl border border-slate-200 flex justify-between gap-3">
            <div>
              <div className="font-bold text-sm">{e.role} · {e.company}</div>
              <div className="text-xs text-slate-500">{new Date(e.startDate).getFullYear()} – {e.isCurrent || !e.endDate ? "Present" : new Date(e.endDate).getFullYear()}</div>
              <p className="text-xs text-slate-600 mt-1 whitespace-pre-line">{e.description}</p>
            </div>
            <Button variant="ghost" size="sm" disabled={pending} onClick={() => run(() => deleteExperience(e.id))} aria-label="Delete experience"><Trash2 className="w-4 h-4 text-rose-500" /></Button>
          </li>
        ))}
      </ul>
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Company"><Input value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} className="h-10 bg-white" /></Field>
          <Field label="Role"><Input value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} className="h-10 bg-white" /></Field>
          <Field label="Start date"><Input type="month" value={f.startDate} onChange={(e) => setF({ ...f, startDate: e.target.value })} className="h-10 bg-white" /></Field>
          <Field label="End date"><Input type="month" disabled={f.isCurrent} value={f.endDate} onChange={(e) => setF({ ...f, endDate: e.target.value })} className="h-10 bg-white" /></Field>
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <input type="checkbox" checked={f.isCurrent} onChange={(e) => setF({ ...f, isCurrent: e.target.checked })} /> I currently work here
        </label>
        <Field label="What did you do?"><Textarea rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className="bg-white" /></Field>
        <Field label="Link (optional)"><Input value={f.link} onChange={(e) => setF({ ...f, link: e.target.value })} placeholder="https://" className="h-10 bg-white" /></Field>
        <Button
          disabled={pending}
          onClick={() =>
            run(
              () => addExperience({ ...f, startDate: f.startDate ? `${f.startDate}-01` : "", endDate: f.isCurrent || !f.endDate ? null : `${f.endDate}-01`, link: f.link || null }),
              () => setF(empty),
            )
          }
          className="bg-[#6B47ED] text-white text-xs"
        >
          Add experience
        </Button>
      </div>
    </Panel>
  );
}

function Portfolio({ p }: { p: Profile }) {
  const { run, pending } = useAction();
  const empty = { platform: "GitHub", url: "", title: "" };
  const [f, setF] = useState(empty);
  return (
    <Panel title="Portfolio" description="We detect the tech stack from each link automatically.">
      <div className="grid sm:grid-cols-2 gap-3">
        {p.portfolioLinks.map((l) => (
          <div key={l.id} className="p-4 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-slate-500">{l.platform}</span>
              <Button variant="ghost" size="sm" disabled={pending} onClick={() => run(() => deletePortfolioLink(l.id))} aria-label="Delete link"><Trash2 className="w-4 h-4 text-rose-500" /></Button>
            </div>
            <a href={l.url} target="_blank" rel="noreferrer" className="font-bold text-sm text-slate-900 hover:text-indigo-600 break-all">{l.title || l.url}</a>
            <div className="flex flex-wrap gap-1">{l.detectedTechStack.map((t) => <span key={t} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-medium">{t}</span>)}</div>
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-4 gap-3 items-end p-4 rounded-xl bg-slate-50 border border-slate-200">
        <Field label="Platform">
          <NativeSelect value={f.platform} onChange={(e) => setF({ ...f, platform: e.target.value })} className="h-10 bg-white">
            {["GitHub", "Behance", "Dribbble", "Personal", "Other"].map((o) => <option key={o}>{o}</option>)}
          </NativeSelect>
        </Field>
        <Field label="URL"><Input value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} placeholder="https://github.com/you/project" className="h-10 bg-white" /></Field>
        <Field label="Title"><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className="h-10 bg-white" /></Field>
        <Button disabled={pending} onClick={() => run(() => addPortfolioLink(f), () => setF(empty))} className="bg-[#6B47ED] text-white text-xs h-10">Add link</Button>
      </div>
    </Panel>
  );
}

function Bio({ p }: { p: Profile }) {
  const { run, pending } = useAction();
  const [bio, setBio] = useState(p.bio ?? "");
  const [socials, setSocials] = useState(p.socialProfiles.map((s) => ({ platform: s.platform, url: s.url })));
  return (
    <Panel title="Bio & links">
      <Field label="Bio"><Textarea rows={6} maxLength={2000} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A few sentences about you and the work you want next." /></Field>
      <div className="space-y-2">
        <span className="block text-xs font-semibold text-slate-700">Links</span>
        {socials.map((s, i) => (
          <div key={i} className="flex gap-2">
            <NativeSelect value={s.platform} onChange={(e) => setSocials(socials.map((x, j) => (j === i ? { ...x, platform: e.target.value } : x)))} className="h-10 w-36">
              {["LinkedIn", "GitHub", "Twitter/X", "Website", "YouTube", "Medium"].map((o) => <option key={o}>{o}</option>)}
            </NativeSelect>
            <Input value={s.url} onChange={(e) => setSocials(socials.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))} placeholder="https://" className="h-10" />
            <Button variant="ghost" onClick={() => setSocials(socials.filter((_, j) => j !== i))} aria-label="Remove link"><Trash2 className="w-4 h-4 text-rose-500" /></Button>
          </div>
        ))}
        <Button variant="outline" size="sm" className="text-xs" onClick={() => setSocials([...socials, { platform: "LinkedIn", url: "" }])}>Add link</Button>
      </div>
      <Button disabled={pending} onClick={() => run(() => updateBioAndSocials({ bio, socialProfiles: socials.filter((s) => s.url.trim()) }))} className="bg-[#6B47ED] text-white text-xs">Save</Button>
    </Panel>
  );
}

function Jobs({ p, openJobs }: { p: Profile; openJobs: Data["openJobs"] }) {
  const { run, pending } = useAction();
  const [solution, setSolution] = useState<Record<string, string>>({});
  return (
    <>
      <Panel title="Your applications">
        {p.submissions.length === 0 && <p className="text-sm text-slate-500">You haven&apos;t applied to any jobs yet.</p>}
        <div className="space-y-4">
          {p.submissions.map((s) => (
            <div key={s.id} className="p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex flex-wrap justify-between gap-2">
                <div className="font-bold text-sm">{s.job.title} · {s.job.provider.companyName}</div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100">{s.stage}</span>
              </div>
              {s.taskAssignments.map((t) => (
                <div key={t.id} className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs space-y-2">
                  <div className="flex justify-between"><strong>{t.title}</strong><span>{t.status} · due {fmtDateTime(t.deadline)}</span></div>
                  <p className="text-slate-600 whitespace-pre-line">{t.instructions}</p>
                  {t.feedback && <p className="text-slate-700"><strong>Feedback:</strong> {t.feedback} {t.score != null && `(${t.score}/100)`}</p>}
                  {["PENDING", "IN_PROGRESS", "SUBMITTED"].includes(t.status) && (
                    <div className="flex gap-2">
                      <Input value={solution[t.id] ?? t.submissionUrl ?? ""} onChange={(e) => setSolution({ ...solution, [t.id]: e.target.value })} placeholder="Link to your repo or video" className="h-9 bg-white" />
                      <Button size="sm" disabled={pending} onClick={() => run(() => submitTaskSolution({ taskId: t.id, submissionUrl: solution[t.id] ?? "" }))} className="bg-[#6B47ED] text-white text-xs">Submit</Button>
                    </div>
                  )}
                </div>
              ))}
              {(s.stage === "SHORTLISTED" || s.stage === "INTERVIEWED") && s.job.interviewSlots.length > 0 && (
                <div className="text-xs space-y-2">
                  <div className="font-semibold text-slate-700">Pick an interview slot</div>
                  <div className="flex flex-wrap gap-2">
                    {s.job.interviewSlots.map((slot) => (
                      <Button key={slot.id} size="sm" variant="outline" disabled={pending} onClick={() => run(() => bookInterviewSlot({ slotId: slot.id }))} className="text-xs">
                        {fmtDateTime(slot.startTime)} · {slot.format === "REMOTE" ? "Remote" : "In person"}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Open jobs">
        {openJobs.length === 0 && <p className="text-sm text-slate-500">No new jobs right now.</p>}
        <ul className="divide-y divide-slate-100">
          {openJobs.map((j) => (
            <li key={j.id} className="py-3 flex flex-wrap justify-between items-center gap-2 text-sm">
              <span><strong>{j.title}</strong> · {j.provider.companyName} · {j.location}</span>
              <Button size="sm" disabled={pending} onClick={() => run(() => applyToJob({ jobId: j.id }))} className="bg-[#6B47ED] text-white text-xs">Apply</Button>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}

function Alerts({ p }: { p: Profile }) {
  const { run, pending } = useAction();
  const [cap, setCap] = useState(p.alertFrequencyMaxPerWeek);
  const [paused, setPaused] = useState(p.alertsPaused);
  return (
    <Panel title="Job alerts" description="We email you when a new job matches your skills.">
      <Field label={`Maximum alerts per week: ${cap}`}>
        <input type="range" min={0} max={14} value={cap} onChange={(e) => setCap(Number(e.target.value))} className="w-full max-w-sm accent-indigo-600" />
      </Field>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={paused} onChange={(e) => setPaused(e.target.checked)} /> Pause all alerts</label>
      <Button disabled={pending} onClick={() => run(() => updateAlertSettings({ alertFrequencyMaxPerWeek: cap, alertsPaused: paused }))} className="bg-[#6B47ED] text-white text-xs">Save</Button>
    </Panel>
  );
}
