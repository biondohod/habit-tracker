import React from "react";
import "./dateTimePicker.scss";

const DateTimePicker = ({ id, value, name, onChange }) => {
  return (
    <input
      id={id}
      name={name}
      type="datetime-local"
      value={value}
      onChange={onChange}
      className="date-time-picker"
      style={{
        padding: "12px 14px",
        border: "1px solid #e0e7ef",
        borderRadius: "13px",
        background: "#f4f6fb",
        fontSize: "16px",
        fontFamily: "Montserrat, Arial, sans-serif",
        transition: "border 0.2s",
      }}
    />
  );
};

export default DateTimePicker;
