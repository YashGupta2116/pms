import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    username: string;
    email: string;
  };
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized. No token provided." });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized. Invalid token format." });
    return;
  }

  try {
    const decoded = verifyAccessToken(token);

    (req as AuthRequest).user = decoded;
    next();
  } catch (error: any) {
    res.status(401).json({ message: "Unauthorized. Invalid or expired token.", error: error.message });
  }
};
