import {
  ACCESS_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
} from "../constants/conts.js";
import { IUser } from "../types/userTypes.js";
import jwt from "jsonwebtoken";

export const generateAccessToken = (user: IUser) => {
  const { _id: id, email, name } = user;
  return jwt.sign({ id, email, name }, ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
};

export const generateRefreshToken = (user: IUser) => {
  const { _id: id, email, name } = user;
  return jwt.sign({ _id: id, email, name }, REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};
