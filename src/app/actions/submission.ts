"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/server/prisma";
import { requireSeeker } from "@/lib/server/auth";
import { runAction, UserError } from "@/lib/server/action";
import { emails, sendEmail } from "@/lib/server/email";
import { applySchema, bookSlotSchema, submitTaskSchema } from "@/lib/validations";

export async function applyToJob(input: unknown) {
  return runAction(async () => {
    const { seekerId } = await requireSeeker();
    const { jobId, coverNote } = applySchema.parse(input);
    const job = await prisma.job.findFirst({ where: { id: jobId, isActive: true }, select: { id: true } });
    if (!job) throw new UserError("This job is no longer open.");
    await prisma.submission.upsert({
      where: { jobId_seekerId: { jobId, seekerId } },
      update: { coverNote: coverNote || undefined },
      create: { jobId, seekerId, coverNote },
    });
    revalidatePath("/dashboard");
  }, "Application submitted");
}

export async function submitTaskSolution(input: unknown) {
  return runAction(async () => {
    const { seekerId } = await requireSeeker();
    const { taskId, submissionUrl } = submitTaskSchema.parse(input);
    const { count } = await prisma.candidateTask.updateMany({
      where: { id: taskId, submission: { seekerId }, status: { in: ["PENDING", "IN_PROGRESS", "SUBMITTED"] } },
      data: { status: "SUBMITTED", submissionUrl, submittedAt: new Date() },
    });
    if (count === 0) throw new UserError("Task not found or already reviewed.");
    revalidatePath("/dashboard");
  }, "Solution submitted");
}

/**
 * Books an interview slot. The slot is claimed with a conditional update (isBooked = false → true)
 * inside the transaction, so two candidates booking at the same moment cannot both succeed.
 */
export async function bookInterviewSlot(input: unknown) {
  return runAction(async () => {
    const { user, seekerId } = await requireSeeker();
    const { slotId, notes } = bookSlotSchema.parse(input);

    const slot = await prisma.interviewSlot.findUnique({ where: { id: slotId }, include: { job: { include: { provider: true } } } });
    if (!slot || slot.startTime <= new Date()) throw new UserError("This slot is no longer available.");

    const submission = await prisma.submission.findUnique({ where: { jobId_seekerId: { jobId: slot.jobId, seekerId } } });
    if (!submission) throw new UserError("Apply to the job before booking an interview.");
    if (submission.stage !== "SHORTLISTED" && submission.stage !== "INTERVIEWED") {
      throw new UserError("Only shortlisted candidates can book interviews.");
    }

    await prisma.$transaction(async (tx) => {
      const claimed = await tx.interviewSlot.updateMany({ where: { id: slotId, isBooked: false }, data: { isBooked: true } });
      if (claimed.count === 0) throw new UserError("Someone just booked this slot. Please pick another.");
      await tx.interviewBooking.create({ data: { slotId, submissionId: submission.id, notes } });
      await tx.submission.update({ where: { id: submission.id }, data: { stage: "INTERVIEWED" } });
    });

    after(() =>
      sendEmail({
        to: user.email,
        ...emails.interviewBooked({
          recipientName: user.seekerProfile?.fullName ?? "there",
          jobTitle: slot.job.title,
          counterpartyName: slot.job.provider.companyName,
          location: slot.location ?? "Online",
          startTime: slot.startTime,
        }),
      }),
    );
    revalidatePath("/dashboard");
  }, "Interview booked");
}
