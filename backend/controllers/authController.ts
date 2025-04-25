import { RequestHandler } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { IUser, JwtUserPayload } from "../types/userTypes.js";
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

export const verifyToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, ACCESS_SECRET, (err, data) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Токен недействителен", err: err });
      }

      if (typeof data === "object" && data !== null) {
        req.user = data as JwtUserPayload;
      }
      next();
    });
  } else {
    res.status(401).json({ message: "Пользователь не авторизован" });
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

      const newAcessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
      user.refreshToken = newRefreshToken;
      await user.save();

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: SECURE_COOKIE,
        maxAge: COOKIE_MAX_AGE,
      });
      res.status(200).json({
        message: "Токены обновлены",
        accessToken: newAcessToken,
      });
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Непредвиденная ошибка при обновлении токена",
      err: err,
    });
  }
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
      err: err,
    });
  }
};

export const userLogout: RequestHandler = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: "Пользователь не авторизован" });
      return;
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: SECURE_COOKIE,
    });

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

export const userDelete: RequestHandler = async (req, res) => {
  try {
    const currentId = req.user?.id;
    if (!currentId) {
      res.status(401).json({ message: "Пользователь не авторизован" });
      return;
    }
    if (currentId === req.params.id) {
      const user = await User.findByIdAndDelete(currentId);
      if (!user) {
        res.status(404).json({ message: "Пользователь не найден" });
        return;
      }
      res.status(200).json({ message: "Пользователь успешно удален" });
    } else {
      res
        .status(403)
        .json({ message: "Вы не можете удалить этого пользователя" });
    }
  } catch (err: any) {
    res.status(500).json({
      message: "Непредвиденная ошибка при удалении пользователя",
      err: err,
    });
  }
};
