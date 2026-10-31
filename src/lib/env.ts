// Public values are inlined at build time, so they must be referenced as literal process.env.NEXT_PUBLIC_* expressions.
export const publicEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  videoBucket: process.env.NEXT_PUBLIC_SUPABASE_VIDEO_BUCKET ?? "pitch-videos",
};

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable ${name}`);
  return value;
}

// Server-only secrets are read lazily so a missing optional key never breaks the build.
export const serverEnv = {
  supabaseServiceRoleKey: () => required("SUPABASE_SERVICE_ROLE_KEY"),
  calcomWebhookSecret: () => process.env.CALCOM_WEBHOOK_SECRET ?? "",
  githubToken: () => process.env.GITHUB_API_TOKEN ?? "",
  resendApiKey: () => process.env.RESEND_API_KEY ?? "",
  fromEmail: () => process.env.FROM_EMAIL ?? "SlotMyInterview <no-reply@slotmyinterview.com>",
};
