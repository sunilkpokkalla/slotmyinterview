import "server-only";
import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import type { z } from "zod";
import type { searchSchema } from "@/lib/validations";
import { videoPublicUrl } from "@/lib/video";
import type { CandidateData } from "@/components/profile/types";

export const getTaxonomy = cache(async () => {
  const categories = await prisma.skillCategory.findMany({
    orderBy: { order: "asc" },
    include: { skills: { orderBy: { name: "asc" }, select: { id: true, name: true, slug: true } } },
  });
  return categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, skills: c.skills }));
});

export type Taxonomy = Awaited<ReturnType<typeof getTaxonomy>>;

const year = (d: Date) => d.getUTCFullYear().toString();

export const getPublicProfile = cache(async (username: string): Promise<CandidateData | null> => {
  const p = await prisma.seekerProfile.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      skills: { include: { skill: true }, orderBy: { displayOrder: "asc" } },
      experiences: { orderBy: { startDate: "desc" } },
      portfolioLinks: { orderBy: { createdAt: "desc" } },
      socialProfiles: true,
      endorsements: { include: { endorser: { select: { fullName: true, username: true, photoUrl: true, headline: true } } } },
      user: { select: { email: true } },
    },
  });
  if (!p) return null;

  const social = (needle: string) => p.socialProfiles.find((s) => s.platform.toLowerCase().includes(needle) || s.url.includes(`${needle}.com`))?.url;

  return {
    id: p.id,
    username: p.username,
    name: p.fullName,
    headline: p.headline ?? "",
    location: p.location ?? "",
    about: p.bio ?? "",
    avatarUrl: p.photoUrl ?? "",
    email: p.user.email,
    workAuthType: p.workAuthType ?? undefined,
    availability: p.availability,
    compositeScore: p.compositeScore,
    githubScore: p.githubScore,
    assessmentScore: p.assessmentScore,
    completenessScore: p.completenessScore,
    endorsementScore: p.endorsementScore,
    github: p.portfolioLinks.find((l) => l.platform === "GitHub")?.url ?? social("github"),
    linkedin: social("linkedin"),
    experience: p.experiences.map((e) => ({
      id: e.id,
      company: e.company,
      role: e.role,
      startDate: year(e.startDate),
      endDate: e.isCurrent || !e.endDate ? "Present" : year(e.endDate),
      description: e.description.split(/\n+/).filter(Boolean),
      link: e.link ?? undefined,
    })),
    skills: p.skills.map((s) => s.skill.name),
    nonTechSkills: p.nonTechSkills,
    portfolioLinks: p.portfolioLinks.map((l) => ({ id: l.id, platform: l.platform, url: l.url, title: l.title ?? undefined, detectedTechStack: l.detectedTechStack })),
    endorsements: p.endorsements.map((e) => ({
      id: e.id,
      skillName: e.skillName,
      comment: e.comment ?? undefined,
      endorser: { fullName: e.endorser.fullName, username: e.endorser.username, photoUrl: e.endorser.photoUrl ?? undefined, headline: e.endorser.headline ?? undefined },
    })),
    videoPitchUrl: videoPublicUrl(p.videoPitchPath),
    videoPitchDurationSec: p.videoPitchDurationSec ?? undefined,
    calcomLink: p.calcomLink ?? undefined,
  };
});

export const SEARCH_PAGE_SIZE = 20;

