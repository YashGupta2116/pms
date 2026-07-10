import type { Request, Response } from "express";
import { prisma } from "../../prisma/prisma.js";
import { logActivity } from "./activity.controller.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const requestingUserId = (req as AuthRequest).user?.userId;
  if (!requestingUserId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        userId: true,
        username: true,
        email: true,
        profilePictureUrl: true,
        teamId: true,
      },
    });
    res.json(users);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error retrieving users", error: error.message });
  }
};

export const updateUserTeam = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId } = req.params;
  const { teamId } = req.body;
  const requestingUserId = (req as AuthRequest).user?.userId;

  if (!requestingUserId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        userId: Number(userId),
      },
      data: {
        teamId: teamId ? Number(teamId) : null,
      },
    });

    const username = (req as AuthRequest).user?.username || "Unknown User";
    const teamMsg = teamId ? `team #${teamId}` : "no team";
    await logActivity(`Assigned user "${updatedUser.username}" to ${teamMsg}`, username);

    res.json(updatedUser);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error updating user team", error: error.message });
  }
};
