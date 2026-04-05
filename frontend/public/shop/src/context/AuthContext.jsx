import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true); // verifica sesion al cargar

    // Al montar, verifica si hay sesion activa via cookie
    useEffect(() => {
        const verifySession = async () => {
            try {
                const response = await fetch(`${API_URL}/login/verify`, {
                    credentials: "include", // envia cookies
                });
                const data = await response.json();
                if (data.success) {
                    setUser(data.user);
                    setIsAuthenticated(true);
                }
            } catch {
                // no hay sesion activa
            } finally {
                setAuthLoading(false);
            }
        };
        verifySession();
    }, []);

    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            await fetch(`${API_URL}/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch {
            // si falla el fetch igual limpiamos el estado local
        }
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, authLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

// Rutas publicas — accesibles sin autenticacion
export const PUBLIC_ROUTES = [
    "/",
    "/login",
    "/setup-credentials",
];