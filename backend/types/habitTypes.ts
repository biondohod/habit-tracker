import { Document, Types } from "mongoose";

export interface IHabit extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  attempts: number;
  startedAt: Date;
  initialAttemptAt: Date;
  moneySaved?: number;
  costPerWeek?: number;
  user: Types.ObjectId;
  createdAt: Date;
}
