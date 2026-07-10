import { Router } from "express";
import { getUsers, updateUserTeam } from "../controllers/user.controller.js";

const router = Router();

router.get("/", getUsers);
router.patch("/:userId/team", updateUserTeam);

export default router;