export async function searchSeekers(params: z.infer<typeof searchSchema>) {
  const where: Prisma.SeekerProfileWhereInput = {};
  const and: Prisma.SeekerProfileWhereInput[] = [];

  if (params.query) {
    and.push({
      OR: [
        { fullName: { contains: params.query, mode: "insensitive" } },
        { headline: { contains: params.query, mode: "insensitive" } },
        { bio: { contains: params.query, mode: "insensitive" } },
      ],
    });
  }
  if (params.skill) {
    and.push({ skills: { some: { skill: { OR: [{ name: { equals: params.skill, mode: "insensitive" } }, { slug: params.skill.toLowerCase() }] } } } });
  }
  if (params.category) and.push({ skills: { some: { skill: { category: { slug: params.category.toLowerCase() } } } } });
  if (params.location) and.push({ location: { contains: params.location, mode: "insensitive" } });
  if (params.workAuthType) and.push({ workAuthType: { equals: params.workAuthType, mode: "insensitive" } });
  if (params.availability) and.push({ availability: params.availability });
  if (params.minScore) and.push({ compositeScore: { gte: params.minScore } });
  if (params.hasVideo) and.push({ videoPitchPath: { not: null } });
  if (and.length) where.AND = and;

  const [profiles, total] = await Promise.all([
    prisma.seekerProfile.findMany({
      where,
      orderBy: { [params.sortBy]: "desc" },
      skip: (params.page - 1) * SEARCH_PAGE_SIZE,
      take: SEARCH_PAGE_SIZE,
      select: {
        id: true,
        username: true,
        fullName: true,
        headline: true,
        photoUrl: true,
        location: true,
        workAuthType: true,
        availability: true,
        compositeScore: true,
        videoPitchPath: true,
        calcomLink: true,
        skills: { select: { skill: { select: { name: true } } }, orderBy: { displayOrder: "asc" } },
      },
    }),
    prisma.seekerProfile.count({ where }),
  ]);

  return {
    total,
    totalPages: Math.max(1, Math.ceil(total / SEARCH_PAGE_SIZE)),
    profiles: profiles.map(({ videoPitchPath, calcomLink, skills, ...p }) => ({
      ...p,
      hasVideo: Boolean(videoPitchPath),
      hasCalendar: Boolean(calcomLink),
      skills: skills.map((s) => s.skill.name),
    })),
  };
}

export async function getSeekerDashboard(seekerId: string) {
  const now = new Date();
  const profile = await prisma.seekerProfile.findUniqueOrThrow({
    where: { id: seekerId },
    include: {
      skills: { select: { skillId: true }, orderBy: { displayOrder: "asc" } },
      experiences: { orderBy: { startDate: "desc" } },
      portfolioLinks: { orderBy: { createdAt: "desc" } },
      socialProfiles: true,
      submissions: {
        orderBy: { updatedAt: "desc" },
        // `notes` are the recruiter's private notes, so they are never selected here.
        select: {
          id: true,
          stage: true,
          coverNote: true,
          job: {
            select: {
              id: true,
              title: true,
              provider: { select: { companyName: true } },
              interviewSlots: { where: { isBooked: false, startTime: { gt: now } }, orderBy: { startTime: "asc" } },
            },
          },
          taskAssignments: { orderBy: { assignedAt: "desc" } },
          interviews: { include: { slot: true } },
        },
      },
      calBookings: { where: { endTime: { gte: now } }, orderBy: { startTime: "asc" } },
    },
  });

  const openJobs = await prisma.job.findMany({
    where: { isActive: true, submissions: { none: { seekerId } } },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { id: true, title: true, location: true, workLocation: true, provider: { select: { companyName: true } } },
  });

  return { profile, openJobs, videoUrl: videoPublicUrl(profile.videoPitchPath) };
}

export async function getProviderDashboard(providerId: string, userId: string) {
  const now = new Date();
  const [provider, jobs, calBookings] = await Promise.all([
    prisma.providerProfile.findUniqueOrThrow({ where: { id: providerId } }),
    prisma.job.findMany({
      where: { providerId },
      orderBy: { createdAt: "desc" },
      include: {
        requiredSkills: { select: { id: true, name: true } },
        submissions: {
          orderBy: { updatedAt: "desc" },
          include: {
            seeker: { select: { id: true, username: true, fullName: true, headline: true, photoUrl: true, compositeScore: true } },
            taskAssignments: { orderBy: { assignedAt: "desc" } },
          },
        },
        interviewSlots: {
          where: { endTime: { gte: now } },
          orderBy: { startTime: "asc" },
          include: { booking: { include: { submission: { select: { seeker: { select: { fullName: true, username: true } } } } } } },
        },
      },
    }),
    prisma.calBooking.findMany({
      where: { recruiterUserId: userId, endTime: { gte: now } },
      orderBy: { startTime: "asc" },
      include: { seeker: { select: { fullName: true, username: true } } },
    }),
  ]);
  return { provider, jobs, calBookings };
}
