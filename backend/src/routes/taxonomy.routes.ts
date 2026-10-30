import { Router } from "express";
import { taxonomyController } from "../controllers/taxonomy.controller.js";

const router = Router();

router.get("/categories", taxonomyController.getCategories);
router.get("/skills", taxonomyController.getSkills);

export default router;

