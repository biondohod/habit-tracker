import React, { useState } from "react";
import "./auth.scss";
import Loader from "../../components/Loader/Loader";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log("Login:", { email: form.email, password: form.password });
    } else {
      console.log("Register:", form);
    }
  };

  return (
    <div className="auth">
      <div className="auth-card">
        <h2>{isLogin ? "Вход" : "Регистрация"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Имя"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">
            {isLogin ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>
        <div className="auth-toggle">
          {isLogin ? (
            <span>
              Нет аккаунта?{" "}
              <button type="button" onClick={() => setIsLogin(false)}>
                Зарегистрироваться
              </button>
            </span>
          ) : (
            <span>
              Уже есть аккаунт?{" "}
              <button type="button" onClick={() => setIsLogin(true)}>
                Войти
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
