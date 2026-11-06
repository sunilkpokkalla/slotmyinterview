"use server";

import { prisma } from "@/lib/server/prisma";
import { z } from "zod";
import crypto from "crypto";

const waitlistSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(80),
  email: z.string().trim().email("Please enter a valid email address").toLowerCase(),
  role: z.enum(["ENGINEER", "EMPLOYER"]).default("ENGINEER"),
  username: z.string().trim().regex(/^[a-zA-Z0-9_-]{3,30}$/, "Handle must be 3-30 letters, numbers, or dashes").optional(),
  companyName: z.string().trim().min(2, "Company name must be at least 2 characters").max(100).optional(),
  refCode: z.string().trim().optional(),
});

export type WaitlistResult = {
  success: boolean;
  error?: string;
  isExisting?: boolean;
  ticket?: {
    id: string;
    fullName: string;
    email: string;
    role: "ENGINEER" | "EMPLOYER";
    username: string | null;
    companyName: string | null;
    referralCode: string;
    position: number;
    totalBehind: number;
    points: number;
    referralCount: number;
    createdAt: string;
  };
};

function generateReferralCode(name: string): string {
  const clean = name.replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase() || "VIP";
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${clean}-${num}`;
}

export async function joinWaitlist(formData: FormData): Promise<WaitlistResult> {
  try {
    const raw = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      role: formData.get("role") || "ENGINEER",
      username: formData.get("username") || undefined,
      companyName: formData.get("companyName") || undefined,
      refCode: formData.get("refCode") || undefined,
    };

    const parsed = waitlistSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid submission" };
    }

    const { fullName, email, role, username, companyName, refCode } = parsed.data;

    // 1. Check if user already registered for waitlist
    try {
      const existing = await prisma.waitlistEntry.findUnique({
        where: { email },
        include: {
          _count: { select: { referrals: true } },
        },
      });

      if (existing) {
        // Calculate queue position: Base offset + count of entries before this one minus points/50
        const beforeCount = await prisma.waitlistEntry.count({
          where: { createdAt: { lt: existing.createdAt } },
        });
        const totalCount = await prisma.waitlistEntry.count();
        const effectivePosition = Math.max(1, 1420 + beforeCount - Math.floor(existing.points / 50));
        const totalBehind = Math.max(14, totalCount - beforeCount + 124);

        return {
          success: true,
          isExisting: true,
          ticket: {
            id: existing.id,
            fullName: existing.fullName,
            email: existing.email,
            role: existing.role as "ENGINEER" | "EMPLOYER",
            username: existing.username,
            companyName: existing.companyName,
            referralCode: existing.referralCode,
            position: effectivePosition,
            totalBehind,
            points: existing.points,
            referralCount: existing._count.referrals,
            createdAt: existing.createdAt.toISOString(),
          },
        };
      }
    } catch (checkErr) {
      console.warn("Database lookup warning during waitlist check:", checkErr);
    }

    // 2. Check if username is already taken by another waitlist entry (if engineer)
    if (role === "ENGINEER" && username) {
      try {
        const usernameTaken = await prisma.waitlistEntry.findFirst({
          where: { username: { equals: username, mode: "insensitive" } },
          select: { id: true },
        });
        if (usernameTaken) {
          return { success: false, error: `The handle /u/${username} is already reserved. Please choose another.` };
        }
      } catch (userErr) {
        console.warn("Username availability check warning:", userErr);
      }
    }

    // 3. Resolve referrer if valid code passed
    let referrerId: string | null = null;
    if (refCode) {
      try {
        const referrer = await prisma.waitlistEntry.findUnique({
          where: { referralCode: refCode },
          select: { id: true },
        });
        if (referrer) {
          referrerId = referrer.id;
          // Award 50 points to referrer for jumping 50 spots
          await prisma.waitlistEntry.update({
            where: { id: referrer.id },
            data: { points: { increment: 50 } },
          });
        }
      } catch (refErr) {
        console.warn("Referrer lookup skipped:", refErr);
      }
    }

    // 4. Generate unique referral code
    let uniqueCode = generateReferralCode(fullName);
    for (let i = 0; i < 5; i++) {
      try {
        const codeExists = await prisma.waitlistEntry.findUnique({
          where: { referralCode: uniqueCode },
          select: { id: true },
        });
        if (!codeExists) break;
        uniqueCode = `${generateReferralCode(fullName)}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
      } catch {
        break;
      }
    }

    // 5. Create Waitlist Entry in Supabase Postgres
    let createdEntry;
    try {
      createdEntry = await prisma.waitlistEntry.create({
        data: {
          fullName,
          email,
          role: role as any,
          username: role === "ENGINEER" ? (username?.toLowerCase() || null) : null,
          companyName: role === "EMPLOYER" ? (companyName || null) : null,
          referralCode: uniqueCode,
          referredById: referrerId,
          points: referrerId ? 50 : 0, // Joining via a link gives you a 50 spot starting boost!
        },
        include: {
          _count: { select: { referrals: true } },
        },
      });
    } catch (createErr) {
      console.error("Waitlist creation failed in DB:", createErr);
      // Fallback optimistic ticket if DB is offline
      const fallbackCode = uniqueCode;
      return {
        success: true,
        ticket: {
          id: `tmp-${Date.now()}`,
          fullName,
          email,
          role,
          username: username || null,
          companyName: companyName || null,
          referralCode: fallbackCode,
          position: 1482,
          totalBehind: 36,
          points: 50,
          referralCount: 0,
          createdAt: new Date().toISOString(),
        },
      };
    }

    // 6. Calculate position & dynamic stats
    const totalCount = await prisma.waitlistEntry.count();
    const position = Math.max(1, 1420 + totalCount - Math.floor(createdEntry.points / 50));
    const totalBehind = 14 + Math.floor(Math.random() * 8);

    return {
      success: true,
      ticket: {
        id: createdEntry.id,
        fullName: createdEntry.fullName,
        email: createdEntry.email,
        role: createdEntry.role as "ENGINEER" | "EMPLOYER",
        username: createdEntry.username,
        companyName: createdEntry.companyName,
        referralCode: createdEntry.referralCode,
        position,
        totalBehind,
        points: createdEntry.points,
        referralCount: createdEntry._count.referrals,
        createdAt: createdEntry.createdAt.toISOString(),
      },
    };
  } catch (err) {
    console.error("Unexpected waitlist join error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Something went wrong. Please try again.",
    };
  }
}

export async function getWaitlistByCode(code: string) {
  try {
    const entry = await prisma.waitlistEntry.findUnique({
      where: { referralCode: code },
      select: {
        fullName: true,
        username: true,
        role: true,
        companyName: true,
        referralCode: true,
        points: true,
        createdAt: true,
        _count: { select: { referrals: true } },
      },
    });
    if (!entry) return null;

    const beforeCount = await prisma.waitlistEntry.count({
      where: { createdAt: { lt: entry.createdAt } },
    });
    const position = Math.max(1, 1420 + beforeCount - Math.floor(entry.points / 50));

    return {
      ...entry,
      position,
      referralCount: entry._count.referrals,
    };
  } catch (err) {
    console.error("Failed to fetch waitlist by code:", err);
    return null;
  }
}
