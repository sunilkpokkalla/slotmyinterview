import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { config } from "./env.js";
import { logger } from "./logger.js";

let supabaseClient: SupabaseClient | null = null;

// Initialize Supabase Admin Client using service role key (or anon key as fallback)
const key = config.supabase.serviceRoleKey || config.supabase.anonKey;
if (config.supabase.url && key && !key.includes("your_supabase_")) {
  supabaseClient = createClient(config.supabase.url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  logger.info(`Supabase client initialized for: ${config.supabase.url}`);
} else {
  logger.info("Supabase client initialized in local/offline fallback mode (keys pending)");
}

export const supabase = supabaseClient;

export interface VerifiedAuthUser {
  authUserId: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  provider?: string;
}

/**
 * Verifies a bearer token:
 * 1. Attempts Supabase Auth verification via supabase.auth.getUser(token)
 * 2. If Supabase keys are not set or verification fails, falls back to legacy/local token decoding
 */
export async function verifyToken(token: string): Promise<VerifiedAuthUser | null> {
  // If Supabase client is configured, verify with Supabase Auth API
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.getUser(token);
      if (!error && data?.user) {
        const u = data.user;
        const meta = u.user_metadata || {};
        return {
          authUserId: u.id,
          email: u.email || "",
          fullName: meta.full_name || meta.name || meta.user_name || undefined,
          avatarUrl: meta.avatar_url || meta.picture || undefined,
          provider: u.app_metadata?.provider || "supabase",
        };
      }
    } catch (err: any) {
      logger.warn(`Supabase token verification check: ${err.message}`);
    }
  }

  return null;
}

