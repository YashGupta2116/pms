import jwt from "jsonwebtoken";

function requireSecret(name: string, fallback?: string): string {
  const value = process.env[name] || fallback;
  if (!value) {
    throw new Error(`${name} environment variable is required`);
  }
  if (!process.env[name] && process.env.NODE_ENV === "production") {
    throw new Error(`${name} must be set in production`);
  }
  return value;
}

const JWT_SECRET = requireSecret(
  "JWT_SECRET",
  process.env.NODE_ENV !== "production" ? "dev_access_secret_change_me" : undefined,
);
const JWT_REFRESH_SECRET = requireSecret(
  "JWT_REFRESH_SECRET",
  process.env.NODE_ENV !== "production" ? "dev_refresh_secret_change_me" : undefined,
);

export interface TokenPayload {
  userId: number;
  username: string;
  email: string;
}

export interface RefreshTokenPayload {
  userId: number;
  refreshTokenVersion: number;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as unknown as TokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as unknown as RefreshTokenPayload;
};
