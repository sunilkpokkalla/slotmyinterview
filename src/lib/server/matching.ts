import "server-only";
import { prisma } from "./prisma";
import { emails, sendEmail } from "./email";

/**
 * Sends match alerts for a newly posted job to candidates with overlapping skills,
 * respecting each candidate's weekly cap and pause setting. Runs after the response via next/server `after()`.
 */
export async function matchAndAlertSeekersForJob(jobId: string) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { provider: true, requiredSkills: true },
  });
  if (!job || !job.isActive || job.requiredSkills.length === 0) return { dispatched: 0 };

  const requiredIds = job.requiredSkills.map((s) => s.id);
  const seekers = await prisma.seekerProfile.findMany({
    where: { alertsPaused: false, user: { isEmailVerified: true }, skills: { some: { skillId: { in: requiredIds } } } },
    include: { user: { select: { email: true } }, skills: { select: { skillId: true } } },
    take: 500,
  });

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  let dispatched = 0;

  for (const seeker of seekers) {
    const owned = new Set(seeker.skills.map((s) => s.skillId));
    const matched = job.requiredSkills.filter((s) => owned.has(s.id));
    if (matched.length === 0) continue;

    const [already, recent] = await Promise.all([
      prisma.jobAlertDispatch.findFirst({ where: { seekerId: seeker.id, jobId }, select: { id: true } }),
      prisma.jobAlertDispatch.count({ where: { seekerId: seeker.id, sentAt: { gte: weekAgo } } }),
    ]);
    if (already || recent >= seeker.alertFrequencyMaxPerWeek) continue;

    await prisma.jobAlertDispatch.create({ data: { seekerId: seeker.id, jobId } });
    await sendEmail({
      to: seeker.user.email,
      ...emails.jobMatch({
        seekerName: seeker.fullName,
        jobTitle: job.title,
        companyName: job.provider.companyName,
        location: job.location,
        matchedSkills: matched.map((s) => s.name),
      }),
    });
    dispatched++;
  }
  return { dispatched };
}
