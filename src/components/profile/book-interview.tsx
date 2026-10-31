"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Cal, { getCalApi } from "@calcom/embed-react";
import { CalendarCheck, CalendarDays } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { ProfileViewer } from "./profile-layout";

const NAMESPACE = "smi-book";

/** Inline Cal.com booking widget. Only recruiter accounts can book; the attendee is prefilled with their account email. */
export function BookInterview({ calLink, candidateName, viewer }: { calLink: string; candidateName: string; viewer: ProfileViewer }) {
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    if (!viewer.isRecruiter) return;
    let cancelled = false;
    getCalApi({ namespace: NAMESPACE }).then((cal) => {
      if (cancelled) return;
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
      cal("on", { action: "bookingSuccessful", callback: () => setBooked(true) });
    });
    return () => {
      cancelled = true;
    };
  }, [viewer.isRecruiter]);

  return (
    <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-1">
        <CalendarDays className="w-5 h-5 text-indigo-600" />
        Book an interview with {candidateName}
      </h2>
      <p className="text-sm text-slate-500 mb-6">Pick one of the open slots below. You&apos;ll both get a calendar invite.</p>

      {booked && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
          <CalendarCheck className="w-4 h-4" /> Interview booked. It will appear in your dashboard shortly.
        </div>
      )}

      {viewer.isRecruiter ? (
        <Cal
          namespace={NAMESPACE}
          calLink={calLink}
          className="w-full min-h-[560px] overflow-auto rounded-2xl border border-slate-100"
          config={{ layout: "month_view", name: viewer.name ?? "", email: viewer.email ?? "" }}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center">
          <p className="text-sm text-slate-600 mb-4">
            {viewer.isSignedIn ? "Only recruiter accounts can book interviews." : "Sign in with a recruiter account to see open slots and book."}
          </p>
          {!viewer.isSignedIn && (
            <div className="flex justify-center gap-2">
              <Link href="/login" className={buttonVariants({ variant: "outline" })}>Sign in</Link>
              <Link href="/signup?type=employer" className={buttonVariants()}>Create recruiter account</Link>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
