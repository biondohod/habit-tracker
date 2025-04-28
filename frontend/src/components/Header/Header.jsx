import { NavLink } from "react-router-dom";
import { useUser } from "../../query/queries";
import { useLogout } from "../../query/mutations";
import Loader from "../Loader/Loader";
import "./header.scss";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Доброе утро";
  if (hour >= 12 && hour < 18) return "Добрый день";
  if (hour >= 18 && hour < 23) return "Добрый вечер";
  return "Доброй ночи";
};

const Header = () => {
  const { mutateAsync: logOut, isPending } = useLogout();

  return (
    <header className="header">
      <div className="header__content">
        <nav className="header__nav">
          {/* <span className="header__greeting">
            {getGreeting()}, {user?.name}
          </span> */}
          <div className="header__links">
            <NavLink
              to="/"
              className={({ isActive }) =>
                "header__link" + (isActive ? " header__link--active" : "")
              }
              end
            >
              Мои привычки
            </NavLink>
            <NavLink
              to="/create"
              className={({ isActive }) =>
                "header__link" + (isActive ? " header__link--active" : "")
              }
            >
              Бросить новую привычку
            </NavLink>
          </div>
          <button
            className="header__logout"
            onClick={() => logOut()}
            disabled={isPending}
          >
            {isPending ? "Выход..." : "Выйти"}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
