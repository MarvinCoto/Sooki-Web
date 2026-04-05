// Punto de entrada principal de la aplicación
// Main entry point of the application

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginScreen    from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import FinanceScreen  from "./screens/FinanceScreen";
import ShopsScreen    from "./screens/ShopsScreen";
import ReportsScreen  from "./screens/ReportsScreen";
import UsersScreen    from "./screens/UsersScreen";

/**
 * App — Configura el enrutador y las rutas principales
 * App — Sets up the router and main routes
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/"          element={<LoginScreen />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardScreen />} />

        {/* Modules / Módulos */}
        <Route path="/finance"   element={<FinanceScreen />} />
        <Route path="/shops"     element={<ShopsScreen />} />
        <Route path="/reports"   element={<ReportsScreen />} />
        <Route path="/users"     element={<UsersScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;