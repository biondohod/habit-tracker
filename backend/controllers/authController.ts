import { RequestHandler } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { JwtUserPayload } from "../types/userTypes.js";
import bcrypt from "bcrypt";
import {
  COOKIE_MAX_AGE,
  ACCESS_SECRET,
  REFRESH_SECRET,
  SECURE_COOKIE,
} from "../constants/conts.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../helpers/generateTokens.js";

export const verifyToken: RequestHandler = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (token) {
    jwt.verify(token, ACCESS_SECRET, (err: any, data: any) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            message: "Токен истёк",
            code: "TOKEN_EXPIRED",
            err: err,
          });
        }
        return res.status(403).json({
          message: "Токен недействителен",
          code: "TOKEN_INVALID",
          err: err,
        });
      }
      if (typeof data === "object" && data !== null) {
        req.user = data as JwtUserPayload;
      }
      next();
    });
  } else {
    res
      .status(401)
      .json({ message: "Пользователь не авторизован", code: "NO_TOKEN" });
  }
};

export const refreshToken: RequestHandler = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!refreshToken) {
    res.status(401).json({ message: "Пользователь не авторизован" });
    return;
  }
  if (!user) {
    res.status(403).json({ message: "Токен недействителен" });
    return;
  }

  try {
    jwt.verify(refreshToken, REFRESH_SECRET, async (err: any, data: any) => {
      if (err) {
        return res.status(403).json({ message: "Токен недействителен" });
      }

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
      user.refreshToken = newRefreshToken;
      await user.save();

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: SECURE_COOKIE,
        maxAge: COOKIE_MAX_AGE,
      });

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: SECURE_COOKIE,
        maxAge: COOKIE_MAX_AGE,
      });

      res.status(200).json({
        message: "Токены обновлены",
      });
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Непредвиденная ошибка при обновлении токена",
      err: err,
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

    res.cookie("accessToken", accessToken, {
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
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Непредвиденная ошибка при авторизации",
      err: err,
    });
  }
};

export const userLogout: RequestHandler = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: SECURE_COOKIE,
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: SECURE_COOKIE,
    });

    if (!refreshToken) {
      res.status(401).json({ message: "Пользователь не авторизован" });
      return;
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.status(403).json({ message: "Токен недействителен" });
      return;
    }
    user.refreshToken = "";
    await user.save();
    res.status(200).json({ message: "Вы вышли из системы" });
  } catch (err: any) {
    res.status(500).json({
      message: "Непредвиденная ошибка при выходе из системы",
      err: err,
    });
  }
};
