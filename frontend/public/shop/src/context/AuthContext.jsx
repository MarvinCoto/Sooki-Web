import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Se llama cuando el usuario verifica su correo exitosamente
    const onVerified = (storeData) => {
        setUser(storeData);
        setIsAuthenticated(true);
        // El token JWT se manejará en cookies desde el backend cuando se implemente el login
        // TODO: cuando el login esté listo, el backend setea la cookie httpOnly con el JWT
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        // TODO: llamar endpoint de logout para limpiar cookie del backend
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, onVerified, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

// Rutas públicas — accesibles sin autenticación
// TODO: agrega aquí tus rutas cuando las tengas listas
export const PUBLIC_ROUTES = [
    "/",           // registro
    "/login",      // login
    "/verify",     // verificación de correo
];