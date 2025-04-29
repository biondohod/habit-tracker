import { RequestHandler } from "express";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../helpers/generateTokens.js";
import bcrypt from "bcrypt";
import { COOKIE_MAX_AGE, SECURE_COOKIE } from "../constants/conts.js";

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

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: SECURE_COOKIE,
      maxAge: COOKIE_MAX_AGE,
    });

    const {
      password: pass,
      refreshToken: refTok,
      ...userData
    } = user.toObject();

    res.status(201).json({
      message: "Регистрация прошла успешно",
      user: userData,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Непредвиденная ошибка при создании пользователя",
      err: err,
    });
  }
};

export const userGet: RequestHandler = async (req, res) => {
  try {
    const currentId = req.user?.id;
    if (!currentId) {
      res.status(401).json({ message: "Пользователь не авторизован" });
      return;
    }
    const user = await User.findById(currentId).select(
      "-password -refreshToken"
    );
    if (!user) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }
    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json({
      message: "Непредвиденная ошибка при получении пользователя",
      err: err,
    });
  }
};

export const userUpdate: RequestHandler = async (req, res) => {
  try {
    const currentId = req.user?.id;
    const { password, ...rest } = req.body;
    if (!currentId) {
      res.status(401).json({ message: "Пользователь не авторизован" });
      return;
    }
    if (currentId === req.params.id) {
      const user = await User.findByIdAndUpdate(currentId, rest, {
        new: true,
      });
      if (!user) {
        res.status(404).json({ message: "Пользователь не найден" });
        return;
      }
      const { password, refreshToken, ...userData } = user.toObject();
      res
        .status(200)
        .json({ message: "Пользователь успешно обновлен", user: userData });
    } else {
      res
        .status(403)
        .json({ message: "Вы не можете редактировать этого пользователя" });
    }
  } catch (err: any) {
    res.status(500).json({
      message: "Непредвиденная ошибка при редактировании пользователя",
      err: err,
    });
  }
};

export const userUpdatePassword: RequestHandler = async (req, res) => {
  try {
    const currentId = req.user?.id;
    const { oldPassword, newPassword } = req.body;

    if (!currentId) {
      res.status(401).json({ message: "Пользователь не авторизован" });
      return;
    }

    if (!oldPassword || !newPassword) {
      res
        .status(400)
        .json({ message: "Необходимо указать старый и новый пароль" });
      return;
    }

    const user = await User.findById(currentId);
    if (!user) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }

    if (currentId === req.params.id) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        res.status(400).json({ message: "Старый пароль неверный" });
        return;
      }

      const isSame = await bcrypt.compare(newPassword, user.password);
      if (isSame) {
        res
          .status(400)
          .json({ message: "Новый пароль не должен совпадать со старым" });
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Пароль успешно обновлен" });
    } else {
      res
        .status(403)
        .json({ message: "Вы не можете редактировать этого пользователя" });
    }
  } catch (err: any) {
    res.status(500).json({
      message: "Непредвиденная ошибка при обновлении пароля",
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
