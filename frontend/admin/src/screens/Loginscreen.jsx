// Pantalla principal de inicio de sesión
// Main login screen

import "../styles/loginStyles.css";
import { useLogin } from "../hooks/useLogin";
import BrandPanel from "../components/BrandPanel";
import LoginForm from "../components/LoginForm";

/**
 * LoginScreen — Ensambla el BrandPanel y el LoginForm
 * LoginScreen — Assembles BrandPanel and LoginForm
 */
export default function LoginScreen() {
  // Hook con toda la lógica de autenticación / Hook with all auth logic
  const { loading, error, handleLogin } = useLogin();

  return (
    <div className="login-page">
      {/* Textura de fondo / Background texture */}
      <div className="login-noise" />

      {/* Contenedor principal / Main container */}
      <div className="login-wrapper">
        {/* Panel de marca izquierdo / Left brand panel */}
        <BrandPanel />

        {/* Formulario de login derecho / Right login form */}
        <LoginForm
          onSubmit={handleLogin}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}