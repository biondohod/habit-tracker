import React, { useState } from "react";
import "./authPage.scss";
import { useLogin, useRegister } from "../../query/mutations";
import Loader from "../Loader/Loader";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const { mutateAsync: signIn, isPending: signInPending } = useLogin();
  const { mutateAsync: signUp, isPending: signUpPending } = useRegister();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (isLogin) {
      signIn({ email: form.email, password: form.password });
    } else {
      signUp(form);
    }
  };

  const isLoading = signInPending || signUpPending;

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
          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader size={24} />
            ) : isLogin ? (
              "Войти"
            ) : (
              "Зарегистрироваться"
            )}
          </button>
        </form>
        {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
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

export default AuthPage;
