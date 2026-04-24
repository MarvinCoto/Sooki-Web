// ShopsScreen.jsx
// Pantalla de Gestión de Tiendas conectada al backend
// Shops management screen connected to backend

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/sookiLogo.png";
import { useShops } from "../hooks/useShops";
import "../styles/shopsStyles.css";

const tabs = ["Productos", "Ventas", "Inventario"];

export default function ShopsScreen() {
  const navigate = useNavigate();

  // Hook conectado al backend / Hook connected to backend
  const { shops, loading, error, toggleStatus } = useShops();

  const [tiendaSeleccionada, setTiendaSeleccionada] = useState(null);
  const [tabActivo, setTabActivo]                   = useState("Productos");

  return (
    <div className="tnd-page">
      <div className="tnd-noise" />

      {/* ── Header ── */}
      <header className="tnd-header">
        <img src={logo} alt="Sooki Logo" className="tnd-logo" />
        <h1 className="tnd-title">Gestion de Tiendas activas</h1>
        <button className="tnd-back-btn" onClick={() => navigate("/dashboard")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver
        </button>
      </header>

      <main className="tnd-main">
        <div className="tnd-layout">

          {/* ── Panel izquierdo: lista / Left panel: list ── */}
          <div className="tnd-panel-izq">
            <p className="tnd-panel-titulo">Listado de tiendas activas</p>

            {/* Estados de carga / Loading states */}
            {loading && <p className="tnd-loading">Cargando tiendas...</p>}
            {error   && <p className="tnd-error">{error}</p>}

            <div className="tnd-lista">
              {shops.map((tienda) => (
                <div
                  key={tienda._id}
                  className={`tnd-tienda-item ${tiendaSeleccionada?._id === tienda._id ? "seleccionada" : ""}`}
                  onClick={() => setTiendaSeleccionada(tienda)}
                >
                  {/* Logo de la tienda / Store logo */}
                  <div className="tnd-tienda-img-placeholder">
                    {tienda.logo
                      ? <img src={tienda.logo} alt={tienda.storeName}
                          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
                      : <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                          stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                    }
                  </div>

                  <span className="tnd-tienda-nombre">{tienda.storeName}</span>

                  {/* Toggle activo / Active toggle */}
                  <button
                    className={`tnd-toggle ${tienda.isActive ? "on" : "off"}`}
                    onClick={(e) => { e.stopPropagation(); toggleStatus(tienda._id); }}
                  >
                    <span className="tnd-toggle-thumb" />
                  </button>
                </div>
              ))}

              {!loading && shops.length === 0 && (
                <p className="tnd-loading">No hay tiendas registradas</p>
              )}
            </div>
          </div>

          {/* ── Panel derecho / Right panel ── */}
          <div className="tnd-panel-der">

            {/* Detalles de tienda / Store details */}
            <div className="tnd-card">
              <p className="tnd-panel-titulo">
                {tiendaSeleccionada ? tiendaSeleccionada.storeName : "Detalles de tienda"}
              </p>

              {/* Tabs */}
              <div className="tnd-tabs">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    className={`tnd-tab ${tabActivo === tab ? "activo" : ""}`}
                    onClick={() => setTabActivo(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Contenido del tab / Tab content */}
              <div className="tnd-tab-contenido">
                {!tiendaSeleccionada ? (
                  <div className="tnd-tab-vacio">
                    <p>Selecciona una tienda para ver sus detalles</p>
                  </div>
                ) : (
                  <>
                    {tabActivo === "Productos" && (
                      <div className="tnd-tab-vacio">
                        <p>Productos de {tiendaSeleccionada.storeName} próximamente</p>
                      </div>
                    )}
                    {tabActivo === "Ventas" && (
                      <div className="tnd-tab-vacio">
                        <p>Ventas próximamente</p>
                      </div>
                    )}
                    {tabActivo === "Inventario" && (
                      <div className="tnd-tab-vacio">
                        <p>Inventario próximamente</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Acciones administrativas / Administrative actions */}
            {tiendaSeleccionada && (
              <div className="tnd-card tnd-card-acciones">
                <p className="tnd-panel-titulo">Acciones Administrativas</p>

                <div className="tnd-accion-row">
                  <span className="tnd-accion-label">Suspender / Activar Tienda</span>
                  <button
                    className={`tnd-toggle ${tiendaSeleccionada.isActive ? "on" : "off"}`}
                    onClick={() => toggleStatus(tiendaSeleccionada._id)}
                  >
                    <span className="tnd-toggle-thumb" />
                  </button>
                </div>

                <div className="tnd-acciones-btns">
                  <button className="tnd-btn-advertencia">Enviar Advertencia</button>
                  <button className="tnd-btn-historial">Ver Historial</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}