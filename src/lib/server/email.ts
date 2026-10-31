import "server-only";
import { publicEnv, serverEnv } from "@/lib/env";

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function layout(title: string, bodyHtml: string, cta?: { label: string; url: string }) {
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px">
  <h2 style="color:#4f46e5;margin:0 0 16px">SlotMyInterview</h2>
  <h3 style="color:#0f172a;margin:0 0 12px">${escapeHtml(title)}</h3>
  <div style="color:#334155;font-size:15px;line-height:1.6">${bodyHtml}</div>
  ${cta ? `<p style="margin:28px 0"><a href="${encodeURI(cta.url)}" style="background:#4f46e5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">${escapeHtml(cta.label)}</a></p>` : ""}
</div>`;
}

/** Sends via Resend when RESEND_API_KEY is set; otherwise logs in development. Never throws. */
export async function sendEmail(opts: { to: string; subject: string; html: string }): Promise<boolean> {
  const apiKey = serverEnv.resendApiKey();
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") console.info(`[email:dev] to=${opts.to} subject="${opts.subject}"`);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ from: serverEnv.fromEmail(), ...opts }),
    });
    if (!res.ok) console.error("[email] Resend error", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error("[email] delivery failed", err);
    return false;
  }
}

export const emails = {
  jobMatch(p: { seekerName: string; jobTitle: string; companyName: string; location: string; matchedSkills: string[] }) {
    return {
      subject: `New match: ${p.companyName} is hiring a ${p.jobTitle}`,
      html: layout(
        `${p.jobTitle} at ${p.companyName}`,
        `<p>Hi ${escapeHtml(p.seekerName)},</p><p>A new role in ${escapeHtml(p.location)} matches your skills: <strong>${p.matchedSkills.map(escapeHtml).join(", ")}</strong>.</p>
         <p style="font-size:12px;color:#94a3b8">You can change how often you get these alerts in your dashboard.</p>`,
        { label: "Open your dashboard", url: `${publicEnv.siteUrl}/dashboard` },
      ),
    };
  },
  taskAssigned(p: { candidateName: string; jobTitle: string; companyName: string; taskTitle: string; deadline: Date }) {
    return {
      subject: `New task from ${p.companyName}: ${p.taskTitle}`,
      html: layout(
        p.taskTitle,
        `<p>Hi ${escapeHtml(p.candidateName)},</p><p>${escapeHtml(p.companyName)} assigned you a task for <strong>${escapeHtml(p.jobTitle)}</strong>. It is due ${escapeHtml(p.deadline.toUTCString())}.</p>`,
        { label: "View task", url: `${publicEnv.siteUrl}/dashboard` },
      ),
    };
  },
  interviewBooked(p: { recipientName: string; jobTitle: string; counterpartyName: string; location: string; startTime: Date }) {
    return {
      subject: `Interview confirmed: ${p.jobTitle}`,
      html: layout(
        "Interview confirmed",
        `<p>Hi ${escapeHtml(p.recipientName)},</p><p>Your interview for <strong>${escapeHtml(p.jobTitle)}</strong> with ${escapeHtml(p.counterpartyName)} is on ${escapeHtml(p.startTime.toUTCString())}.</p><p>Where: ${escapeHtml(p.location)}</p>`,
      ),
    };
  },
};
