import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return null;

  return !isLoggedIn ? <Outlet /> : <Navigate to="/profile" replace />;
};

export default PublicRoute;