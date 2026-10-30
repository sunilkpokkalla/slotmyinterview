import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validateBody } from "../middleware/validate.js";
import {
  registerSeekerSchema,
  registerProviderSchema,
  loginSchema,
  oauthLoginSchema,
  refreshTokenSchema,
} from "../validations/index.js";
import { authenticateJWT } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/register/seeker", authLimiter(), validateBody(registerSeekerSchema), authController.registerSeeker);
router.post("/register/provider", authLimiter(), validateBody(registerProviderSchema), authController.registerProvider);
router.post("/login", authLimiter(), validateBody(loginSchema), authController.login);
router.post("/oauth", authLimiter(), validateBody(oauthLoginSchema), authController.oauthLogin);
router.post("/refresh", validateBody(refreshTokenSchema), authController.refreshToken);
router.get("/me", authenticateJWT, authController.getMe);
router.post("/logout", authController.logout);

export default router;

