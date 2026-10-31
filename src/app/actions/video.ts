"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/server/prisma";
import { requireSeeker } from "@/lib/server/auth";
import { runAction, UserError } from "@/lib/server/action";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { publicEnv } from "@/lib/env";
import { videoPitchSchema } from "@/lib/validations";
import { VIDEO_MAX_BYTES, VIDEO_MIME_TYPES } from "@/lib/video";

const uploadRequestSchema = z.object({
  contentType: z.enum(VIDEO_MIME_TYPES, { errorMap: () => ({ message: "Upload an MP4, WebM or MOV video." }) }),
  size: z.number().int().positive().max(VIDEO_MAX_BYTES, "Video must be 100 MB or smaller."),
});

const EXT: Record<(typeof VIDEO_MIME_TYPES)[number], string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

/** Returns a one-time signed upload URL for a path inside the caller's own folder. */
export async function createVideoUploadUrl(input: unknown) {
  return runAction(async () => {
    const { user } = await requireSeeker();
    const { contentType } = uploadRequestSchema.parse(input);
    const path = `${user.authUserId}/${crypto.randomUUID()}.${EXT[contentType]}`;
    const { data, error } = await createSupabaseAdminClient().storage.from(publicEnv.videoBucket).createSignedUploadUrl(path);
    if (error || !data) throw new UserError("Could not start the upload. Please try again.");
    return { path: data.path, token: data.token };
  });
}

/** Saves an uploaded pitch to the profile after checking the file belongs to the caller and exists. */
export async function saveVideoPitch(input: unknown) {
  return runAction(async () => {
    const { user, seekerId } = await requireSeeker();
    const { path, durationSec } = videoPitchSchema.parse(input);
    const folder = `${user.authUserId}/`;
    if (!path.startsWith(folder) || path.includes("..")) throw new UserError("Invalid upload.");

    const storage = createSupabaseAdminClient().storage.from(publicEnv.videoBucket);
    const { data: listing } = await storage.list(user.authUserId!, { search: path.slice(folder.length) });
    if (!listing?.some((f) => `${folder}${f.name}` === path)) throw new UserError("Upload not found. Please try again.");

    const previous = await prisma.seekerProfile.findUnique({ where: { id: seekerId }, select: { videoPitchPath: true, username: true } });
    await prisma.seekerProfile.update({
      where: { id: seekerId },
      data: { videoPitchPath: path, videoPitchDurationSec: Math.round(durationSec), videoPitchUpdatedAt: new Date() },
    });
    if (previous?.videoPitchPath && previous.videoPitchPath !== path) await storage.remove([previous.videoPitchPath]);

    revalidatePath("/dashboard");
    if (previous) revalidatePath(`/u/${previous.username}`);
  }, "Video pitch saved");
}

export async function deleteVideoPitch() {
  return runAction(async () => {
    const { seekerId } = await requireSeeker();
    const profile = await prisma.seekerProfile.findUnique({ where: { id: seekerId }, select: { videoPitchPath: true, username: true } });
    if (profile?.videoPitchPath) await createSupabaseAdminClient().storage.from(publicEnv.videoBucket).remove([profile.videoPitchPath]);
    await prisma.seekerProfile.update({
      where: { id: seekerId },
      data: { videoPitchPath: null, videoPitchDurationSec: null, videoPitchUpdatedAt: null },
    });
    revalidatePath("/dashboard");
    if (profile) revalidatePath(`/u/${profile.username}`);
  }, "Video pitch removed");
}
