import { NavLink } from "react-router-dom";
import "./header.scss";

const Header = () => {
  return (
    <header className="header">
      <nav className="header__nav">
        <NavLink className="header__link" to="/">
          Главная
        </NavLink>
        <NavLink className="header__link" to="/auth">
          Авторизация
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
