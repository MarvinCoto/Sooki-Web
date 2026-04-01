import React from "react";
import "./Form.css";

const InputCode = ({ name, register, error }) => (
  <div>
    <input
      type="text"
      placeholder="000000"
      maxLength={6}
      className={`form-code-input ${error ? "error" : ""}`}
      {...register(name, {
        required: "El código es requerido",
        minLength: { value: 6, message: "El código debe tener 6 dígitos" },
        maxLength: { value: 6, message: "El código debe tener 6 dígitos" },
        pattern: { value: /^\d{6}$/, message: "El código debe ser numérico" },
      })}
    />
    {error && <p className="form-error">{error}</p>}
  </div>
);

export default InputCode;