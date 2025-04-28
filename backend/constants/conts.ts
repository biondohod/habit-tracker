import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.BACKEND_PORT || "5000";
export const URL = "/api";

export const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "";
export const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "";
export const SECURE_COOKIE = process.env.NODE_ENV === "production";
export const ACCESS_TOKEN_EXPIRES_IN = "15m";
export const REFRESH_TOKEN_EXPIRES_IN = "7d";
export const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
