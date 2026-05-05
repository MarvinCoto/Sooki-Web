// App.jsx
// Punto de entrada principal con rutas protegidas
// Main entry point with protected routes

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminProvider, useAdmin } from "./context/AdminContext";
import LoginScreen     from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import FinanceScreen   from "./screens/FinanceScreen";
import ShopsScreen     from "./screens/ShopsScreen";
import ReportsScreen   from "./screens/ReportsScreen";
import UsersScreen     from "./screens/UsersScreen";

// Ruta protegida — solo admins / Protected route — admins only
function ProtectedRoute({ children }) {
  const { admin, loading } = useAdmin();

  if (loading) return (
    <div style={{
      width: "100vw", height: "100vh",
      background: "#151c2c",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "rgba(205,140,70,0.7)", fontFamily: "Georgia, serif", fontSize: "16px"
    }}>
      Cargando...
    </div>
  );

  // Si no hay admin redirige al login / If no admin redirect to login
  return admin ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Login — ruta pública / Public route */}
      <Route path="/" element={<LoginScreen />} />

      {/* Rutas protegidas / Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
      <Route path="/finance"   element={<ProtectedRoute><FinanceScreen /></ProtectedRoute>} />
      <Route path="/shops"     element={<ProtectedRoute><ShopsScreen /></ProtectedRoute>} />
      <Route path="/reports"   element={<ProtectedRoute><ReportsScreen /></ProtectedRoute>} />
      <Route path="/users"     element={<ProtectedRoute><UsersScreen /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <AppRoutes />
      </AdminProvider>
    </BrowserRouter>
  );
}

export default App;