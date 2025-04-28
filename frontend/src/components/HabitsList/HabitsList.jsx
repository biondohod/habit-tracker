import React from "react";
import Loader from "../Loader/Loader";
import HabitCard from "../HabitCard/HabitCard";
import "./habitsList.scss";
import { useHabits } from "../../query/queries";

const HabitsList = () => {
  const { data: habits, isLoading } = useHabits();

  if (isLoading) return <Loader size={64} />;

  if (!habits || habits.length === 0)
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>Нет привычек</div>
    );

  return (
    <div className="habits-list">
      {habits.map((habit) => (
        <HabitCard key={habit._id} habit={habit} />
      ))}
    </div>
  );
};

export default HabitsList;
