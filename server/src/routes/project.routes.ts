import { Router } from "express";
import {
  createProject,
  getProjects,
  assignTeamToProject,
  removeTeamFromProject,
} from "../controllers/project.controller.js";

const router = Router();

router.get("/", getProjects);
router.post("/", createProject);
router.post("/:projectId/teams", assignTeamToProject);
router.delete("/:projectId/teams/:teamId", removeTeamFromProject);

export default router;
