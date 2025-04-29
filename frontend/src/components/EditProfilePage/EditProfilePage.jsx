import React, { useState } from "react";
import { useUser } from "../../query/queries";
import { useUpdateUser, useUpdateUserPassword } from "../../query/mutations";
import Loader from "../Loader/Loader";
import "./editProfilePage.scss";
import { useNavigate } from "react-router-dom";

const EditProfilePage = () => {
  const { data: user, isLoading } = useUser();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutateAsync: updatePassword, isPending: isUpdatingPassword } =
    useUpdateUserPassword();

  const [form, setForm] = useState({ name: "", email: "" });
  const [passForm, setPassForm] = useState({
    oldPassword: "",
    newPassword: "",
    repeatPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [error, setError] = useState("");
  const [passError, setPassError] = useState("");
  const [success, setSuccess] = useState("");
  const [passSuccess, setPassSuccess] = useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email });
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handlePassChange = (e) =>
    setPassForm({ ...passForm, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name.trim() || !form.email.trim()) {
      setError("Имя и почта обязательны");
      return;
    }
    try {
      const data = { name: form.name, email: form.email };
      await updateUser({ id: user._id, userData: data });
      navigate("/profile");
      setSuccess("Данные успешно обновлены");
    } catch (err) {
      setError("Ошибка обновления профиля");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess("");
    if (
      !passForm.oldPassword ||
      !passForm.newPassword ||
      !passForm.repeatPassword
    ) {
      setPassError("Заполните все поля");
      return;
    }
    if (passForm.newPassword !== passForm.repeatPassword) {
      setPassError("Новые пароли не совпадают");
      return;
    }
    try {
      const data = {
        oldPassword: passForm.oldPassword,
        newPassword: passForm.newPassword,
      };
      await updatePassword({ id: user._id, passwords: data });
      navigate("/profile");
      setPassSuccess("Пароль успешно обновлен");
      setPassForm({ oldPassword: "", newPassword: "", repeatPassword: "" });
    } catch (err) {
      setPassError("Ошибка обновления пароля");
    }
  };

  if (isLoading) return <Loader size={86} />;

  return (
    <div
      className="edit-profile-page"
      style={{ maxWidth: 420, margin: "40px auto" }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Редактировать профиль
      </h2>
      <form
        onSubmit={handleProfileSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <label>
          Имя
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </label>
        <label>
          Почта
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </label>
        {error && <div style={{ color: "#d32f2f" }}>{error}</div>}
        {success && <div style={{ color: "#388e3c" }}>{success}</div>}
        <button type="submit" disabled={isUpdating}>
          {isUpdating ? "Сохранение..." : "Сохранить"}
        </button>
      </form>
      <hr style={{ margin: "32px 0" }} />
      <form
        onSubmit={handlePasswordSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <label>
          Старый пароль
          <input
            type={showPassword ? "text" : "password"}
            name="oldPassword"
            value={passForm.oldPassword}
            onChange={handlePassChange}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            style={{ marginLeft: 8 }}
            tabIndex={-1}
          >
            {showPassword ? "Скрыть" : "Показать"}
          </button>
        </label>
        <label>
          Новый пароль
          <input
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            value={passForm.newPassword}
            onChange={handlePassChange}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword((v) => !v)}
            style={{ marginLeft: 8 }}
            tabIndex={-1}
          >
            {showNewPassword ? "Скрыть" : "Показать"}
          </button>
        </label>
        <label>
          Повторите новый пароль
          <input
            type={showRepeatPassword ? "text" : "password"}
            name="repeatPassword"
            value={passForm.repeatPassword}
            onChange={handlePassChange}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowRepeatPassword((v) => !v)}
            style={{ marginLeft: 8 }}
            tabIndex={-1}
          >
            {showRepeatPassword ? "Скрыть" : "Показать"}
          </button>
        </label>
        {passError && <div style={{ color: "#d32f2f" }}>{passError}</div>}
        {passSuccess && <div style={{ color: "#388e3c" }}>{passSuccess}</div>}
        <button type="submit" disabled={isUpdatingPassword}>
          {isUpdatingPassword ? "Изменение..." : "Изменить пароль"}
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
