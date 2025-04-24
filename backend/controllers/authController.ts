import { Request, Response } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { IUser } from "../types/userTypes.js";
// import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "";

const generateAccessToken = (user: IUser) => {
  const { _id: id, email, name } = user;
  return jwt.sign({ id, email, name }, ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user: IUser) => {
  const { _id: id, email, name } = user;
  return jwt.sign({ _id: id, email, name }, REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const userCreate = (req: Request, res: Response) => {
  const user = new User(req.body);
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user
    .save()
    .then((result) => {
      res.status(201).json({
        message: "User created successfully",
        user: {
          id: result._id,
          email: result.email,
          name: result.name,
        },
        accessToken,
        refreshToken,
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message || "Error creating user" });
    });
};
