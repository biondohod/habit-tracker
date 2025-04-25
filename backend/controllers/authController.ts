import { RequestHandler } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { IUser } from "../types/userTypes.js";
import bcrypt from "bcrypt";
import {
  ACCESS_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  COOKIE_MAX_AGE,
  REFRESH_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  SECURE_COOKIE,
} from "../constants/conts.js";

const generateAccessToken = (user: IUser) => {
  const { _id: id, email, name } = user;
  return jwt.sign({ id, email, name }, ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
};

const generateRefreshToken = (user: IUser) => {
  const { _id: id, email, name } = user;
  return jwt.sign({ _id: id, email, name }, REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};

export const userCreate: RequestHandler = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        message: "Пользователь с таким email уже существует",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, name, password: hashedPassword });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: SECURE_COOKIE,
      maxAge: COOKIE_MAX_AGE,
    });

    res.status(201).json({
      message: "Регистрация прошла успешно",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      accessToken,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Непредвиденная ошибка при создании пользователя",
      errMessage: err?.message,
    });
  }
};

export const userLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(401)
        .json({ message: "Пользователя с таким email не существует" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Неверный пароль" });
      return;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: SECURE_COOKIE,
      maxAge: COOKIE_MAX_AGE,
    });

    res.status(200).json({
      message: "Авторизация прошла успешно",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      accessToken,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Непредвиденная ошибка при авторизации",
      errMessage: err?.message,
    });
  }
};
