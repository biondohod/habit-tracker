import mongoose, { Schema } from "mongoose";
import { IHabit } from "../types/habitTypes.js";

const habitSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    attempts: {
      type: Number,
      default: 1,
    },
    moneySaved: {
      type: Number,
      default: 0,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    costPerWeek: Number,

    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Habit = mongoose.model<IHabit>("Habit", habitSchema);

export default Habit;
