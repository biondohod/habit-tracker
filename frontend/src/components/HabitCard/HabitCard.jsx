import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./habitCard.scss";
import { useDeleteHabit, useUpdateHabit } from "../../query/mutations";
import { formatDate, getDuration } from "../../helpers/dateHelpers";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

const HabitCard = ({ habit }) => {
  const [timer, setTimer] = useState(getDuration(habit.startedAt));
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { mutateAsync: deleteHabit, isPending: isDeletingHabit } =
    useDeleteHabit();
  const { mutateAsync: updateHabit, isPending: isPendingHabit } =
    useUpdateHabit(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(getDuration(habit.startedAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [habit.startedAt]);

  const updateHabitHandler = async () => {
    const currentDate = new Date();
    const newData = {
      attempts: habit.attempts + 1,
      startedAt: currentDate.toISOString(),
    };
    await updateHabit({ id: habit._id, habit: newData });
    setTimer(getDuration(currentDate.toISOString()));
  };

  return (
    <div className="habit-card">
      <div className="habit-card__header">
        <h3 className="habit-card__title">{habit.title}</h3>
        <span className="habit-card__created">
          пытаюсь бросить с {formatDate(habit.initialAttemptAt)}
        </span>
      </div>
      {habit.description && (
        <div className="habit-card__desc">{habit.description}</div>
      )}
      <div className="habit-card__info">
        <div>
          <span className="habit-card__label">Попыток:</span>{" "}
          <b>{habit.attempts}</b>
        </div>
        {habit.costPerWeek > 0 && habit.moneySaved !== undefined && (
          <div>
            <span className="habit-card__label">Сэкономлено:</span>{" "}
            <b>{habit.moneySaved} ₽</b>
          </div>
        )}
      </div>
      <div className="habit-card__timer">
        <span className="habit-card__label">Время без срыва:</span>{" "}
        <b>{timer}</b>
      </div>
      <div className="habit-card__actions">
        <button
          className="habit-card__btn habit-card__btn--fail"
          onClick={updateHabitHandler}
          disabled={isPendingHabit}
        >
          Сорвался
        </button>
        <button
          className="habit-card__btn habit-card__btn--edit"
          onClick={() => navigate(`/edit/${habit._id}`)}
        >
          Редактировать
        </button>
        <button
          className="habit-card__btn habit-card__btn--delete"
          onClick={() => setShowModal(true)}
          disabled={isDeletingHabit}
        >
          Удалить
        </button>
      </div>
      {showModal && (
        <ConfirmationModal
          title="Вы точно хотите удалить эту привычку?"
          confirmText="Удалить"
          cancelText="Отмена"
          isPending={isDeletingHabit}
          onConfirm={async () => {
            await deleteHabit(habit._id);
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default HabitCard;
