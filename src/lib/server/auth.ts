import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Prisma, Role } from "@prisma/client";
import { prisma } from "./prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export class AuthError extends Error {
  constructor(message: string, public status: 401 | 403 | 404 = 401) {
    super(message);
  }
}

const userInclude = {
  seekerProfile: { select: { id: true, username: true, fullName: true, photoUrl: true } },
  providerProfile: { select: { id: true, companyName: true } },
} satisfies Prisma.UserInclude;

export type AppUser = Prisma.UserGetPayload<{ include: typeof userInclude }>;

function slugifyUsername(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 24) || "engineer";
}

async function uniqueUsername(base: string) {
  const root = slugifyUsername(base);
  for (let i = 0; i < 6; i++) {
    const candidate = i === 0 ? root : `${root}-${Math.floor(1000 + Math.random() * 9000)}`;
    const taken = await prisma.seekerProfile.findUnique({ where: { username: candidate }, select: { id: true } });
    if (!taken) return candidate;
  }
  return `${root}-${crypto.randomUUID().slice(0, 8)}`;
}

/**
 * Creates the app-level account for a Supabase auth user the first time we see them.
 * Role comes from the metadata written at sign-up and is only read here, once; afterwards the
 * database row is the source of truth (users can edit their own Supabase metadata, so it is never trusted later).
 * ADMIN can never be self-assigned.
 */
async function provisionUser(su: SupabaseUser): Promise<AppUser> {
  const email = (su.email ?? "").toLowerCase();
  const meta = (su.user_metadata ?? {}) as Record<string, unknown>;
  const role = meta.role === "JOB_PROVIDER" ? Role.JOB_PROVIDER : Role.JOB_SEEKER;
  const fullName = String(meta.full_name ?? meta.name ?? email.split("@")[0] ?? "New user").slice(0, 120);
  const avatarUrl = typeof meta.avatar_url === "string" ? meta.avatar_url : null;

  // Link a pre-existing row (e.g. seeded data) by email, but only for confirmed emails.
  if (email && su.email_confirmed_at) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && !existing.authUserId) {
      return prisma.user.update({ where: { id: existing.id }, data: { authUserId: su.id, isEmailVerified: true }, include: userInclude });
    }
  }

  const base = {
    authUserId: su.id,
    email,
    role,
    isEmailVerified: Boolean(su.email_confirmed_at),
    avatarUrl,
  };

  if (role === Role.JOB_PROVIDER) {
    return prisma.user.create({
      data: {
        ...base,
        providerProfile: {
          create: {
            companyName: String(meta.company_name ?? fullName).slice(0, 120),
            website: String(meta.website ?? ""),
            description: String(meta.company_description ?? ""),
          },
        },
      },
      include: userInclude,
    });
  }

  const username = await uniqueUsername(String(meta.username ?? email.split("@")[0] ?? fullName));
  return prisma.user.create({
    data: {
      ...base,
      seekerProfile: { create: { username, fullName, photoUrl: avatarUrl, headline: "Software Engineer" } },
    },
    include: userInclude,
  });
}

/** Verified Supabase user for this request (validated against Supabase Auth, not just the cookie). */
export const getAuthUser = cache(async (): Promise<SupabaseUser | null> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
});

/** App user for this request, provisioning the database row on first sign-in. */
export const getCurrentUser = cache(async (): Promise<AppUser | null> => {
  const su = await getAuthUser();
  if (!su) return null;
  const user = await prisma.user.findUnique({ where: { authUserId: su.id }, include: userInclude });
  if (user) return user;
  try {
    return await provisionUser(su);
  } catch (err) {
    // Unique-constraint race (two parallel requests on first login): read the row the other request created.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return prisma.user.findUnique({ where: { authUserId: su.id }, include: userInclude });
    }
    throw err;
  }
});

// ---- Guards for Server Actions / Route Handlers (throw) ----

export async function requireUser(): Promise<AppUser> {
  const user = await getCurrentUser();
  if (!user) throw new AuthError("Please sign in to continue.");
  return user;
}

export async function requireSeeker() {
  const user = await requireUser();
  if (user.role !== Role.JOB_SEEKER || !user.seekerProfile) throw new AuthError("Only candidate accounts can do this.", 403);
  return { user, seekerId: user.seekerProfile.id };
}

export async function requireProvider() {
  const user = await requireUser();
  if (user.role !== Role.JOB_PROVIDER || !user.providerProfile) throw new AuthError("Only recruiter accounts can do this.", 403);
  return { user, providerId: user.providerProfile.id };
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== Role.ADMIN) throw new AuthError("Admins only.", 403);
  return user;
}

// ---- Guards for pages (redirect) ----

export async function requireUserPage(next: string): Promise<AppUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}
