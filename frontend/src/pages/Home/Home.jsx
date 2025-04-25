import { useUser } from "../../query/queries";
import { useLogout } from "../../query/mutations";
import Loader from "../../components/Loader/Loader";

const Home = () => {
  const { data: user, isLoading, isError } = useUser();
  const { mutateAsync: logOut, isPending } = useLogout();

  if (isLoading) return <Loader size={86} />;
  if (isError || !user)
    return <div>Ошибка загрузки пользователя или пользователь не найден</div>;

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", textAlign: "center" }}>
      <h1>Профиль пользователя</h1>
      <div style={{ marginBottom: 20 }}>
        <div>
          <b>Имя:</b> {user.name}
        </div>
        <div>
          <b>Email:</b> {user.email}
        </div>
        <div>
          <b>ID:</b> {user.id || user._id}
        </div>
      </div>
      <button
        style={{
          padding: "10px 20px",
          background: "#7b9acc",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: 600,
        }}
        onClick={() => logOut()}
        disabled={isPending}
      >
        {isPending ? "Выход..." : "Выйти"}
      </button>
    </div>
  );
};

export default Home;
