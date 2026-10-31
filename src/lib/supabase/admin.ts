import "server-only";
import { createClient } from "@supabase/supabase-js";
import { publicEnv, serverEnv } from "@/lib/env";

/** Service-role client. Bypasses RLS: only use on the server, after checking the caller's permissions. */
export function createSupabaseAdminClient() {
  return createClient(publicEnv.supabaseUrl, serverEnv.supabaseServiceRoleKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
