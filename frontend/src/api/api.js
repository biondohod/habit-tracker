import axios from "axios";

export const testRequest = async () => {
  try {
    const response = await axios.get("/api/test");
    return response.data.message;
  } catch (error) {
    console.error("Ошибка запроса:", error);
    return "Ошибка запроса";
  }
}

export const getPots = async () => {
  try {
    const response = await axios.get("/api/posts");
    return response.data;
  } catch (error) {
    console.error("Ошибка запроса:", error);
    return [];
  }
};

export const createPost = async (title, text) => {
  try {
    const response = await axios.post("/api/posts", { title, text });
    return response.data.message;
  } catch (error) {
    console.error("Ошибка запроса:", error);
    return "Ошибка запроса";
  }
}