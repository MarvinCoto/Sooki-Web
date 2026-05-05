// AdminContext.jsx
// Contexto global para el estado de autenticación del admin
// Global context for admin authentication state

import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminAuthService from "../services/adminAuthService";

// Crear el contexto / Create context
const AdminContext = createContext();

// Hook para usar el contexto / Hook to use context
export const useAdmin = () => useContext(AdminContext);

// Proveedor del contexto / Context provider
export function AdminProvider({ children }) {
  const [admin, setAdmin]       = useState(null);
  const [loading, setLoading]   = useState(true); // Verifica el token al cargar
  const navigate                = useNavigate();

  // Verifica si hay sesión activa al cargar la app
  // Checks for active session on app load
  useEffect(() => {
    const verifySession = async () => {
      try {
        const data = await adminAuthService.verify();
        if (data.user?.userType === "admin") {
          setAdmin(data.user);
        }
      } catch {
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, []);

  // Iniciar sesión / Login
  const login = async (email, password) => {
    const data = await adminAuthService.login(email, password);
    setAdmin(data.user);
    navigate("/dashboard");
  };

  // Cerrar sesión / Logout
  const logout = async () => {
    await adminAuthService.logout();
    setAdmin(null);
    navigate("/");
  };

  return (
    <AdminContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}