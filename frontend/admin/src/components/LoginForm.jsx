// Componente del formulario de inicio de sesión
// Login form component

import { useState } from "react";
import "../styles/loginStyles.css";

/**
 * LoginForm — Formulario reutilizable de autenticación
 * LoginForm — Reusable authentication form
 *
 * Props:
 *  - onSubmit(user, pass): función que maneja el envío / function that handles submit
 *  - loading: boolean para deshabilitar el botón / boolean to disable button
 *  - error: string con mensaje de error / string with error message
 */
export default function LoginForm({ onSubmit, loading = false, error = "" }) {
  // Estado local de los campos / Local field state
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  // Manejo del envío del formulario / Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(user, pass);
  };

  return (
    <div className="login-card">
      {/* Título de la tarjeta / Card title */}
      <h2 className="login-card-title">Inicio de sesión</h2>

      <form onSubmit={handleSubmit}>
        <div className="login-field-group">
          {/* Campo usuario / Username field */}
          <div>
            <label className="login-label">Usuario</label>
            <input
              className="login-input"
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoComplete="username"
              placeholder="Ingresa tu usuario"
            />
          </div>

          {/* Campo contraseña / Password field */}
          <div>
            <label className="login-label">Contraseña</label>
            <input
              className="login-input"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="current-password"
              placeholder="Ingresa tu contraseña"
            />
          </div>
        </div>

        {/* Mensaje de error si existe / Error message if exists */}
        {error && <p className="login-error">{error}</p>}

        {/* Botón de iniciar sesión / Login button */}
        <button
          type="submit"
          disabled={loading}
          className="login-button"
        >
          {loading ? "Iniciando..." : "Iniciar"}
        </button>
      </form>
    </div>
  );
}