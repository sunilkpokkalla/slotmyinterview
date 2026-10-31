import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

/** Cal.com signs the raw request body with HMAC-SHA256 and sends the hex digest in x-cal-signature-256. */
export function verifyCalSignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature || !secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature.trim(), "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

const person = z.object({ email: z.string().email(), name: z.string().optional().nullable() }).passthrough();

export const calWebhookSchema = z.object({
  triggerEvent: z.string(),
  payload: z
    .object({
      uid: z.string().optional(),
      title: z.string().optional().nullable(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      location: z.string().optional().nullable(),
      organizer: person.optional(),
      attendees: z.array(person).optional().default([]),
      rescheduleUid: z.string().optional().nullable(),
      metadata: z.record(z.unknown()).optional().nullable(),
    })
    .passthrough()
    .optional(),
});

export type CalWebhook = z.infer<typeof calWebhookSchema>;

/** Picks a meeting link from the payload when Cal.com provides one. */
export function meetingUrlFrom(payload: NonNullable<CalWebhook["payload"]>) {
  const fromMeta = payload.metadata && typeof payload.metadata.videoCallUrl === "string" ? payload.metadata.videoCallUrl : null;
  const loc = payload.location && /^https?:\/\//.test(payload.location) ? payload.location : null;
  return fromMeta ?? loc;
}
