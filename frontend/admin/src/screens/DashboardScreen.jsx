// Pantalla principal del panel de control
// Main dashboard screen

import { useNavigate } from "react-router-dom";
import logo from "../assets/sookiLogo.png";

// ── Iconos de cada módulo / Module icons ──
// Para cambiar un ícono reemplaza el archivo en assets y actualiza el import
// To change an icon replace the file in assets and update the import
import iconFinanzas from "../assets/iconFinanzas.png";
import iconTiendas  from "../assets/iconTiendas.png";
import iconReportes from "../assets/iconReportes.png";
import iconUsuarios from "../assets/iconUsuarios.png";

import "../styles/dashboardStyles.css";

// Definición de los módulos del panel / Panel module definitions
const modules = [
  { id: "finanzas", label: "Finanzas",       icon: iconFinanzas, path: "/finance"  },
  { id: "tiendas",  label: "Tiendas activas", icon: iconTiendas,  path: "/shops"   },
  { id: "reportes", label: "Reportes",        icon: iconReportes, path: "/reports"  },
  { id: "usuarios", label: "Usuarios",        icon: iconUsuarios, path: "/users"  },
];

/**
 * DashboardScreen — Panel de control principal
 * DashboardScreen — Main control panel
 */
export default function DashboardScreen() {
  const navigate = useNavigate();

  // Cerrar sesión y volver al login / Logout and return to login
  const handleLogout = () => {
    // Aquí puedes limpiar el token o contexto de auth antes de redirigir
    // Here you can clear the token or auth context before redirecting
    // localStorage.removeItem('token');
    navigate("/");
  };

  return (
    <div className="dash-page">
      {/* Textura de fondo / Background texture */}
      <div className="dash-noise" />

      {/* ── Header ── */}
      <header className="dash-header">
        {/* Logo — mismo que en el login / Same logo as login */}
        <img src={logo} alt="Sooki Logo" className="dash-logo" />

        {/* Título / Title */}
        <h1 className="dash-title">Panel de control</h1>

        {/* Botón cerrar sesión / Logout button */}
        <button className="dash-logout-btn" onClick={handleLogout}>
          {/* Ícono de salida / Exit icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Cerrar sesión
        </button>
      </header>

      {/* ── Grid de módulos / Module grid ── */}
      <main className="dash-main">
        <div className="dash-grid-container">
          <div className="dash-grid">
            {modules.map((mod) => (
              <ModuleCard key={mod.id} module={mod} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * ModuleCard — Tarjeta individual de cada módulo
 * ModuleCard — Individual card for each module
 */
function ModuleCard({ module }) {
  const navigate = useNavigate();

  return (
    <div className="dash-card" onClick={() => navigate(module.path)}>
      {/* Ícono del módulo / Module icon */}
      <div className="dash-card-icon-wrap">
        <img
          src={module.icon}
          alt={module.label}
          className="dash-card-icon"
        />
      </div>

      {/* Nombre del módulo / Module name */}
      <p className="dash-card-label">{module.label}</p>
    </div>
  );
}