"use client";

import { createContext, useCallback, useContext, useState, useTransition, type ReactNode } from "react";
import { CheckCircle2, LogOut, AlertCircle, type LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/actions/auth";
import type { ActionResult } from "@/lib/server/action";

type Flash = { kind: "ok" | "error"; text: string } | null;

const FlashContext = createContext<{
  run: <T>(fn: () => Promise<ActionResult<T>>, onOk?: (data: T) => void) => void;
  pending: boolean;
} | null>(null);

/** Runs a server action, shows its success/error message, and exposes a shared pending state. */
export function useAction() {
  const ctx = useContext(FlashContext);
  if (!ctx) throw new Error("useAction must be used inside DashboardShell");
  return ctx;
}

export type DashboardTab = { id: string; label: string; icon: LucideIcon };

export function DashboardShell({
  name,
  email,
  avatarUrl,
  roleLabel,
  tabs,
  initialTab,
  aside,
  children,
}: {
  name: string;
  email: string;
  avatarUrl?: string | null;
  roleLabel: string;
  tabs: DashboardTab[];
  initialTab?: string;
  aside?: ReactNode;
  children: (activeTab: string) => ReactNode;
}) {
  const [activeTab, setActiveTab] = useState(tabs.some((t) => t.id === initialTab) ? initialTab! : tabs[0].id);
  const [flash, setFlash] = useState<Flash>(null);
  const [pending, startTransition] = useTransition();

  const run = useCallback(<T,>(fn: () => Promise<ActionResult<T>>, onOk?: (data: T) => void) => {
    startTransition(async () => {
      const res = await fn();
      if (res.ok) {
        setFlash(res.message ? { kind: "ok", text: res.message } : null);
        onOk?.(res.data);
      } else {
        setFlash({ kind: "error", text: res.error });
      }
      window.setTimeout(() => setFlash(null), 4000);
    });
  }, []);

  const selectTab = (id: string) => {
    setActiveTab(id);
    setFlash(null);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", id);
    window.history.replaceState(null, "", url);
  };

  return (
    <FlashContext.Provider value={{ run, pending }}>
      <div className="min-h-screen bg-[#f8f9fc] flex flex-col text-slate-900 pt-20">
        <div className="bg-slate-900 border-b border-slate-800 text-white py-3 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-slate-700">
                {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
                <AvatarFallback className="bg-indigo-600 text-white font-bold">{name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{name}</span>
                  <Badge className="bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 text-[10px]">{roleLabel}</Badge>
                </div>
                <span className="text-xs text-slate-400 font-mono">{email}</span>
              </div>
            </div>
            <form action={signOut}>
              <Button type="submit" variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800 text-xs">
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Sign out
              </Button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 shrink-0 flex flex-col gap-3">
            <nav className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1" aria-label="Dashboard sections">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => selectTab(id)}
                  aria-current={activeTab === id ? "page" : undefined}
                  className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === id ? "bg-[#6B47ED] text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
            {aside}
          </aside>

          <main className="flex-1 space-y-6 min-w-0">
            {flash && (
              <div
                role={flash.kind === "error" ? "alert" : "status"}
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                  flash.kind === "ok" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-700"
                }`}
              >
                {flash.kind === "ok" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {flash.text}
              </div>
            )}
            {children(activeTab)}
          </main>
        </div>
      </div>
    </FlashContext.Provider>
  );
}

export function Panel({ title, description, children, actions }: { title: string; description?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block text-xs font-semibold text-slate-700">
      <span className="block mb-1">{label}</span>
      {children}
      {hint && <span className="block mt-1 text-[11px] font-normal text-slate-400">{hint}</span>}
    </label>
  );
}

export const fmtDateTime = (d: Date | string) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(d));
