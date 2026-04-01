import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f8fafc" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          <div style={{ width: "48px", height: "48px", border: "4px solid #e2e8f0", borderTop: "4px solid #FF8C42", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <p style={{ fontSize: "15px", color: "#64748b", margin: 0 }}>Verificando sesión...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isLoggedIn || !user) return <Navigate to="/login" replace />;

  return children;
};

export default PrivateRoute;