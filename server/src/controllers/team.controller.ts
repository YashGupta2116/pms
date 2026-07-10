import type { Request, Response } from "express";
import { prisma } from "../../prisma/prisma.js";
import { logActivity } from "./activity.controller.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export const getTeams = async (req: Request, res: Response) => {
  const requestingUserId = (req as AuthRequest).user?.userId;
  if (!requestingUserId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const teams = await prisma.team.findMany();

    const teamsWithUsernames = await Promise.all(
      teams.map(async (team: any) => {
        const productOwner = team.productOwnerUserId
          ? await prisma.user.findUnique({
            where: {
              userId: team.productOwnerUserId,
            },
            select: { username: true },
          })
          : null;

        const projectManager = team.projectManagerUserId
          ? await prisma.user.findUnique({
            where: { userId: team.projectManagerUserId },
            select: { username: true },
          })
          : null;

        return {
          ...team,
          productOwnerUsername: productOwner?.username,
          projectManagerUsername: projectManager?.username,
        };
      }),
    );

    res.json(teamsWithUsernames);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving teams: ${error.message}` });
  }
};

export const createTeam = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const requestingUserId = (req as AuthRequest).user?.userId;
  if (!requestingUserId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { teamName } = req.body;
  if (!teamName) {
    res.status(400).json({ message: "Team name is required" });
    return;
  }

  try {
    const newTeam = await prisma.team.create({
      data: {
        teamName,
        productOwnerUserId: requestingUserId,
        projectManagerUserId: requestingUserId,
      },
    });

    await prisma.user.update({
      where: { userId: requestingUserId },
      data: { teamId: newTeam.id },
    });

    const username = (req as AuthRequest).user?.username || "Unknown User";
    await logActivity(`Created team "${newTeam.teamName}"`, username);

    res.status(201).json(newTeam);
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating team", error: error.message });
  }
};

export const updateTeamLeadership = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { teamId } = req.params;
  const { productOwnerUserId, projectManagerUserId } = req.body;
  const requestingUserId = (req as AuthRequest).user?.userId;

  if (!requestingUserId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const targetTeam = await prisma.team.findUnique({
      where: { id: Number(teamId) },
    });

    if (!targetTeam) {
      res.status(404).json({ message: "Team not found" });
      return;
    }

    const updatedTeam = await prisma.team.update({
      where: {
        id: Number(teamId),
      },
      data: {
        productOwnerUserId: productOwnerUserId
          ? Number(productOwnerUserId)
          : null,
        projectManagerUserId: projectManagerUserId
          ? Number(projectManagerUserId)
          : null,
      },
    });

    const username = (req as AuthRequest).user?.username || "Unknown User";
    await logActivity(
      `Updated leadership of team "${updatedTeam.teamName}"`,
      username,
    );

    res.json(updatedTeam);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({
        message: "Error updating team leadership",
        error: error.message,
      });
  }
};

export const joinTeam = async (req: Request, res: Response): Promise<void> => {
  const requestingUserId = (req as AuthRequest).user?.userId;
  const { teamId } = req.params;

  if (!requestingUserId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const targetTeam = await prisma.team.findUnique({
      where: { id: Number(teamId) },
    });

    if (!targetTeam) {
      res.status(404).json({ message: "Team not found" });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { userId: requestingUserId },
      data: { teamId: Number(teamId) },
    });

    const username = (req as AuthRequest).user?.username || "Unknown User";
    await logActivity(`Joined team "${targetTeam.teamName}"`, username);

    res.json({
      message: "Successfully joined team",
      user: {
        userId: updatedUser.userId,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePictureUrl: updatedUser.profilePictureUrl,
        teamId: updatedUser.teamId,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Error joining team", error: error.message });
  }
};
