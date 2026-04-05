// Pantalla de Gestión de Tiendas Activas
// Active Stores Management Screen

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/sookiLogo.png";
import "../styles/shopsStyles.css";

// ── Datos de ejemplo de tiendas / Sample store data ──
// Reemplaza con datos reales de tu API / Replace with real API data
const tiendasData = [
  { id: 1, nombre: "Nombre de la tienda", activa: true  },
  { id: 2, nombre: "Nombre de la tienda", activa: false },
  { id: 3, nombre: "Nombre de la tienda", activa: true  },
  { id: 4, nombre: "Nombre de la tienda", activa: false },
  { id: 5, nombre: "Nombre de la tienda", activa: false, inactiva: true },
];

// ── Tabs de detalles / Detail tabs ──
const tabs = ["Productos", "Ventas", "Inventario"];

// ── Productos de ejemplo / Sample products ──
// Reemplaza con datos reales / Replace with real data
const productosEjemplo = [
  { id: 1, nombre: "Nombre" },
  { id: 2, nombre: "Nombre" },
  { id: 3, nombre: "Nombre" },
  { id: 4, nombre: "Nombre" },
];

export default function TiendasScreen() {
  const navigate = useNavigate();

  // Tienda seleccionada / Selected store
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState(tiendasData[0]);
  // Tab activo / Active tab
  const [tabActivo, setTabActivo] = useState("Productos");
  // Estado local de tiendas (para el toggle) / Local store state (for toggle)
  const [tiendas, setTiendas] = useState(tiendasData);

  // Alterna el estado activo de una tienda / Toggle store active state
  const toggleTienda = (id) => {
    setTiendas(prev =>
      prev.map(t => t.id === id ? { ...t, activa: !t.activa, inactiva: false } : t)
    );
  };

  // Tienda seleccionada actualizada / Updated selected store
  const tiendaActual = tiendas.find(t => t.id === tiendaSeleccionada.id);

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

      {/* ── Contenido principal / Main content ── */}
      <main className="tnd-main">
        <div className="tnd-layout">

          {/* ── Panel izquierdo: lista de tiendas / Left panel: store list ── */}
          <div className="tnd-panel-izq">
            <p className="tnd-panel-titulo">Listado de tiendas activas</p>

            <div className="tnd-lista">
              {tiendas.map((tienda) => (
                <div
                  key={tienda.id}
                  className={`tnd-tienda-item ${tiendaSeleccionada.id === tienda.id ? "seleccionada" : ""}`}
                  onClick={() => setTiendaSeleccionada(tienda)}
                >
                  {/* Imagen placeholder de la tienda / Store image placeholder */}
                  <div className="tnd-tienda-img-placeholder">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                      stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>

                  {/* Nombre de la tienda / Store name */}
                  <span className="tnd-tienda-nombre">{tienda.nombre}</span>

                  {/* Estado — toggle o badge inactiva / State — toggle or inactive badge */}
                  {tienda.inactiva ? (
                    <span className="tnd-badge-inactiva">Inactiva</span>
                  ) : (
                    <button
                      className={`tnd-toggle ${tienda.activa ? "on" : "off"}`}
                      onClick={(e) => { e.stopPropagation(); toggleTienda(tienda.id); }}
                      title={tienda.activa ? "Desactivar" : "Activar"}
                    >
                      <span className="tnd-toggle-thumb" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Panel derecho / Right panel ── */}
          <div className="tnd-panel-der">

            {/* Detalles de tienda / Store details */}
            <div className="tnd-card">
              <p className="tnd-panel-titulo">Detalles de tienda</p>

              {/* Tabs / Tabs */}
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
                {tabActivo === "Productos" && (
                  <div className="tnd-productos-grid">
                    {productosEjemplo.map(p => (
                      <div key={p.id} className="tnd-producto-item">
                        {/* Imagen placeholder del producto / Product image placeholder */}
                        <div className="tnd-producto-img">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                        <span className="tnd-producto-nombre">{p.nombre}</span>
                      </div>
                    ))}
                  </div>
                )}

                {tabActivo === "Ventas" && (
                  <div className="tnd-tab-vacio">
                    <p>Datos de ventas próximamente</p>
                  </div>
                )}

                {tabActivo === "Inventario" && (
                  <div className="tnd-tab-vacio">
                    <p>Datos de inventario próximamente</p>
                  </div>
                )}
              </div>
            </div>

            {/* Acciones administrativas / Administrative actions */}
            <div className="tnd-card tnd-card-acciones">
              <p className="tnd-panel-titulo">Acciones Administrativas</p>

              {/* Toggle suspender/activar / Suspend/activate toggle */}
              <div className="tnd-accion-row">
                <span className="tnd-accion-label">Suspender / Activar Tiendas</span>
                <button
                  className={`tnd-toggle ${tiendaActual?.activa ? "on" : "off"}`}
                  onClick={() => toggleTienda(tiendaSeleccionada.id)}
                >
                  <span className="tnd-toggle-thumb" />
                </button>
              </div>

              {/* Botones de acción / Action buttons */}
              <div className="tnd-acciones-btns">
                <button className="tnd-btn-advertencia">Enviar Advertencia</button>
                <button className="tnd-btn-historial">Ver Historial</button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}