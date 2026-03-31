import React from "react";
import "./Form.css";

const Button = ({ type = "submit", text, disabled = false, onClick, className = "" }) => (
  <button
    type={type}
    className={`form-btn ${className}`}
    disabled={disabled}
    onClick={onClick}
  >
    {text}
  </button>
);

export default Button;