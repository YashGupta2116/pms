import type { Request, Response } from "express";
import { prisma } from "../../prisma/prisma.js";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error retrieving users", error: error.message });
  }
};
