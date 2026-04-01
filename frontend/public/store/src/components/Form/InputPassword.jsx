import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./Form.css";

const InputPassword = ({ name, placeholder, register, setValue, error, disabled = false, validateMatch }) => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <div className="form-password-wrap">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          className={`form-input ${error ? "error" : ""}`}
          style={{ paddingRight: "44px" }}
          {...register(name, {
            required: "La contraseña es requerida",
            minLength: { value: 8, message: "Mínimo 8 caracteres" },
            ...(validateMatch ? { validate: validateMatch } : {}),
          })}
        />
        <button
          type="button"
          className="form-password-toggle"
          onClick={() => setShow(!show)}
          tabIndex={-1}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default InputPassword;