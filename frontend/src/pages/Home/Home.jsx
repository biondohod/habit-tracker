import { useEffect, useState } from "react";
import PostsList from "../../components/PostsList/PostsList";
import { getPots, testRequest } from "../../api/api";
import Form from "../../components/Form/Form";

const Home = () => {
  const [message, setMessage] = useState("Не запрашивался");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPotsHandler();
  }, []);

  const getPotsHandler = async () => {
    const res = await getPots();
    setPosts(res);
  };

  const handleClickButton = async () => {
    setMessage("Загрузка...");
    const res = await testRequest();
    setMessage(res);
  };
  return (
    <>
      <div>
        <h1>Трекер привычек</h1>
        <button onClick={handleClickButton}>Запрос на сервер</button>
        <p>Ответ от сервера: {message || "Загрузка..."}</p>
      </div>
      <Form />
      <PostsList posts={posts} />
    </>
  );
};

export default Home;
