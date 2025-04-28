import React, { useState, useEffect } from "react";
import "./form.scss";
import { useCreateHabit, useUpdateHabit } from "../../query/mutations";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { HABIT } from "../../query/keys";
import { apiGetHabit } from "../../api/api";
import { useHabit } from "../../query/queries";
import Loader from "../Loader/Loader";
import DateTimePicker from "../DateTimePicker/DateTimePicker";

const Form = ({ type = "create" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    costPerWeek: "",
  });
  const [error, setError] = useState("");
  const { mutateAsync: createHabit, isPending: isCreating } = useCreateHabit();
  const { mutateAsync: updateHabit, isPending: isUpdating } = useUpdateHabit();
  const isEdit = type === "edit";

  // Получаем данные привычки через useQuery, если редактируем
  const {
    data: habitData,
    isLoading: isHabitLoading,
    error: habitError,
  } = useHabit(id, isEdit);

  useEffect(() => {
    if (isEdit && habitData) {
      setForm({
        title: habitData.title || "",
        description: habitData.description || "",
        costPerWeek:
          habitData.costPerWeek !== undefined ? habitData.costPerWeek : "",
        startedAt: habitData.startedAt.slice(0, 16) || "",
      });
    }
    if (habitError) setError("Ошибка загрузки привычки");
  }, [isEdit, habitData, habitError]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) {
      setError("Название обязательно");
      return;
    }
    try {
      if (isEdit && id) {
        await updateHabit({
          id,
          habit: {
            title: form.title,
            description: form.description,
            costPerWeek: form.costPerWeek ? Number(form.costPerWeek) : null,
            startedAt: form.startedAt
              ? new Date(form.startedAt).toISOString()
              : habitData.startedAt,
          },
        });
        navigate("/");
      } else {
        await createHabit({
          title: form.title,
          description: form.description,
          costPerWeek: form.costPerWeek ? Number(form.costPerWeek) : undefined,
          startedAt: form.startedAt
            ? new Date(form.startedAt).toISOString()
            : undefined,
        });
        setForm({ title: "", description: "", costPerWeek: "" });
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (isEdit && isHabitLoading) {
    return <Loader size={86} />;
  }

  return (
    <form className="habit-form" onSubmit={handleSubmit}>
      <h2 className="habit-form__title">
        {isEdit ? "Редактировать привычку" : "Какую привычку хотите бросить?"}
      </h2>
      <div className="habit-form__field">
        <label htmlFor="title">Название*</label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Например, Не пить кофе"
          value={form.title}
          onChange={handleChange}
          autoComplete="off"
          required
        />
      </div>
      <div className="habit-form__field">
        <label htmlFor="costPerWeek">Траты в неделю (₽)</label>
        <input
          id="costPerWeek"
          name="costPerWeek"
          type="number"
          min="0"
          placeholder="1000₽"
          value={form.costPerWeek}
          onChange={handleChange}
        />
      </div>
      <div className="habit-form__field">
        <label htmlFor="description">Описание</label>
        <textarea
          id="description"
          name="description"
          placeholder="Опишите почему вы хотите бросить эту привычку"
          value={form.description}
          onChange={handleChange}
          rows={3}
        />
      </div>
      <div className="habit-form__field">
        <label htmlFor="startedAt">Дата и время начала</label>
        <DateTimePicker
          id="startedAt"
          name="startedAt"
          value={form.startedAt}
          onChange={handleChange}
        />
      </div>

      {error && <div className="habit-form__error">{error}</div>}
      <button
        className="habit-form__submit"
        type="submit"
        disabled={isCreating || isUpdating}
      >
        {isEdit
          ? isUpdating
            ? "Сохранение..."
            : "Сохранить"
          : isCreating
          ? "Создание..."
          : "Создать"}
      </button>
    </form>
  );
};

export default Form;
