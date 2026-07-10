import { Router } from "express";
import { getTeams, updateTeamLeadership, createTeam, joinTeam } from "../controllers/team.controller.js";

const router = Router();

router.get("/", getTeams);
router.post("/", createTeam);
router.post("/:teamId/join", joinTeam);
router.patch("/:teamId/leadership", updateTeamLeadership);

export default router;
