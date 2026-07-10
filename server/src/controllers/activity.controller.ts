import type { Request, Response } from "express";
import { prisma } from "../../prisma/prisma.js";
import { getAccessibleProjectIds } from "../utils/authorize.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export const logActivity = async (
  action: string,
  username: string,
  projectId?: number | null,
): Promise<void> => {
  try {
    await prisma.activityLog.create({
      data: {
        action,
        username,
        projectId: projectId || null,
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};

export const getActivities = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as AuthRequest).user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const accessible = await getAccessibleProjectIds(userId);
    const activities = await prisma.activityLog.findMany({
      where: {
        OR: [
          { projectId: null },
          { projectId: { in: accessible as number[] } },
        ],
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 50,
    });

    res.json(activities);
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error retrieving activity logs", error: error.message });
  }
};
