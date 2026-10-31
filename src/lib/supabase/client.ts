"use client";
import { createBrowserClient } from "@supabase/ssr";
import { publicEnv } from "@/lib/env";

let client: ReturnType<typeof createBrowserClient> | undefined;

export function createSupabaseBrowserClient() {
  client ??= createBrowserClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey);
  return client;
}
