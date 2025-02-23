import { useState } from "react";
import styles from "./form.module.scss";
import { createPost } from "../../api/api";

const Form = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Загрузка...");
    await createPost(title, text);
    setTitle("");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Текст"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit">Создать пост</button>
      </form>
      <p>{message}</p>
    </>
  );
};

export default Form;
