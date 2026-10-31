"use server";

import { randomBytes } from "node:crypto";
import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/server/prisma";
import { requireSeeker } from "@/lib/server/auth";
import { runAction, UserError } from "@/lib/server/action";
import { scoringService } from "@/lib/server/scoring";
import { techDetectorService } from "@/lib/server/tech-detector";
import {
  alertSettingsSchema,
  availabilitySchema,
  bioSchema,
  calcomLinkSchema,
  endorsementSchema,
  experienceSchema,
  identitySchema,
  portfolioSchema,
  skillsSchema,
} from "@/lib/validations";

/** Recompute the talent score after the response is sent, then refresh the affected pages. */
async function afterProfileChange(seekerId: string) {
  const profile = await prisma.seekerProfile.findUnique({ where: { id: seekerId }, select: { username: true } });
  revalidatePath("/dashboard");
  if (profile) revalidatePath(`/u/${profile.username}`);
  after(() => scoringService.computeSeekerTalentScore(seekerId).catch((e) => console.error("[scoring]", e)));
}

export async function updateIdentity(input: unknown) {
  return runAction(async () => {
    const { seekerId } = await requireSeeker();
    const data = identitySchema.parse(input);
    await prisma.seekerProfile.update({
      where: { id: seekerId },
      data: {
        fullName: data.fullName,
        headline: data.headline || null,
        location: data.location || null,
        workAuthType: data.workAuthType || null,
        photoUrl: data.photoUrl ?? null,
      },
    });
    await afterProfileChange(seekerId);
  }, "Identity saved");
}

export async function updateSkills(input: unknown) {
  return runAction(async () => {
    const { seekerId } = await requireSeeker();
    const { skillIds, nonTechSkills } = skillsSchema.parse(input);
    const unique = [...new Set(skillIds)];
    const valid = await prisma.skill.count({ where: { id: { in: unique } } });
    if (valid !== unique.length) throw new UserError("One or more skills are not recognized.");

    await prisma.$transaction([
      prisma.seekerSkill.deleteMany({ where: { seekerId } }),
      prisma.seekerSkill.createMany({ data: unique.map((skillId, i) => ({ seekerId, skillId, displayOrder: i })) }),
      prisma.seekerProfile.update({ where: { id: seekerId }, data: { nonTechSkills: [...new Set(nonTechSkills)] } }),
    ]);
    await afterProfileChange(seekerId);
  }, "Skills saved");
}

export async function addExperience(input: unknown) {
  return runAction(async () => {
    const { seekerId } = await requireSeeker();
    const data = experienceSchema.parse(input);
    if (!data.isCurrent && data.endDate && data.endDate < data.startDate) throw new UserError("End date must be after start date.");
    const exp = await prisma.experience.create({
      data: {
        seekerId,
        company: data.company,
        role: data.role,
        startDate: data.startDate,
        endDate: data.isCurrent ? null : (data.endDate ?? null),
        isCurrent: data.isCurrent,
        description: data.description,
        link: data.link ?? null,
      },
    });
    await afterProfileChange(seekerId);
    return exp;
  }, "Experience added");
}

export async function deleteExperience(id: string) {
  return runAction(async () => {
    const { seekerId } = await requireSeeker();
    // Scoped by seekerId so a candidate can only delete their own entries.
    const { count } = await prisma.experience.deleteMany({ where: { id, seekerId } });
    if (count === 0) throw new UserError("Experience entry not found.");
    await afterProfileChange(seekerId);
  }, "Experience removed");
}

export async function addPortfolioLink(input: unknown) {
  return runAction(async () => {
    const { seekerId } = await requireSeeker();
    const data = portfolioSchema.parse(input);
    const link = await prisma.portfolioLink.create({
      data: {
        seekerId,
        platform: data.platform,
        url: data.url,
        title: data.title || `${data.platform} project`,
        detectedTechStack: techDetectorService.detectTechnologiesFromUrlAndTitle(data.url, data.title, data.platform),
      },
    });
    await afterProfileChange(seekerId);
    return link;
  }, "Portfolio link added");
}

export async function deletePortfolioLink(id: string) {
  return runAction(async () => {
    const { seekerId } = await requireSeeker();
    const { count } = await prisma.portfolioLink.deleteMany({ where: { id, seekerId } });
    if (count === 0) throw new UserError("Portfolio link not found.");
    await afterProfileChange(seekerId);
  }, "Portfolio link removed");
}

export async function updateBioAndSocials(input: unknown) {
  return runAction(async () => {
    const { seekerId } = await requireSeeker();
    const { bio, socialProfiles } = bioSchema.parse(input);
    await prisma.$transaction([
      prisma.seekerProfile.update({ where: { id: seekerId }, data: { bio: bio || null } }),
      prisma.socialProfile.deleteMany({ where: { seekerId } }),
      prisma.socialProfile.createMany({ data: socialProfiles.map((s) => ({ seekerId, platform: s.platform, url: s.url })) }),
    ]);
    await afterProfileChange(seekerId);
  }, "Bio and links saved");
}

export async function updateAvailability(input: unknown) {
  return runAction(async () => {
    const { seekerId } = await requireSeeker();
    const availability = availabilitySchema.parse(input);
    await prisma.seekerProfile.update({ where: { id: seekerId }, data: { availability } });
    await afterProfileChange(seekerId);
  }, "Availability updated");
}

export async function updateAlertSettings(input: unknown) {
  return runAction(async () => {
    const { seekerId } = await requireSeeker();
    const data = alertSettingsSchema.parse(input);
    await prisma.seekerProfile.update({ where: { id: seekerId }, data });
    revalidatePath("/dashboard");
  }, "Alert settings saved");
}

export async function updateCalcomLink(input: unknown) {
  return runAction(async () => {
    const { seekerId } = await requireSeeker();
    const link = calcomLinkSchema.parse(input);
    const current = await prisma.seekerProfile.findUnique({ where: { id: seekerId }, select: { calcomWebhookSecret: true } });
    await prisma.seekerProfile.update({
      where: { id: seekerId },
      data: {
        calcomLink: link || null,
        // Issued once; used to verify this candidate's Cal.com webhooks.
        calcomWebhookSecret: current?.calcomWebhookSecret ?? (link ? randomBytes(24).toString("hex") : null),
      },
    });
    await afterProfileChange(seekerId);
  }, "Cal.com link saved");
}

export async function endorsePeer(input: unknown) {
  return runAction(async () => {
    const { seekerId: endorserId } = await requireSeeker();
    const { seekerId, skillName, comment } = endorsementSchema.parse(input);
    if (seekerId === endorserId) throw new UserError("You cannot endorse yourself.");
    await prisma.endorsement.upsert({
      where: { seekerId_endorserId_skillName: { seekerId, endorserId, skillName } },
      update: { comment },
      create: { seekerId, endorserId, skillName, comment },
    });
    await afterProfileChange(seekerId);
  }, "Endorsement saved");
}

export async function recalculateScore() {
  return runAction(async () => {
    const { seekerId } = await requireSeeker();
    const score = await scoringService.computeSeekerTalentScore(seekerId);
    revalidatePath("/dashboard");
    return score;
  }, "Score refreshed");
}
