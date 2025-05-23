import { RequestHandler } from "express";
import Habit from "../models/Habit.js";
import { updateMoneySavedIfNeeded } from "../helpers/calculateMoneySaved.js";

export const habitCreate: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Пользователь не авторизован" });
      return;
    }
    const startedAt = req.body.startedAt
      ? new Date(req.body.startedAt)
      : new Date();

    if (startedAt > new Date()) {
      res.status(400).json({ message: "Дата начала не может быть в будущем" });
      return;
    }
    let newHabit = new Habit({
      ...req.body,
      startedAt,
      initialAttemptAt: startedAt,
      user: userId,
    });
    newHabit = await updateMoneySavedIfNeeded(newHabit, true);
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
    let habits = await Habit.find({ user: userId }).sort({ createdAt: -1 });
    habits = await Promise.all(
      habits.map((habit) => updateMoneySavedIfNeeded(habit))
    );
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

    let updateData = { ...req.body };
    const startedAt = req.body.startedAt
      ? new Date(req.body.startedAt)
      : new Date(habit.startedAt);
    if (startedAt > new Date()) {
      res.status(400).json({ message: "Дата начала не может быть в будущем" });
      return;
    }

    if (startedAt < new Date(habit.initialAttemptAt)) {
      updateData.initialAttemptAt = updateData.startedAt;
    }

    let updatedHabit = await Habit.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedHabit) {
      res.status(404).json({ message: "Привычка не найдена" });
      return;
    }

    updatedHabit = await updateMoneySavedIfNeeded(updatedHabit, true);
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
