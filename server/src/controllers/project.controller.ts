import type { Request, Response } from "express";
import { prisma } from "../../prisma/prisma.js";
import { logActivity } from "./activity.controller.js";
import { getAccessibleProjectIds } from "../utils/authorize.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export const getProjects = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = (req as AuthRequest).user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const accessible = await getAccessibleProjectIds(userId);
    let projects;
    if (accessible === "all") {
      projects = await prisma.project.findMany();
    } else {
      projects = await prisma.project.findMany({
        where: {
          id: { in: accessible },
        },
      });
    }
    res.json(projects);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error retrieving projects", error: error.message });
  }
};

export const createProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const requestingUserId = (req as AuthRequest).user?.userId;
  if (!requestingUserId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { userId: requestingUserId },
      select: { teamId: true },
    });

    if (!user?.teamId) {
      res.status(400).json({
        message: "You must create or join a team before creating a project.",
      });
      return;
    }

    const { name, description, startDate, endDate } = req.body;
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        startDate,
        endDate,
      },
    });

    await prisma.projectTeam.create({
      data: {
        projectId: newProject.id,
        teamId: user.teamId,
      },
    });

    const username = (req as AuthRequest).user?.username || "Unknown User";
    await logActivity(`Created project "${newProject.name}"`, username, newProject.id);

    res.status(201).json(newProject);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error creating projects", error: error.message });
  }
};

export const assignTeamToProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { projectId } = req.params;
  const { teamId } = req.body;
  const requestingUserId = (req as AuthRequest).user?.userId;

  if (!requestingUserId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {

    const existingLink = await prisma.projectTeam.findFirst({
      where: {
        projectId: Number(projectId),
        teamId: Number(teamId),
      },
    });

    if (existingLink) {
      res.status(400).json({ message: "Team is already assigned to this project" });
      return;
    }

    const newLink = await prisma.projectTeam.create({
      data: {
        projectId: Number(projectId),
        teamId: Number(teamId),
      },
    });

    const username = (req as AuthRequest).user?.username || "Unknown User";
    await logActivity(`Linked team #${teamId} to project #${projectId}`, username, Number(projectId));

    res.status(201).json(newLink);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error assigning team to project", error: error.message });
  }
};

export const removeTeamFromProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { projectId, teamId } = req.params;
  const requestingUserId = (req as AuthRequest).user?.userId;

  if (!requestingUserId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {

    const deletedLinks = await prisma.projectTeam.deleteMany({
      where: {
        projectId: Number(projectId),
        teamId: Number(teamId),
      },
    });

    const username = (req as AuthRequest).user?.username || "Unknown User";
    await logActivity(`Unlinked team #${teamId} from project #${projectId}`, username, Number(projectId));

    res.json({ message: "Team successfully unassigned", count: deletedLinks.count });
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error unassigning team from project", error: error.message });
  }
};
