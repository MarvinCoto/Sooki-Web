// useLogin.js
// Hook para manejar el formulario de login
// Hook for managing login form

import { useState } from "react";
import { useAdmin } from "../context/AdminContext";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const { login }             = useAdmin();

  const handleLogin = async (user, pass) => {
    setError("");

    // Validación básica / Basic validation
    if (!user.trim() || !pass.trim()) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      await login(user, pass);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, handleLogin };
}