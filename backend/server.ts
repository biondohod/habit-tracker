import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import cookieParser from "cookie-parser";
import Post from "./models/Post.js";
import {
  refreshToken,
  userCreate,
  userDelete,
  userGet,
  userLogin,
  userLogout,
  verifyToken,
} from "./controllers/authController.js";
import { PORT, URL } from "./constants/conts.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
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

app.post(`${URL}/user/register`, userCreate);

app.post(`${URL}/user/login`, userLogin);

app.get(`${URL}/user/get`, verifyToken, userGet);

app.get(`${URL}/user/refresh`, verifyToken, refreshToken);

app.post(`${URL}/user/logout`, verifyToken, userLogout);

app.delete(`${URL}/user/delete/:id`, verifyToken, userDelete);

// Тестовый маршрут
app.get("/api/test", (req: Request, res: Response) => {
  try {
    res.json({ message: "Сервер работает!🚀" });
  } catch (error) {
    console.error("Ошибка на /api/test:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Создание поста
app.post("/api/posts", async (req: Request, res: Response) => {
  try {
    const { title, text } = req.body;
    const newPost = new Post({ title, text });
    await newPost.save();
    res.status(201).json({ message: "Пост создан!", post: newPost });
  } catch (error) {
    console.error("Ошибка при создании поста:", error);
    res.status(500).json({ error: "Ошибка при создании поста" });
  }
});

// Запрос всех постов
app.get("/api/posts", async (req: Request, res: Response) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.error("Ошибка при запросе постов:", error);
    res.status(500).json({ error: "Ошибка при запросе постов" });
  }
});
