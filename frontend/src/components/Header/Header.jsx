import { NavLink } from "react-router-dom";
import { useLogout } from "../../query/mutations";
import "./header.scss";

const Header = () => {
  const { mutateAsync: logOut, isPending } = useLogout();

  return (
    <header className="header">
      <div className="header__content">
        <nav className="header__nav">
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
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                "header__link" + (isActive ? " header__link--active" : "")
              }
            >
              Личный кабинет
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
