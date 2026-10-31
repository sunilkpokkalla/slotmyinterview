import { publicEnv } from "@/lib/env";

export const VIDEO_MAX_SECONDS = 60;
export const VIDEO_MAX_BYTES = 100 * 1024 * 1024; // keep in sync with the bucket limit in supabase/policies.sql
export const VIDEO_MIME_TYPES = ["video/mp4", "video/webm", "video/quicktime"] as const;

export function videoPublicUrl(path: string | null | undefined) {
  if (!path || !publicEnv.supabaseUrl) return null;
  return `${publicEnv.supabaseUrl}/storage/v1/object/public/${publicEnv.videoBucket}/${path.split("/").map(encodeURIComponent).join("/")}`;
}
