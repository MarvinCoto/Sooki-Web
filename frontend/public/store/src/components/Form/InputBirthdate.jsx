import React from "react";
import "./Form.css";

const InputBirthdate = ({ name, register, setValue, trigger, error }) => (
  <div>
    <input
      type="date"
      className={`form-input ${error ? "error" : ""}`}
      {...register(name, {
        required: "La fecha de nacimiento es requerida",
        validate: (value) => {
          const birth = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - birth.getFullYear();
          const monthDiff = today.getMonth() - birth.getMonth();
          if (birth > today) return "La fecha no puede ser futura";
          if (age < 18 || (age === 18 && monthDiff < 0)) return "Debes ser mayor de 18 años";
          if (age > 120) return "Fecha de nacimiento no válida";
          return true;
        },
      })}
    />
    {error && <p className="form-error">{error}</p>}
  </div>
);

export default InputBirthdate;