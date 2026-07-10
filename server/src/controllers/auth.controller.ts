import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../prisma/prisma.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { getUserRole, isAnyTeamLeader } from "../utils/authorize.js";

const buildAuthUser = async (user: {
  userId: number;
  username: string;
  email: string;
  profilePictureUrl: string | null;
  teamId: number | null;
}) => {
  const [role, isLeader] = await Promise.all([
    getUserRole(user.userId, user.teamId),
    isAnyTeamLeader(user.userId),
  ]);

  return {
    userId: user.userId,
    username: user.username,
    email: user.email,
    profilePictureUrl: user.profilePictureUrl,
    teamId: user.teamId,
    role,
    isLeader,
  };
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      res.status(400).json({ message: "Username or email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const accessToken = generateAccessToken({
      userId: user.userId,
      username: user.username,
      email: user.email,
    });

    const refreshToken = generateRefreshToken({
      userId: user.userId,
      refreshTokenVersion: user.refreshTokenVersion,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "User registered successfully",
      token: accessToken,
      user: await buildAuthUser(user),
    });
  } catch (error: any) {
    console.error("Register error:", error);
    res
      .status(500)
      .json({
        message: "Server error during registration",
        error: error.message,
      });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { usernameOrEmail, password } = req.body;

  try {
    if (!usernameOrEmail || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
      },
    });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const accessToken = generateAccessToken({
      userId: user.userId,
      username: user.username,
      email: user.email,
    });

    const refreshToken = generateRefreshToken({
      userId: user.userId,
      refreshTokenVersion: user.refreshTokenVersion,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Logged in successfully",
      token: accessToken,
      user: await buildAuthUser(user),
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Server error during login", error: error.message });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res
      .status(401)
      .json({ message: "Unauthorized. No refresh token provided." });
    return;
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { userId: decoded.userId },
    });

    if (!user) {
      res.status(401).json({ message: "Unauthorized. User not found." });
      return;
    }

    if (user.refreshTokenVersion !== decoded.refreshTokenVersion) {
      res
        .status(401)
        .json({
          message: "Unauthorized. Refresh token has been rotated or revoked.",
        });
      return;
    }

    const nextRefreshTokenVersion = user.refreshTokenVersion + 1;
    await prisma.user.update({
      where: { userId: user.userId },
      data: { refreshTokenVersion: nextRefreshTokenVersion },
    });

    const accessToken = generateAccessToken({
      userId: user.userId,
      username: user.username,
      email: user.email,
    });

    const nextRefreshToken = generateRefreshToken({
      userId: user.userId,
      refreshTokenVersion: nextRefreshTokenVersion,
    });

    res.cookie("refreshToken", nextRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      token: accessToken,
      user: await buildAuthUser(user),
    });
  } catch (error: any) {
    res
      .status(401)
      .json({
        message: "Unauthorized. Invalid or expired refresh token.",
        error: error.message,
      });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;
  let userId: number | null = null;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    if (token) {
      try {
        const decoded = verifyAccessToken(token);
        userId = decoded.userId;
      } catch {
        userId = null;
      }
    }
  }

  if (!userId) {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        userId = decoded.userId;
      } catch {
        userId = null;
      }
    }
  }

  if (userId) {
    await prisma.user.update({
      where: { userId },
      data: { refreshTokenVersion: { increment: 1 } },
    });
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
};

export const me = async (req: Request, res: Response): Promise<void> => {
  const authReq = req as AuthRequest;
  if (!authReq.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { userId: authReq.user.userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(await buildAuthUser(user));
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
