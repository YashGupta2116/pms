import type { Request, Response } from "express";
import { prisma } from "../../prisma/prisma.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { logActivity } from "./activity.controller.js";
import { userHasProjectAccess, getTaskProjectId, isTeamLeaderOf } from "../utils/authorize.js";

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;
  const userId = (req as AuthRequest).user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const hasAccess = await userHasProjectAccess(userId, Number(projectId));
    if (!hasAccess) {
      res.status(403).json({ message: "Forbidden: You do not have access to this project" });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId: Number(projectId),
      },
      include: {
        author: true,
        assignee: true,
        comments: {
          include: {
            user: {
              select: {
                username: true,
                profilePictureUrl: true
              }
            }
          }
        },
        attachments: true,
      },
    });

    res.json(tasks);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error retrieving tasks", error: error.message });
  }
};

export const createTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    assignedUserId,
  } = req.body;
  const authorUserId = (req as AuthRequest).user?.userId || Number(req.body.authorUserId);

  if (!authorUserId) {
    res.status(400).json({ message: "Author user ID is required" });
    return;
  }

  try {
    const hasAccess = await userHasProjectAccess(authorUserId, Number(projectId));
    if (!hasAccess) {
      res.status(403).json({ message: "Forbidden: You do not have access to this project" });
      return;
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points: points ? Number(points) : null,
        projectId: Number(projectId),
        authorUserId: Number(authorUserId),
        assignedUserId: assignedUserId ? Number(assignedUserId) : null,
      },
    });

    const username = (req as AuthRequest).user?.username || `User #${authorUserId}`;
    await logActivity(`Created task "${newTask.title}" in project #${newTask.projectId}`, username, newTask.projectId);

    res.status(201).json(newTask);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error creating task", error: error.message });
  }
};

export const updateTaskStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { taskId } = req.params;
  const { status } = req.body;
  const userId = (req as AuthRequest).user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const projectId = await getTaskProjectId(Number(taskId));
    if (!projectId) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const hasAccess = await userHasProjectAccess(userId, projectId);
    if (!hasAccess) {
      res.status(403).json({ message: "Forbidden: You do not have access to this project" });
      return;
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        status,
      },
    });

    const username = (req as AuthRequest).user?.username || "Unknown User";
    await logActivity(`Updated task "${updatedTask.title}" status to "${updatedTask.status}"`, username, updatedTask.projectId);

    res.json(updatedTask);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error updating task status", error: error.message });
  }
};

export const getUserTasks = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId } = req.params;
  const requestingUserId = (req as AuthRequest).user?.userId;
  if (!requestingUserId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {


    const userTasks = await prisma.task.findMany({
      where: {
        OR: [
          { authorUserId: Number(userId) },
          { assignedUserId: Number(userId) },
        ],
      },
      include: {
        author: true,
        assignee: true,
      },
    });

    res.json(userTasks);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error retrieving user's tasks", error: error.message });
  }
};

export const createComment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { taskId } = req.params;
  const { text } = req.body;
  const userId = (req as AuthRequest).user?.userId || Number(req.body.userId);

  if (!userId) {
    res.status(400).json({ message: "User ID is required to comment" });
    return;
  }

  try {
    const projectId = await getTaskProjectId(Number(taskId));
    if (!projectId) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const hasAccess = await userHasProjectAccess(userId, projectId);
    if (!hasAccess) {
      res.status(403).json({ message: "Forbidden: You do not have access to this project" });
      return;
    }

    const newComment = await prisma.comment.create({
      data: {
        text,
        taskId: Number(taskId),
        userId: Number(userId),
      },
      include: {
        user: {
          select: {
            username: true,
            profilePictureUrl: true,
          },
        },
      },
    });

    const username = newComment.user?.username || `User #${userId}`;
    await logActivity(`Commented on task #${taskId}: "${text.slice(0, 30)}..."`, username, projectId);

    res.status(201).json(newComment);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error creating comment", error: error.message });
  }
};

export const createAttachment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { taskId } = req.params;
  const { fileURL, fileName } = req.body;
  const uploadedById = (req as AuthRequest).user?.userId || Number(req.body.uploadedById);

  if (!uploadedById) {
    res.status(400).json({ message: "User ID is required to upload attachment" });
    return;
  }

  try {
    const projectId = await getTaskProjectId(Number(taskId));
    if (!projectId) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const hasAccess = await userHasProjectAccess(uploadedById, projectId);
    if (!hasAccess) {
      res.status(403).json({ message: "Forbidden: You do not have access to this project" });
      return;
    }

    const newAttachment = await prisma.attachment.create({
      data: {
        fileURL,
        fileName: fileName || "file.bin",
        taskId: Number(taskId),
        uploadedById: Number(uploadedById),
      },
    });

    const username = (req as AuthRequest).user?.username || `User #${uploadedById}`;
    await logActivity(`Attached file "${newAttachment.fileName}" to task #${taskId}`, username, projectId);

    res.status(201).json(newAttachment);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error creating attachment", error: error.message });
  }
};
