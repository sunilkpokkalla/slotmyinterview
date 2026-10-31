"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/server/prisma";
import { requireProvider } from "@/lib/server/auth";
import { runAction, UserError } from "@/lib/server/action";
import { matchAndAlertSeekersForJob } from "@/lib/server/matching";
import { scoringService } from "@/lib/server/scoring";
import { emails, sendEmail } from "@/lib/server/email";
import {
  assignTaskSchema,
  interviewSlotSchema,
  jobSchema,
  pipelineStageSchema,
  providerProfileSchema,
  reviewTaskSchema,
} from "@/lib/validations";

export async function updateProviderProfile(input: unknown) {
  return runAction(async () => {
    const { providerId } = await requireProvider();
    const data = providerProfileSchema.parse(input);
    await prisma.providerProfile.update({
      where: { id: providerId },
      data: { ...data, location: data.location || null, logoUrl: data.logoUrl ?? null },
    });
    revalidatePath("/dashboard");
  }, "Company profile saved");
}

export async function createJob(input: unknown) {
  return runAction(async () => {
    const { providerId } = await requireProvider();
    const data = jobSchema.parse(input);
    const skills = await prisma.skill.count({ where: { id: { in: data.requiredSkillIds } } });
    if (skills !== new Set(data.requiredSkillIds).size) throw new UserError("One or more skills are not recognized.");

    const job = await prisma.job.create({
      data: {
        providerId,
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        salaryMin: data.salaryMin ?? null,
        salaryMax: data.salaryMax ?? null,
        location: data.location,
        workLocation: data.workLocation,
        workType: data.workType,
        requiredSkills: { connect: data.requiredSkillIds.map((id) => ({ id })) },
      },
    });
    after(() => matchAndAlertSeekersForJob(job.id).catch((e) => console.error("[matching]", e)));
    revalidatePath("/dashboard");
    return { id: job.id };
  }, "Job posted. Matching candidates will be notified.");
}

/** Loads a submission only if it belongs to one of the caller's jobs. */
async function ownedSubmission(submissionId: string, providerId: string) {
  const submission = await prisma.submission.findFirst({
    where: { id: submissionId, job: { providerId } },
    include: { job: { include: { provider: true } }, seeker: { include: { user: { select: { email: true } } } } },
  });
  if (!submission) throw new UserError("Candidate not found.");
  return submission;
}

export async function updateSubmissionStage(submissionId: string, stageInput: unknown) {
  return runAction(async () => {
    const { providerId } = await requireProvider();
    const stage = pipelineStageSchema.parse(stageInput);
    await ownedSubmission(submissionId, providerId);
    await prisma.submission.update({ where: { id: submissionId }, data: { stage } });
    revalidatePath("/dashboard");
  }, "Candidate moved");
}

export async function assignTask(input: unknown) {
  return runAction(async () => {
    const { providerId } = await requireProvider();
    const data = assignTaskSchema.parse(input);
    const submission = await ownedSubmission(data.submissionId, providerId);
    const deadline = new Date(Date.now() + data.deadlineDays * 24 * 60 * 60 * 1000);

    await prisma.$transaction([
      prisma.submission.update({ where: { id: submission.id }, data: { stage: "TASKED" } }),
      prisma.candidateTask.create({
        data: { submissionId: submission.id, taskType: data.taskType, title: data.title, instructions: data.instructions, deadline },
      }),
    ]);

    after(() =>
      sendEmail({
        to: submission.seeker.user.email,
        ...emails.taskAssigned({
          candidateName: submission.seeker.fullName,
          jobTitle: submission.job.title,
          companyName: submission.job.provider.companyName,
          taskTitle: data.title,
          deadline,
        }),
      }),
    );
    revalidatePath("/dashboard");
  }, "Task assigned and candidate notified");
}

export async function reviewTask(input: unknown) {
  return runAction(async () => {
    const { providerId } = await requireProvider();
    const data = reviewTaskSchema.parse(input);
    const task = await prisma.candidateTask.findFirst({
      where: { id: data.taskId, submission: { job: { providerId } } },
      include: { submission: { select: { seekerId: true } } },
    });
    if (!task) throw new UserError("Task not found.");
    await prisma.candidateTask.update({
      where: { id: task.id },
      data: { status: data.status, score: data.score, feedback: data.feedback, reviewedAt: new Date() },
    });
    after(() => scoringService.computeSeekerTalentScore(task.submission.seekerId).catch((e) => console.error("[scoring]", e)));
    revalidatePath("/dashboard");
  }, "Task reviewed");
}

export async function createInterviewSlot(input: unknown) {
  return runAction(async () => {
    const { providerId } = await requireProvider();
    const data = interviewSlotSchema.parse(input);
    const job = await prisma.job.findFirst({ where: { id: data.jobId, providerId }, select: { id: true } });
    if (!job) throw new UserError("Job not found.");
    await prisma.interviewSlot.create({
      data: { jobId: job.id, format: data.format, location: data.location, startTime: data.startTime, endTime: data.endTime },
    });
    revalidatePath("/dashboard");
  }, "Interview slot created");
}

export async function deleteInterviewSlot(slotId: string) {
  return runAction(async () => {
    const { providerId } = await requireProvider();
    const { count } = await prisma.interviewSlot.deleteMany({ where: { id: slotId, isBooked: false, job: { providerId } } });
    if (count === 0) throw new UserError("Slot not found or already booked.");
    revalidatePath("/dashboard");
  }, "Slot removed");
}
