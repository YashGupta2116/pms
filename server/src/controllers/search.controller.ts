import type { Request, Response } from "express";
import { prisma } from "../../prisma/prisma.js";
import type { Prisma } from "../../prisma/generated/prisma/client.js";
import { getAccessibleProjectIds } from "../utils/authorize.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export const search = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;
  const userId = (req as AuthRequest).user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const accessible = await getAccessibleProjectIds(userId);

    let tasksWhereClause: any = {
      OR: [
        { title: { contains: query as string, mode: "insensitive" } },
        { description: { contains: query as string, mode: "insensitive" } },
      ],
    };

    let projectsWhereClause: any = {
      OR: [
        { name: { contains: query as string, mode: "insensitive" } },
        { description: { contains: query as string, mode: "insensitive" } },
      ],
    };

    if (accessible !== "all") {
      tasksWhereClause.projectId = { in: accessible };
      projectsWhereClause.id = { in: accessible };
    }

    const tasks = await prisma.task.findMany({
      where: tasksWhereClause,
    });

    const projects = await prisma.project.findMany({
      where: projectsWhereClause,
    });

    const currentUser = await prisma.user.findUnique({
      where: { userId },
      select: { teamId: true },
    });

    const usersWhereClause: Prisma.UserWhereInput =
      accessible === "all"
        ? {
            OR: [
              { username: { contains: String(query), mode: "insensitive" } },
            ],
          }
        : {
            AND: [
              {
                OR: [{ userId }, { teamId: currentUser?.teamId ?? -1 }],
              },
              { username: { contains: String(query), mode: "insensitive" } },
            ],
          };

    const users = await prisma.user.findMany({
      where: usersWhereClause,
    });

    res.json({ tasks, projects, users });
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error performing search", error: error.message });
  }
};
