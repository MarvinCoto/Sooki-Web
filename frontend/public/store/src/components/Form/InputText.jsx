import React from "react";
import "./Form.css";

const InputText = ({ name, placeholder, register, setValue, error, disabled = false, rules = {} }) => (
  <div>
    <input
      type="text"
      placeholder={placeholder}
      disabled={disabled}
      className={`form-input ${error ? "error" : ""}`}
      {...register(name, {
        required: `${placeholder} es requerido`,
        ...rules,
      })}
    />
    {error && <p className="form-error">{error}</p>}
  </div>
);

export default InputText;