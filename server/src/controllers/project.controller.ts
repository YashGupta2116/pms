import type { Request, Response } from "express";
import { prisma } from "../../prisma/prisma.js";

export const getProjects = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projects = await prisma.project.findMany();
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
  const { name, description, startDate, endDate } = req.body;
  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        startDate,
        endDate,
      },
    });

    res.status(201).json(newProject);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error creating projects", error: error.message });
  }
};
