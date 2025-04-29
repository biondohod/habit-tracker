import { HydratedDocument } from "mongoose";
import { MS_IN_WEEK } from "../constants/conts.js";
import { IHabit } from "../types/habitTypes.js";

const calculateMoneySaved = (
  initialAttemptAt: Date,
  costPerWeek: number | undefined
) => {
  if (!initialAttemptAt || !costPerWeek || costPerWeek <= 0) return 0;
  const now = new Date();
  const msInWeek = 7 * 24 * 60 * 60 * 1000;
  const weeks = Math.floor(
    (now.getTime() - new Date(initialAttemptAt).getTime()) / msInWeek
  );
  return weeks > 0 ? weeks * costPerWeek : 0;
};

export const updateMoneySavedIfNeeded = async (
  habit: HydratedDocument<IHabit>,
  force: boolean = false
) => {
  const now = new Date();
  const lastUpdate = new Date(habit.updatedAt);

  if (force || now.getTime() - lastUpdate.getTime() >= MS_IN_WEEK) {
    const newMoneySaved = calculateMoneySaved(
      habit.initialAttemptAt,
      habit.costPerWeek
    );

    if (habit.moneySaved !== newMoneySaved) {
      habit.moneySaved = newMoneySaved;
      await habit.save();
    }
  }
  return habit;
};
