// Pantalla genérica para cada módulo del panel
// Generic screen for each dashboard module

import { useNavigate } from "react-router-dom";
import logo from "../assets/sookiLogo.png";
import "../styles/moduleStyles.css";

/**
 * ModuleScreen — Pantalla base reutilizable para cada módulo
 * ModuleScreen — Reusable base screen for each module
 *
 * Props:
 *  - title: string — nombre del módulo / module name
 */
export default function ModuleScreen({ title }) {
  const navigate = useNavigate();

  return (
    <div className="module-page">
      {/* Textura de fondo / Background texture */}
      <div className="module-noise" />

      {/* ── Header ── */}
      <header className="module-header">
        {/* Logo / Logo */}
        <img src={logo} alt="Sooki Logo" className="module-logo" />

        {/* Título del módulo / Module title */}
        <h1 className="module-title">{title}</h1>

        {/* Botón volver al dashboard / Back to dashboard button */}
        <button className="module-back-btn" onClick={() => navigate("/dashboard")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Volver
        </button>
      </header>

      {/* ── Contenido / Content ── */}
      <main className="module-main">
        <div className="module-container">
          {/* Placeholder — reemplaza este bloque con el contenido real del módulo */}
          {/* Placeholder — replace this block with the real module content        */}
          <div className="module-placeholder">
            <p className="module-placeholder-text">
              Contenido de <span>{title}</span> próximamente
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}