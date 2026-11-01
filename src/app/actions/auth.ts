"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/server/prisma";
import { signInSchema, signUpSchema } from "@/lib/validations";
import { getCurrentUser } from "@/lib/server/auth";
import { publicEnv } from "@/lib/env";

export type AuthFormState = { error?: string; message?: string } | undefined;

function isRedirectError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    typeof (err as { digest?: unknown }).digest === "string" &&
    ((err as { digest: string }).digest.startsWith("NEXT_REDIRECT") ||
     (err as { digest: string }).digest.includes("NEXT_REDIRECT"))
  );
}

/** Only allow same-site relative redirects after login. */
function safeNext(next?: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return "/dashboard";
  return next;
}

async function siteOrigin() {
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto = h.get("x-forwarded-proto") ?? "https";
    return host ? `${proto}://${host}` : publicEnv.siteUrl;
  } catch {
    return publicEnv.siteUrl;
  }
}

function checkSupabaseConfigured() {
  const url = publicEnv.supabaseUrl;
  const key = publicEnv.supabaseAnonKey;
  if (!url || !key || key.includes("your_supabase") || url.includes("your_supabase")) {
    return false;
  }
  return true;
}

export async function signIn(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  try {
    const parsed = signInSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
      next: formData.get("next") ?? undefined,
    });
    if (!parsed.success) return { error: parsed.error.issues[0]?.message };

    if (!checkSupabaseConfigured()) {
      return { 
        error: "Supabase authentication is not configured yet. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Cloudflare environment." 
      };
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({ 
      email: parsed.data.email, 
      password: parsed.data.password 
    });

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        return { error: "Please confirm your email address first. Check your inbox for the confirmation link." };
      }
      if (error.message.toLowerCase().includes("invalid login credentials")) {
        return { error: "Invalid email or password. Please check your credentials and try again." };
      }
      return { error: error.message };
    }

    try {
      await getCurrentUser(); // provision the app account on first login if database is reachable
    } catch (dbErr) {
      console.warn("User account provision warning:", dbErr);
    }

    redirect(safeNext(parsed.data.next));
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("Sign in error:", err);
    return { error: err instanceof Error ? err.message : "An unexpected error occurred during sign in. Please try again." };
  }
}

export async function signUp(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  try {
    const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return { error: parsed.error.issues[0]?.message };
    const data = parsed.data;

    // Check if database is reachable for username availability
    if (data.accountType === "candidate") {
      try {
        const taken = await prisma.seekerProfile.findUnique({ 
          where: { username: data.username.toLowerCase() }, 
          select: { id: true } 
        });
        if (taken) return { error: "That username is taken. Please choose another." };
      } catch (dbErr) {
        console.warn("Database check skipped during signup username validation:", dbErr);
      }
    }

    if (!checkSupabaseConfigured()) {
      return { 
        error: "Supabase authentication is not configured yet. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Cloudflare environment." 
      };
    }

    const metadata =
      data.accountType === "candidate"
        ? { role: "JOB_SEEKER", full_name: data.fullName, username: data.username.toLowerCase() }
        : { role: "JOB_PROVIDER", full_name: data.fullName, company_name: data.companyName, website: data.website };

    const supabase = await createSupabaseServerClient();
    const origin = await siteOrigin();
    const { data: result, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { 
        data: metadata, 
        emailRedirectTo: `${origin}/auth/callback?next=/dashboard` 
      },
    });

    if (error) {
      if (error.message.toLowerCase().includes("user already registered")) {
        return { error: "An account with this email address already exists. Please sign in instead." };
      }
      return { error: error.message };
    }

    // Email confirmation disabled in Supabase → session already active.
    if (result.session) {
      try {
        await getCurrentUser();
      } catch (dbErr) {
        console.warn("User account provision warning:", dbErr);
      }
      redirect("/dashboard");
    }

    return { message: "Check your email to confirm your account, then sign in." };
  } catch (err) {
    if (isRedirectError(err)) throw err;
    console.error("Sign up error:", err);
    return { error: err instanceof Error ? err.message : "An unexpected error occurred during signup. Please try again." };
  }
}

export async function signOut() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.warn("Sign out error:", err);
  }
  redirect("/login");
}
