"use client";

import { useMemo, useState, useTransition } from "react";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { deleteLead, updateLeadStatus } from "@/app/actions/leads";

type Lead = { id: string; email: string; source: string; status: "NEW" | "CONTACTED" | "QUALIFIED"; createdAt: string };

// Prevent spreadsheet formula injection when exporting user-supplied values.
const csvCell = (v: string) => `"${(/^[=+\-@\t\r]/.test(v) ? `'${v}` : v).replace(/"/g, '""')}"`;

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const shown = useMemo(() => leads.filter((l) => l.email.toLowerCase().includes(filter.toLowerCase())), [leads, filter]);

  const act = (fn: () => Promise<{ ok: boolean; error?: string }>) =>
    startTransition(async () => {
      const res = await fn();
      setError(res.ok ? "" : (res.error ?? "Failed"));
    });

  const exportCsv = () => {
    const rows = [["Email", "Source", "Status", "Created"], ...shown.map((l) => [l.email, l.source, l.status, l.createdAt])];
    const blob = new Blob([rows.map((r) => r.map(csvCell).join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "leads.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
      <div className="flex flex-wrap gap-3 justify-between">
        <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter by email" aria-label="Filter leads" className="max-w-sm h-10 text-xs" />
        <Button onClick={exportCsv} variant="outline" className="text-xs"><Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV ({shown.length})</Button>
      </div>
      {error && <p role="alert" className="text-xs font-semibold text-rose-600">{error}</p>}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 uppercase font-mono text-[10px]">
            <tr><th className="p-3">Email</th><th className="p-3">Source</th><th className="p-3">Added</th><th className="p-3">Status</th><th className="p-3 text-right">Delete</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {shown.map((l) => (
              <tr key={l.id}>
                <td className="p-3 font-mono font-bold">{l.email}</td>
                <td className="p-3 text-slate-600">{l.source}</td>
                <td className="p-3 text-slate-500">{new Date(l.createdAt).toLocaleString()}</td>
                <td className="p-3">
                  <NativeSelect value={l.status} disabled={pending} onChange={(e) => act(() => updateLeadStatus(l.id, e.target.value as Lead["status"]))} className="h-8 w-32 text-xs" aria-label="Status">
                    <option value="NEW">New</option><option value="CONTACTED">Contacted</option><option value="QUALIFIED">Qualified</option>
                  </NativeSelect>
                </td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="icon" disabled={pending} onClick={() => act(() => deleteLead(l.id))} aria-label={`Delete ${l.email}`}><Trash2 className="w-4 h-4 text-rose-500" /></Button>
                </td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-400">No leads.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
