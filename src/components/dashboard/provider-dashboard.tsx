"use client";

import { useState } from "react";
import Link from "next/link";
import { Building, CalendarDays, Columns3, PlusCircle, Search, Trash2 } from "lucide-react";
import type { getProviderDashboard, Taxonomy } from "@/lib/server/queries";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { DashboardShell, Field, Panel, fmtDateTime, useAction } from "./shell";
import {
  assignTask, createInterviewSlot, createJob, deleteInterviewSlot, reviewTask, updateProviderProfile, updateSubmissionStage,
} from "@/app/actions/provider";

type Data = Awaited<ReturnType<typeof getProviderDashboard>>;
type Job = Data["jobs"][number];
type Submission = Job["submissions"][number];

const STAGES = ["SUBMITTED", "TASKED", "SHORTLISTED", "INTERVIEWED", "OFFERED", "REJECTED"] as const;
const STAGE_LABEL: Record<(typeof STAGES)[number], string> = {
  SUBMITTED: "Applied",
  TASKED: "Task sent",
  SHORTLISTED: "Shortlisted",
  INTERVIEWED: "Interviewing",
  OFFERED: "Offered",
  REJECTED: "Rejected",
};

const TABS = [
  { id: "interviews", label: "Interviews", icon: CalendarDays },
  { id: "pipeline", label: "Pipeline", icon: Columns3 },
  { id: "post-job", label: "Post a job", icon: PlusCircle },
  { id: "slots", label: "Interview slots", icon: CalendarDays },
  { id: "company", label: "Company profile", icon: Building },
];

export function ProviderDashboard({ data, taxonomy, email, initialTab }: { data: Data; taxonomy: Taxonomy; email: string; initialTab?: string }) {
  return (
    <DashboardShell
      name={data.provider.companyName}
      email={email}
      avatarUrl={data.provider.logoUrl}
      roleLabel="Recruiter"
      tabs={TABS}
      initialTab={initialTab}
      aside={
        <Link href="/search" className="bg-gradient-to-br from-slate-900 to-indigo-950 p-4 rounded-2xl text-white shadow-md flex items-center gap-2 text-sm font-semibold hover:opacity-90">
          <Search className="w-4 h-4 text-indigo-300" /> Find candidates to book
        </Link>
      }
    >
      {(tab) => (
        <>
          {tab === "interviews" && <Interviews data={data} />}
          {tab === "pipeline" && <Pipeline jobs={data.jobs} />}
          {tab === "post-job" && <PostJob taxonomy={taxonomy} />}
          {tab === "slots" && <Slots jobs={data.jobs} />}
          {tab === "company" && <Company provider={data.provider} />}
        </>
      )}
    </DashboardShell>
  );
}

