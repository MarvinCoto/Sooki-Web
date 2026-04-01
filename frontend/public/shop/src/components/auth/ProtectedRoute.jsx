import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// allowedRoles: array de roles permitidos, ej: ["shop"] o ["admin"]
// Si no se pasa allowedRoles, solo verifica que este autenticado
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, authLoading, user } = useAuth();

    // Mientras verifica la sesion al cargar, no renderiza nada
    if (authLoading) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#1B2B44",
                color: "#F2F5F8",
                fontFamily: "sans-serif",
                fontSize: "0.9rem"
            }}>
                Cargando...
            </div>
        );
    }

    // Si no esta autenticado, redirige al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si se especificaron roles y el usuario no tiene el rol permitido
    if (allowedRoles && !allowedRoles.includes(user?.userType)) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;