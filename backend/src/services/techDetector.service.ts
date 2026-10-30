import { logger } from "../config/logger.js";
import { config } from "../config/env.js";

const TECH_KEYWORDS: Record<string, string[]> = {
  "React": ["react", "reactjs", "nextjs", "next.js", "remix", "gatsby", "vite"],
  "Next.js": ["nextjs", "next.js", "app-router"],
  "TypeScript": ["typescript", "ts", "tsx"],
  "JavaScript": ["javascript", "js", "node", "nodejs", "express"],
  "Node.js": ["node", "nodejs", "express", "nestjs", "fastify", "koa"],
  "Python": ["python", "django", "flask", "fastapi", "pytorch", "tensorflow", "pandas", "numpy"],
  "PyTorch": ["pytorch", "torch", "deep-learning", "transformer", "llm"],
  "Go": ["golang", "go-lang", "goroutine", "gin", "fiber"],
  "Rust": ["rust", "cargo", "actix", "tokio", "wasm", "webassembly"],
  "PostgreSQL": ["postgres", "postgresql", "prisma", "pg", "typeorm"],
  "MongoDB": ["mongo", "mongodb", "mongoose"],
  "Docker": ["docker", "docker-compose", "container", "k8s", "kubernetes"],
  "Kubernetes": ["kubernetes", "k8s", "helm"],
  "AWS": ["aws", "s3", "lambda", "ec2", "dynamodb", "cloudformation", "cdk"],
  "Tailwind CSS": ["tailwind", "tailwindcss", "shadcn", "tailwind-merge"],
  "GraphQL": ["graphql", "apollo", "relay"],
  "UI/UX Design": ["figma", "dribbble", "behance", "design-system", "wireframe", "sketch"],
  "Mobile": ["react-native", "flutter", "swift", "kotlin", "android", "ios"],
};

export const techDetectorService = {
  detectTechnologiesFromUrlAndTitle(url: string, title?: string, platform?: string): string[] {
    const detected = new Set<string>();
    const normalizedInput = `${url} ${title || ""} ${platform || ""}`.toLowerCase();

    // Specific rules for Design platforms
    if (platform === "Behance" || platform === "Dribbble" || url.includes("behance.net") || url.includes("dribbble.com")) {
      detected.add("UI/UX Design");
      detected.add("Figma");
    }

    // Match keywords
    for (const [tech, keywords] of Object.entries(TECH_KEYWORDS)) {
      for (const kw of keywords) {
        // Regex word boundary or URL slug boundary
        const regex = new RegExp(`(^|[^a-z0-9])${kw}([^a-z0-9]|$)`, "i");
        if (regex.test(normalizedInput)) {
          detected.add(tech);
          break;
        }
      }
    }

    // If GitHub repo, attempt extra detection
    if (url.includes("github.com")) {
      const parts = url.split("/").filter(Boolean);
      const repoName = parts[parts.length - 1];
      if (repoName) {
        for (const [tech, keywords] of Object.entries(TECH_KEYWORDS)) {
          for (const kw of keywords) {
            if (repoName.toLowerCase().includes(kw)) {
              detected.add(tech);
            }
          }
        }
      }
    }

    // Default if none detected
    if (detected.size === 0) {
      if (platform === "GitHub") {
        detected.add("Full Stack");
        detected.add("Software Engineering");
      } else {
        detected.add("Web Application");
      }
    }

    return Array.from(detected);
  },

  async fetchGitHubRepoDetails(repoUrl: string): Promise<{ languages: string[]; stars?: number; description?: string }> {
    try {
      if (!repoUrl.includes("github.com/")) {
        return { languages: [] };
      }

      const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) return { languages: [] };

      const [, owner, repo] = match;
      const cleanRepo = repo.replace(/\.git$/, "");

      const headers: Record<string, string> = {
        "User-Agent": "SlotMyInterview-Analyzer",
        Accept: "application/vnd.github.v3+json",
      };

      if (config.scoring.githubToken) {
        headers.Authorization = `token ${config.scoring.githubToken}`;
      }

      const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
        headers,
      });

      if (!response.ok) {
        return { languages: [] };
      }

      const data = (await response.json()) as any;
      const languages: string[] = [];
      if (data.language) languages.push(data.language);

      return {
        languages,
        stars: data.stargazers_count,
        description: data.description,
      };
    } catch (err: any) {
      logger.warn(`Failed to inspect GitHub repo ${repoUrl}: ${err.message}`);
      return { languages: [] };
    }
  }
};
