import React from "react";
import "./Form.css";

const InputEmail = ({ name, placeholder, register, setValue, error, disabled = false, rules = {} }) => (
  <div>
    <input
      type="email"
      placeholder={placeholder}
      disabled={disabled}
      className={`form-input ${error ? "error" : ""}`}
      {...register(name, {
        required: "El email es requerido",
        pattern: {
          value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          message: "Formato de email inválido",
        },
        ...rules,
      })}
    />
    {error && <p className="form-error">{error}</p>}
  </div>
);

export default InputEmail;