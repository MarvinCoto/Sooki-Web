// Hook personalizado para la lógica de autenticación del login
// Custom hook for login authentication logic

import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * useLogin — Maneja el estado y la lógica del inicio de sesión
 * useLogin — Handles login state and logic
 *
 * Retorna / Returns:
 *  - loading: boolean — petición en curso / request in progress
 *  - error: string   — mensaje de error / error message
 *  - handleLogin(user, pass) — función para iniciar sesión / function to log in
 */
export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /**
   * handleLogin — Envía las credenciales al servidor
   * handleLogin — Sends credentials to the server
   */
  const handleLogin = async (user, pass) => {
    // Limpiar error previo / Clear previous error
    setError("");

    // Validación básica en el cliente / Basic client-side validation
    if (!user.trim() || !pass.trim()) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);

    try {
      // ── Aquí conectas con tu servicio de autenticación ──
      // ── Connect here with your authentication service  ──
      // Ejemplo / Example:
      // const data = await authService.login(user, pass);
      // if (data.token) navigate('/dashboard');

      // Simula delay de red / Simulates network delay
      // Quita esto cuando conectes tu API real / Remove this when connecting your real API
      await new Promise((res) => setTimeout(res, 800));

      // Navega al dashboard al iniciar sesión correctamente
      // Navigate to dashboard on successful login
      navigate("/dashboard");

    } catch (err) {
      // Manejo de errores del servidor / Server error handling
      setError(err?.message || "Error al iniciar sesión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, handleLogin };
}