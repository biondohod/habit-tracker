import { RequestHandler } from "express";
import Habit from "../models/Habit.js";

export const habitCreate: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Пользователь не авторизован" });
      return;
    }
    const newHabit = new Habit({
      ...req.body,
      user: userId,
    });
    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при создании привычки", err });
  }
};

export const habitGetAll: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Пользователь не авторизован" });
      return;
    }
    const habits = await Habit.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(habits);
  } catch (err) {
    res.status(500).json({ message: "Ошибка получения привычек", err });
  }
};

export const habitGetById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const habit = await Habit.findById(id);
    if (!habit) {
      res.status(404).json({ message: "Привычка не найдена" });
      return;
    }
    if (String(habit.user) !== String(userId)) {
      res.status(403).json({ message: "Нет доступа к этой привычке" });
      return;
    }
    res.status(200).json(habit);
  } catch (err) {
    res.status(500).json({ message: "Ошибка получения привычекt", err });
  }
};

export const habitUpdate: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const habit = await Habit.findById(id);
    if (!habit) {
      res.status(404).json({ message: "Привычка не найдена" });
      return;
    }
    if (String(habit.user) !== String(userId)) {
      res.status(403).json({ message: "Нет доступа к этой привычке" });
      return;
    }
    const updatedHabit = await Habit.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedHabit);
  } catch (err) {
    res.status(500).json({ message: "Ошибка обновления привычки", err });
  }
};

export const habitDelete: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const habit = await Habit.findById(id);
    if (!habit) {
      res.status(404).json({ message: "Привычка не найдена" });
      return;
    }
    if (String(habit.user) !== String(userId)) {
      res.status(403).json({ message: "Нет доступа к этой привычке" });
      return;
    }
    await Habit.findByIdAndDelete(id);
    res.status(200).json({ message: "Привычка успешно удалена" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка удаления привычки", err });
  }
};
