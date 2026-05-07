// Pantalla principal del panel de control
// Main dashboard screen

import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import logo from "../assets/sookiLogo.png";

import iconFinanzas   from "../assets/iconFinanzas.png";
import iconTiendas    from "../assets/iconTiendas.png";
import iconReportes   from "../assets/iconReportes.png";
import iconUsuarios   from "../assets/iconUsuarios.png";
// Agrega tu ícono aquí cuando lo tengas / Add your icon here when ready
// import iconSolicitudes from "../assets/iconSolicitudes.png";

import "../styles/dashboardStyles.css";

const modules = [
  { id: "finanzas",     label: "Finanzas",                icon: iconFinanzas,  path: "/finance"   },
  { id: "tiendas",      label: "Tiendas activas",          icon: iconTiendas,   path: "/shops"     },
  { id: "reportes",     label: "Reportes",                 icon: iconReportes,  path: "/reports"   },
  { id: "usuarios",     label: "Usuarios",                 icon: iconUsuarios,  path: "/users"     },
  { id: "solicitudes",  label: "Solicitudes",              icon: null,          path: "/requests"  },
];

export default function DashboardScreen() {
  const { logout } = useAdmin();

  return (
    <div className="dash-page">
      <div className="dash-noise" />

      {/* ── Header ── */}
      <header className="dash-header">
        <img src={logo} alt="Sooki Logo" className="dash-logo" />
        <h1 className="dash-title">Panel de control</h1>
        <button className="dash-logout-btn" onClick={logout}>
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

function ModuleCard({ module }) {
  const navigate = useNavigate();

  return (
    <div className="dash-card" onClick={() => navigate(module.path)}>
      <div className="dash-card-icon-wrap">
        {module.icon
          ? <img src={module.icon} alt={module.label} className="dash-card-icon" />
          /* Placeholder para cuando no hay ícono / Placeholder when no icon */
          : <svg width="60" height="60" viewBox="0 0 24 24" fill="none"
              stroke="rgba(205,140,70,0.4)" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 12h6M12 9v6"/>
            </svg>
        }
      </div>
      <p className="dash-card-label">{module.label}</p>
    </div>
  );
}