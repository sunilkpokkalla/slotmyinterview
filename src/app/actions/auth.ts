"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/server/prisma";
import { signInSchema, signUpSchema } from "@/lib/validations";
import { getCurrentUser } from "@/lib/server/auth";
import { publicEnv } from "@/lib/env";

export type AuthFormState = { error?: string; message?: string } | undefined;

/** Only allow same-site relative redirects after login. */
function safeNext(next?: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return "/dashboard";
  return next;
}

async function siteOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : publicEnv.siteUrl;
}

export async function signIn(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") ?? undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
  if (error) {
    return { error: error.message === "Email not confirmed" ? "Please confirm your email first. Check your inbox." : "Invalid email or password." };
  }

  await getCurrentUser(); // provision the app account on first login
  redirect(safeNext(parsed.data.next));
}

export async function signUp(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const data = parsed.data;

  if (data.accountType === "candidate") {
    const taken = await prisma.seekerProfile.findUnique({ where: { username: data.username.toLowerCase() }, select: { id: true } });
    if (taken) return { error: "That username is taken. Please choose another." };
  }

  const metadata =
    data.accountType === "candidate"
      ? { role: "JOB_SEEKER", full_name: data.fullName, username: data.username.toLowerCase() }
      : { role: "JOB_PROVIDER", full_name: data.fullName, company_name: data.companyName, website: data.website };

  const supabase = await createSupabaseServerClient();
  const { data: result, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: { data: metadata, emailRedirectTo: `${await siteOrigin()}/auth/callback?next=/dashboard` },
  });

  if (error) return { error: error.message };

  // Email confirmation disabled in Supabase → we already have a session.
  if (result.session) {
    await getCurrentUser();
    redirect("/dashboard");
  }

  return { message: "Check your email to confirm your account, then sign in." };
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
