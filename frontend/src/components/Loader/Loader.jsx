import React from "react";
import "./loader.scss";

const Loader = ({ size = 64, margin = 0 }) => (
  <div className="loader__wrapper">
    <div
      className="loader"
      style={{
        width: size,
        height: size,
        margin,
        display: "inline-block",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        style={{ display: "block" }}
      >
        <circle
          cx="16"
          cy="16"
          r="12"
          fill="none"
          stroke="#7b9acc"
          strokeWidth="4"
          opacity="0.2"
        />
        <circle
          className="loader__spinner"
          cx="16"
          cy="16"
          r="12"
          fill="none"
          stroke="#5b7bb2"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="75"
          strokeDashoffset="60"
        />
      </svg>
    </div>
  </div>
);

export default Loader;
