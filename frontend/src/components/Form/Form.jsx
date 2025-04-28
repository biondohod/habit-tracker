import React, { useState } from "react";
import "./form.scss";
import { useCreateHabit } from "../../query/mutations";

const Form = ({ onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    costPerWeek: "",
  });
  const [error, setError] = useState("");
  const { mutateAsync: createHabit, isPending } = useCreateHabit();

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
      await createHabit({
        title: form.title,
        description: form.description,
        costPerWeek: form.costPerWeek ? Number(form.costPerWeek) : undefined,
      });
      setForm({ title: "", description: "", costPerWeek: "" });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form className="habit-form" onSubmit={handleSubmit}>
      <h2 className="habit-form__title">Какую привычку хотите бросить?</h2>
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
      {error && <div className="habit-form__error">{error}</div>}
      <button className="habit-form__submit" type="submit" disabled={isPending}>
        {isPending ? "Создание..." : "Создать"}
      </button>
    </form>
  );
};

export default Form;
