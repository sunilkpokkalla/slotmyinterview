import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { calWebhookSchema, meetingUrlFrom, verifyCalSignature } from "@/lib/server/calcom";

/**
 * Cal.com webhook for one candidate. Each candidate adds this URL (with their personal secret)
 * under Cal.com → Settings → Developer → Webhooks, so bookings recruiters make show up in both dashboards.
 */
export async function POST(request: NextRequest, ctx: RouteContext<"/api/webhooks/calcom/[seekerId]">) {
  const { seekerId } = await ctx.params;
  const rawBody = await request.text();

  const seeker = await prisma.seekerProfile.findUnique({ where: { id: seekerId }, select: { id: true, calcomWebhookSecret: true } });
  if (!seeker?.calcomWebhookSecret || !verifyCalSignature(rawBody, request.headers.get("x-cal-signature-256"), seeker.calcomWebhookSecret)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let event;
  try {
    event = calWebhookSchema.parse(JSON.parse(rawBody));
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const p = event.payload;
  if (event.triggerEvent === "PING" || !p?.uid) return NextResponse.json({ ok: true });

  if (event.triggerEvent === "BOOKING_CANCELLED") {
    await prisma.calBooking.updateMany({ where: { calUid: p.uid, seekerId }, data: { status: "CANCELLED" } });
    return NextResponse.json({ ok: true });
  }

  if (event.triggerEvent !== "BOOKING_CREATED" && event.triggerEvent !== "BOOKING_RESCHEDULED") {
    return NextResponse.json({ ok: true, ignored: event.triggerEvent });
  }
  if (!p.startTime || !p.endTime || p.attendees.length === 0) return NextResponse.json({ error: "missing fields" }, { status: 400 });

  const attendee = p.attendees[0];
  const recruiter = await prisma.user.findFirst({
    where: { email: attendee.email.toLowerCase(), role: "JOB_PROVIDER" },
    select: { id: true },
  });

  const data = {
    seekerId,
    recruiterUserId: recruiter?.id ?? null,
    attendeeEmail: attendee.email.toLowerCase(),
    attendeeName: attendee.name ?? null,
    title: p.title ?? null,
    startTime: new Date(p.startTime),
    endTime: new Date(p.endTime),
    meetingUrl: meetingUrlFrom(p),
    status: "CONFIRMED" as const,
  };

  await prisma.$transaction([
    ...(p.rescheduleUid ? [prisma.calBooking.updateMany({ where: { calUid: p.rescheduleUid, seekerId }, data: { status: "RESCHEDULED" } })] : []),
    prisma.calBooking.upsert({ where: { calUid: p.uid }, update: data, create: { calUid: p.uid, ...data } }),
  ]);

  return NextResponse.json({ ok: true });
}
