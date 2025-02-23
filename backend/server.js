import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import Post from "./models/Post.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

connectDB();

// Тестовый маршрут
app.get("/api/test", (req, res) => {
  try {
    res.json({ message: "Сервер работает! 🚀" });
  } catch (error) {
    console.error("Ошибка на /api/test:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Создание поста
app.post("/api/posts", async (req, res) => {
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
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.error("Ошибка при запросе постов:", error);
    res.status(500).json({ error: "Ошибка при запросе постов" });
  }
});

app.listen(PORT, () => console.log(`✅ Сервер запущен на http://localhost:${PORT}`));