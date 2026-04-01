import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const { isLoggedIn, isLoading, hasCheckedAuth } = useAuth();

  // Solo bloquear si aún no hemos verificado el token por primera vez
  // Esto evita que el form se desmonte durante el login
  if (!hasCheckedAuth) return null;

  return !isLoggedIn ? <Outlet /> : <Navigate to="/profile" replace />;
};

export default PublicRoute;