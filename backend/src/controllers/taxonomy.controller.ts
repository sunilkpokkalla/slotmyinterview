import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";
import { ApiResponse } from "../types/index.js";

export const taxonomyController = {
  async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await prisma.skillCategory.findMany({
        orderBy: { order: "asc" },
        include: {
          _count: { select: { skills: true } },
        },
      });

      res.status(200).json({
        success: true,
        data: categories,
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },

  async getSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, search } = req.query;

      const whereClause: any = {};
      if (category) {
        whereClause.category = {
          OR: [
            { id: String(category) },
            { slug: String(category).toLowerCase() },
            { name: { equals: String(category), mode: "insensitive" } },
          ],
        };
      }

      if (search) {
        whereClause.name = {
          contains: String(search),
          mode: "insensitive",
        };
      }

      const skills = await prisma.skill.findMany({
        where: whereClause,
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
        orderBy: [{ category: { order: "asc" } }, { name: "asc" }],
      });

      // Group skills by category for UI draggable tag clouds
      const groupedByCategory: Record<string, any[]> = {};
      skills.forEach((skill) => {
        const catName = skill.category.name;
        if (!groupedByCategory[catName]) {
          groupedByCategory[catName] = [];
        }
        groupedByCategory[catName].push({
          id: skill.id,
          name: skill.name,
          slug: skill.slug,
          categoryId: skill.categoryId,
        });
      });

      res.status(200).json({
        success: true,
        data: {
          all: skills,
          groupedByCategory,
        },
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  },
};

