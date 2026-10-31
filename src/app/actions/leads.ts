"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/server/prisma";
import { requireAdmin } from "@/lib/server/auth";
import { runAction, UserError } from "@/lib/server/action";
import { leadSchema } from "@/lib/validations";

// Basic per-instance throttle so the public form can't be used to flood the table.
const recent = new Map<string, number[]>();
function throttle(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) throw new UserError("Too many requests. Please try again in a minute.");
  hits.push(now);
  recent.set(key, hits);
}

/** Public: homepage email capture. */
export async function submitLead(input: unknown) {
  return runAction(async () => {
    const h = await headers();
    throttle(h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown");
    const { email } = leadSchema.parse(input);
    await prisma.lead.upsert({ where: { email }, update: {}, create: { email } });
  }, "Thanks! We'll be in touch.");
}

export async function deleteLead(id: string) {
  return runAction(async () => {
    await requireAdmin();
    await prisma.lead.deleteMany({ where: { id } });
    revalidatePath("/admin");
  }, "Lead deleted");
}

export async function updateLeadStatus(id: string, status: "NEW" | "CONTACTED" | "QUALIFIED") {
  return runAction(async () => {
    await requireAdmin();
    if (!["NEW", "CONTACTED", "QUALIFIED"].includes(status)) throw new UserError("Invalid status.");
    await prisma.lead.update({ where: { id }, data: { status } });
    revalidatePath("/admin");
  }, "Lead updated");
}
