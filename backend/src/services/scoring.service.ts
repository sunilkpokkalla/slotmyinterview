import { prisma } from "../config/prisma.js";
import { logger } from "../config/logger.js";
import { config } from "../config/env.js";

export const scoringService = {
  /**
   * Recalculates and persists the composite talent score and its sub-components for a seeker
   */
  async computeSeekerTalentScore(seekerId: string): Promise<{
    compositeScore: number;
    githubScore: number;
    assessmentScore: number;
    completenessScore: number;
    endorsementScore: number;
  }> {
    const seeker = await prisma.seekerProfile.findUnique({
      where: { id: seekerId },
      include: {
        skills: { include: { skill: true } },
        experiences: true,
        portfolioLinks: true,
        socialProfiles: true,
        endorsements: true,
        submissions: {
          include: {
            taskAssignments: true,
          },
        },
      },
    });

    if (!seeker) {
      throw new Error(`Seeker profile ${seekerId} not found`);
    }

    // 1. Profile Completeness Score (0 - 100)
    let completenessPoints = 0;
    if (seeker.fullName && seeker.fullName.trim().length > 0) completenessPoints += 10;
    if (seeker.headline && seeker.headline.trim().length > 0) completenessPoints += 10;
    if (seeker.photoUrl) completenessPoints += 10;
    if (seeker.bio && seeker.bio.trim().length >= 20) completenessPoints += 10;
    if (seeker.location && seeker.workAuthType) completenessPoints += 10;
    if (seeker.skills.length >= 3) completenessPoints += 20;
    else if (seeker.skills.length > 0) completenessPoints += 10;
    if (seeker.experiences.length >= 1) completenessPoints += 15;
    if (seeker.portfolioLinks.length >= 1) completenessPoints += 10;
    if (seeker.socialProfiles.length >= 1) completenessPoints += 5;

    const completenessScore = Math.min(100, Math.max(0, completenessPoints));

    // 2. Assessment / Challenge Results Score (0 - 100)
    const completedTasks = seeker.submissions
      .flatMap((sub) => sub.taskAssignments)
      .filter((task) => task.score !== null && task.score !== undefined);

    let assessmentScore = 75.0; // Baseline assessment score for new profiles
    if (completedTasks.length > 0) {
      const totalTaskScore = completedTasks.reduce((sum, task) => sum + (task.score || 0), 0);
      assessmentScore = parseFloat((totalTaskScore / completedTasks.length).toFixed(1));
    }

    // 3. GitHub Commit Activity & Repository Quality Score (0 - 100)
    const githubPortfolio = seeker.portfolioLinks.find((p) => p.platform === "GitHub" || p.url.includes("github.com"));
    const githubSocial = seeker.socialProfiles.find((s) => s.platform.toLowerCase().includes("github") || s.url.includes("github.com"));
    const githubLink = githubPortfolio?.url || githubSocial?.url;

    let githubScore = 70.0; // Standard initial baseline

    if (githubLink) {
      try {
        const usernameMatch = githubLink.match(/github\.com\/([^/]+)/);
        const username = usernameMatch ? usernameMatch[1] : null;

        if (username) {
          const headers: Record<string, string> = {
            "User-Agent": "SlotMyInterview-Scorer",
            Accept: "application/vnd.github.v3+json",
          };
          if (config.scoring.githubToken) {
            headers.Authorization = `token ${config.scoring.githubToken}`;
          }

          const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
          if (userRes.ok) {
            const userData = (await userRes.json()) as any;
            const publicRepos = userData.public_repos || 0;
            const followers = userData.followers || 0;

            // Commit and repo quality scoring heuristics
            let ghPoints = 50;
            if (publicRepos >= 10) ghPoints += 20;
            else if (publicRepos >= 5) ghPoints += 12;
            else if (publicRepos >= 1) ghPoints += 6;

            if (followers >= 20) ghPoints += 15;
            else if (followers >= 5) ghPoints += 8;

            if (userData.bio) ghPoints += 5;
            if (userData.blog) ghPoints += 5;
            if (userData.hireable) ghPoints += 5;

            githubScore = Math.min(99, Math.max(50, ghPoints));
          }
        }
      } catch (err: any) {
        logger.warn(`GitHub scoring check failed for ${seeker.id}: ${err.message}`);
      }
    }

    // 4. Peer Endorsement Score (0 - 100)
    const endorsementCount = seeker.endorsements.length;
    // Each verified peer endorsement contributes 20 points up to 100
    const endorsementScore = Math.min(100, endorsementCount * 20);

    // 5. Composite Score Calculation
    // Default weights: 35% GitHub, 25% Assessments, 25% Profile Completeness, 15% Endorsements
    const w = config.scoring.weights;
    const rawComposite =
      githubScore * w.github +
      assessmentScore * w.assessments +
      completenessScore * w.completeness +
      (endorsementCount > 0 ? endorsementScore : 70) * w.endorsements;

    const compositeScore = parseFloat(Math.min(100, Math.max(0, rawComposite)).toFixed(1));

    // Persist scores to seeker profile
    await prisma.seekerProfile.update({
      where: { id: seekerId },
      data: {
        compositeScore,
        githubScore: parseFloat(githubScore.toFixed(1)),
        assessmentScore: parseFloat(assessmentScore.toFixed(1)),
        completenessScore: parseFloat(completenessScore.toFixed(1)),
        endorsementScore: parseFloat(endorsementScore.toFixed(1)),
        lastScoredAt: new Date(),
      },
    });

    logger.info(`Updated talent score for seeker ${seekerId}: Composite=${compositeScore} (Completeness=${completenessScore}, GitHub=${githubScore}, Assessments=${assessmentScore}, Endorsements=${endorsementScore})`);

    return {
      compositeScore,
      githubScore,
      assessmentScore,
      completenessScore,
      endorsementScore,
    };
  },
};
