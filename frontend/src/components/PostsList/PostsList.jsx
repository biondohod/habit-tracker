import Loader from "../Loader/Loader";
import styles from "./postsList.module.scss";
const PostsList = ({ posts, isLoading }) => {
  const renderPosts = () => {
    return posts.map((post) => (
      <li className={styles.post} key={post._id}>
        <p className={styles.title}>{post.title}</p>
        <span className={styles.text}>{post.text}</span>
      </li>
    ));
  };
  if (isLoading) {
    return <Loader />;
  }
  if (!posts.length && !isLoading) {
    return <p>Постов пока нет</p>;
  }
  return (
    <>
      <h2>Посты</h2>
      <ul className={styles.posts}>{renderPosts()}</ul>
    </>
  );
};

export default PostsList;
