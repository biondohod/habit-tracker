import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import cookieParser from "cookie-parser";
import {
  refreshToken,
  userLogin,
  userLogout,
  verifyToken,
} from "./controllers/authController.js";
import { PORT, URL } from "./constants/conts.js";
import {
  habitCreate,
  habitDelete,
  habitGetAll,
  habitGetById,
  habitUpdate,
} from "./controllers/habitController.js";
import {
  userCreate,
  userDelete,
  userGet,
  userUpdate,
  userUpdatePassword,
} from "./controllers/userController.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

connectDB().then(() => {
  app.listen(parseInt(PORT, 10), "0.0.0.0", () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
});

// Auth routes

app.post(`${URL}/user/register`, userCreate);

app.post(`${URL}/user/login`, userLogin);

app.post(`${URL}/user/logout`, verifyToken, userLogout);

app.get(`${URL}/user/refresh`, refreshToken);

// User routes

app.get(`${URL}/user/get`, verifyToken, userGet);

app.patch(`${URL}/user/update/:id`, verifyToken, userUpdate);

app.patch(`${URL}/user/updatePassword/:id`, verifyToken, userUpdatePassword);

app.delete(`${URL}/user/delete/:id`, verifyToken, userDelete);

// Habit routes

app.post(`${URL}/habit`, verifyToken, habitCreate);

app.get(`${URL}/habit`, verifyToken, habitGetAll);

app.get(`${URL}/habit/:id`, verifyToken, habitGetById);

app.patch(`${URL}/habit/:id`, verifyToken, habitUpdate);

app.delete(`${URL}/habit/:id`, verifyToken, habitDelete);
