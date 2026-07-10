import { Router } from "express";
import { register, login, refresh, logout, me } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import rateLimit from "express-rate-limit";

const authAttemptLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 5,
	standardHeaders: true,
	legacyHeaders: false,
	message: { message: "Too many auth attempts. Please try again later." },
});

const refreshLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 30,
	standardHeaders: true,
	legacyHeaders: false,
	message: { message: "Too many refresh attempts. Please try again later." },
});

const router = Router();

router.post("/register", authAttemptLimiter, register);
router.post("/login", authAttemptLimiter, login);
router.post("/refresh", refreshLimiter, refresh);
router.post("/logout", logout);
router.get("/me", authMiddleware, me);

export default router;