function Interviews({ data }: { data: Data }) {
  const slotBookings = data.jobs.flatMap((j) => j.interviewSlots.filter((s) => s.booking).map((s) => ({ s, job: j })));
  const cal = data.calBookings.filter((b) => b.status === "CONFIRMED");
  return (
    <Panel title="Upcoming interviews" description="Interviews you booked on candidates' calendars, plus slots candidates booked for your jobs.">
      {cal.length === 0 && slotBookings.length === 0 ? (
        <div className="text-sm text-slate-500">
          Nothing booked yet. <Link href="/search" className="text-indigo-600 font-semibold hover:underline">Browse candidates</Link> and book from their profile.
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 text-sm">
          {cal.map((b) => (
            <li key={b.id} className="py-2 flex flex-wrap justify-between gap-2">
              <Link href={`/u/${b.seeker.username}`} className="font-semibold hover:text-indigo-600">{b.seeker.fullName}</Link>
              <span className="text-slate-500">{fmtDateTime(b.startTime)}{b.meetingUrl && <> · <a href={b.meetingUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Join</a></>}</span>
            </li>
          ))}
          {slotBookings.map(({ s, job }) => (
            <li key={s.id} className="py-2 flex flex-wrap justify-between gap-2">
              <span><strong>{s.booking!.submission.seeker.fullName}</strong> · {job.title}</span>
              <span className="text-slate-500">{fmtDateTime(s.startTime)} · {s.location}</span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function Pipeline({ jobs }: { jobs: Job[] }) {
  const { run, pending } = useAction();
  const [jobId, setJobId] = useState(jobs[0]?.id ?? "");
  const [taskFor, setTaskFor] = useState<Submission | null>(null);
  const job = jobs.find((j) => j.id === jobId);

  if (jobs.length === 0) return <Panel title="Pipeline"><p className="text-sm text-slate-500">Post a job to start receiving applications.</p></Panel>;

  return (
    <Panel
      title="Pipeline"
      actions={
        <NativeSelect value={jobId} onChange={(e) => setJobId(e.target.value)} className="h-9 w-64" aria-label="Job">
          {jobs.map((j) => <option key={j.id} value={j.id}>{j.title} ({j.submissions.length})</option>)}
        </NativeSelect>
      }
    >
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {STAGES.map((stage) => {
          const subs = job?.submissions.filter((s) => s.stage === stage) ?? [];
          return (
            <div key={stage} className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-600"><span>{STAGE_LABEL[stage]}</span><span>{subs.length}</span></div>
              {subs.map((s) => (
                <div key={s.id} className="bg-white rounded-lg border border-slate-200 p-3 space-y-2 text-xs">
                  <Link href={`/u/${s.seeker.username}`} target="_blank" className="font-bold text-sm hover:text-indigo-600">{s.seeker.fullName}</Link>
                  <div className="text-slate-500">{s.seeker.headline} · score {Math.round(s.seeker.compositeScore)}</div>
                  {s.taskAssignments.map((t) => <TaskRow key={t.id} task={t} />)}
                  <div className="flex gap-1.5">
                    <NativeSelect
                      value={s.stage}
                      disabled={pending}
                      onChange={(e) => run(() => updateSubmissionStage(s.id, e.target.value))}
                      className="h-8 text-xs"
                      aria-label="Move to stage"
                    >
                      {STAGES.map((st) => <option key={st} value={st}>{STAGE_LABEL[st]}</option>)}
                    </NativeSelect>
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => setTaskFor(s)}>Task</Button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      {taskFor && <AssignTaskDialog submission={taskFor} onClose={() => setTaskFor(null)} />}
    </Panel>
  );
}

function TaskRow({ task }: { task: Submission["taskAssignments"][number] }) {
  const { run, pending } = useAction();
  const [score, setScore] = useState(task.score ?? 80);
  return (
    <div className="rounded bg-slate-50 p-2 space-y-1">
      <div className="flex justify-between"><span className="font-semibold">{task.title}</span><span>{task.status}</span></div>
      {task.submissionUrl && <a href={task.submissionUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline break-all">View submission</a>}
      {task.status === "SUBMITTED" && (
        <div className="flex items-center gap-1">
          <Input type="number" min={0} max={100} value={score} onChange={(e) => setScore(Number(e.target.value))} className="h-7 w-16 text-xs" aria-label="Score" />
          <Button size="sm" disabled={pending} className="h-7 text-[11px]" onClick={() => run(() => reviewTask({ taskId: task.id, status: score >= 60 ? "PASSED" : "FAILED", score }))}>Score</Button>
        </div>
      )}
    </div>
  );
}

function AssignTaskDialog({ submission, onClose }: { submission: Submission; onClose: () => void }) {
  const { run, pending } = useAction();
  const [f, setF] = useState({ taskType: "TECHNICAL_CHALLENGE", title: "", instructions: "", deadlineDays: 3 });
  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-label="Assign task">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold">Assign a task to {submission.seeker.fullName}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl" aria-label="Close">&times;</button>
        </div>
        <Field label="Type">
          <NativeSelect value={f.taskType} onChange={(e) => setF({ ...f, taskType: e.target.value })} className="h-10">
            <option value="TECHNICAL_CHALLENGE">Technical challenge</option>
            <option value="TAKE_HOME">Take-home project</option>
            <option value="VIDEO_INTRODUCTION">Video introduction</option>
          </NativeSelect>
        </Field>
        <Field label="Title"><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className="h-10" /></Field>
        <Field label="Instructions"><Textarea rows={4} value={f.instructions} onChange={(e) => setF({ ...f, instructions: e.target.value })} /></Field>
        <Field label="Days to complete"><Input type="number" min={1} max={30} value={f.deadlineDays} onChange={(e) => setF({ ...f, deadlineDays: Number(e.target.value) })} className="h-10 w-24" /></Field>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="text-xs">Cancel</Button>
          <Button disabled={pending} onClick={() => run(() => assignTask({ ...f, submissionId: submission.id }), onClose)} className="bg-[#6B47ED] text-white text-xs">Send task</Button>
        </div>
      </div>
    </div>
  );
}

function PostJob({ taxonomy }: { taxonomy: Taxonomy }) {
  const { run, pending } = useAction();
  const empty = {
    title: "", description: "", categoryId: taxonomy[0]?.id ?? "", requiredSkillIds: [] as string[],
    salaryMin: "", salaryMax: "", location: "", workLocation: "REMOTE", workType: "FULL_TIME",
  };
  const [f, setF] = useState(empty);
  const category = taxonomy.find((c) => c.id === f.categoryId);
  return (
    <Panel title="Post a job" description="Candidates with matching skills get an email alert.">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Job title"><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className="h-10" /></Field>
        <Field label="Location"><Input value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} placeholder="Remote (US)" className="h-10" /></Field>
        <Field label="Work location">
          <NativeSelect value={f.workLocation} onChange={(e) => setF({ ...f, workLocation: e.target.value })} className="h-10">
            <option value="REMOTE">Remote</option><option value="HYBRID">Hybrid</option><option value="ONSITE">On-site</option>
          </NativeSelect>
        </Field>
        <Field label="Employment type">
          <NativeSelect value={f.workType} onChange={(e) => setF({ ...f, workType: e.target.value })} className="h-10">
            <option value="FULL_TIME">Full-time</option><option value="W2">W2 contract</option><option value="CORP_TO_CORP">Corp-to-corp</option><option value="CORP_TO_H1B">Corp-to-H1B</option>
          </NativeSelect>
        </Field>
        <Field label="Salary min (USD)"><Input type="number" value={f.salaryMin} onChange={(e) => setF({ ...f, salaryMin: e.target.value })} className="h-10" /></Field>
        <Field label="Salary max (USD)"><Input type="number" value={f.salaryMax} onChange={(e) => setF({ ...f, salaryMax: e.target.value })} className="h-10" /></Field>
      </div>
      <Field label="Description"><Textarea rows={5} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
      <Field label="Category">
        <NativeSelect value={f.categoryId} onChange={(e) => setF({ ...f, categoryId: e.target.value, requiredSkillIds: [] })} className="h-10 max-w-xs">
          {taxonomy.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </NativeSelect>
      </Field>
      <div>
        <span className="block text-xs font-semibold text-slate-700 mb-2">Required skills</span>
        <div className="flex flex-wrap gap-1.5">
          {taxonomy.flatMap((c) => c.skills).sort((a, b) => Number(category?.skills.some((s) => s.id === b.id)) - Number(category?.skills.some((s) => s.id === a.id))).map((s) => {
            const on = f.requiredSkillIds.includes(s.id);
            return (
              <button key={s.id} aria-pressed={on} onClick={() => setF({ ...f, requiredSkillIds: on ? f.requiredSkillIds.filter((x) => x !== s.id) : [...f.requiredSkillIds, s.id] })}
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${on ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-200 text-slate-700"}`}>
                {s.name}
              </button>
            );
          })}
        </div>
      </div>
      <Button
        disabled={pending}
        onClick={() =>
          run(
            () => createJob({ ...f, salaryMin: f.salaryMin ? Number(f.salaryMin) : null, salaryMax: f.salaryMax ? Number(f.salaryMax) : null }),
            () => setF(empty),
          )
        }
        className="bg-[#6B47ED] text-white text-xs"
      >
        Post job
      </Button>
    </Panel>
  );
}

function Slots({ jobs }: { jobs: Job[] }) {
  const { run, pending } = useAction();
  const [f, setF] = useState({ jobId: jobs[0]?.id ?? "", format: "REMOTE", location: "", startTime: "", durationMin: 30 });
  if (jobs.length === 0) return <Panel title="Interview slots"><p className="text-sm text-slate-500">Post a job first.</p></Panel>;

  const create = () => {
    const start = f.startTime ? new Date(f.startTime) : null;
    const end = start ? new Date(start.getTime() + f.durationMin * 60_000) : null;
    run(() => createInterviewSlot({ jobId: f.jobId, format: f.format, location: f.location, startTime: start?.toISOString(), endTime: end?.toISOString() }));
  };

  return (
    <Panel title="Interview slots for shortlisted applicants" description="Shortlisted applicants can pick one of these from their dashboard.">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Job">
          <NativeSelect value={f.jobId} onChange={(e) => setF({ ...f, jobId: e.target.value })} className="h-10">
            {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
          </NativeSelect>
        </Field>
        <Field label="Format">
          <NativeSelect value={f.format} onChange={(e) => setF({ ...f, format: e.target.value })} className="h-10">
            <option value="REMOTE">Remote</option><option value="IN_PERSON">In person</option>
          </NativeSelect>
        </Field>
        <Field label={f.format === "REMOTE" ? "Meeting link" : "Address"}><Input value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} className="h-10" /></Field>
        <Field label="Start"><Input type="datetime-local" value={f.startTime} onChange={(e) => setF({ ...f, startTime: e.target.value })} className="h-10" /></Field>
        <Field label="Length (minutes)"><Input type="number" min={15} max={240} step={15} value={f.durationMin} onChange={(e) => setF({ ...f, durationMin: Number(e.target.value) })} className="h-10 w-28" /></Field>
      </div>
      <Button disabled={pending} onClick={create} className="bg-[#6B47ED] text-white text-xs">Add slot</Button>

      <ul className="divide-y divide-slate-100 text-sm">
        {jobs.flatMap((j) => j.interviewSlots.map((s) => (
          <li key={s.id} className="py-2 flex flex-wrap justify-between items-center gap-2">
            <span><strong>{j.title}</strong> · {fmtDateTime(s.startTime)} · {s.format === "REMOTE" ? "Remote" : "In person"}</span>
            {s.booking ? (
              <span className="text-emerald-700 text-xs font-semibold">Booked by {s.booking.submission.seeker.fullName}</span>
            ) : (
              <Button variant="ghost" size="sm" disabled={pending} onClick={() => run(() => deleteInterviewSlot(s.id))} aria-label="Delete slot"><Trash2 className="w-4 h-4 text-rose-500" /></Button>
            )}
          </li>
        )))}
      </ul>
    </Panel>
  );
}

function Company({ provider }: { provider: Data["provider"] }) {
  const { run, pending } = useAction();
  const [f, setF] = useState({ companyName: provider.companyName, website: provider.website, description: provider.description, location: provider.location ?? "", logoUrl: provider.logoUrl ?? "" });
  return (
    <Panel title="Company profile">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Company name"><Input value={f.companyName} onChange={(e) => setF({ ...f, companyName: e.target.value })} className="h-10" /></Field>
        <Field label="Website"><Input value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} className="h-10" /></Field>
        <Field label="Location"><Input value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} className="h-10" /></Field>
        <Field label="Logo URL"><Input value={f.logoUrl} onChange={(e) => setF({ ...f, logoUrl: e.target.value })} className="h-10" /></Field>
      </div>
      <Field label="About"><Textarea rows={4} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
      <div className="flex gap-2">
        <Button disabled={pending} onClick={() => run(() => updateProviderProfile(f))} className="bg-[#6B47ED] text-white text-xs">Save</Button>
        <Link href="/search" className={buttonVariants({ variant: "outline", className: "text-xs" })}>Find candidates</Link>
      </div>
    </Panel>
  );
}
