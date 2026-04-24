// Users Screen — Gestión de usuarios conectada al backend
// Users Screen — User management connected to backend

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/sookiLogo.png";
import { useClients } from "../hooks/useClients";
import "../styles/usersStyles.css";

const filtros = ["Todos", "Clientes", "Emprendedores"];

export default function UsersScreen() {
  const navigate = useNavigate();

  // Hook conectado al backend / Hook connected to backend
  const { clients, loading, error, toggleStatus } = useClients();

  const [filtroActivo, setFiltroActivo]     = useState("Todos");
  const [usuarioSeleccionado, setUsuario]   = useState(null);
  const [busqueda, setBusqueda]             = useState("");

  // Filtra la lista / Filter list
  const listaFiltrada = clients.filter(u => {
    const matchBusqueda = `${u.name} ${u.lastname}`
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    // Por ahora todos son clientes, cuando existan emprendedores se filtra por tipo
    // For now all are clients, when entrepreneurs exist filter by type
    const matchFiltro =
      filtroActivo === "Todos" ||
      filtroActivo === "Clientes";
    return matchFiltro && matchBusqueda;
  });

  return (
    <div className="usr-page">
      <div className="usr-noise" />

      {/* ── Header ── */}
      <header className="usr-header">
        <img src={logo} alt="Sooki Logo" className="usr-logo" />
        <h1 className="usr-title">Usuarios</h1>
        <button className="usr-back-btn" onClick={() => navigate("/dashboard")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver
        </button>
      </header>

      <main className="usr-main">

        <div className="usr-layout">

          {/* ── Panel izquierdo: tabla / Left panel: table ── */}
          <div className="usr-panel-izq">

            {/* ── Tabs ── */}
            <div className="usr-tabs">
              {filtros.map(f => (
                <button
                  key={f}
                  className={`usr-tab ${filtroActivo === f ? "activo" : ""}`}
                  onClick={() => { setFiltroActivo(f); setUsuario(null); }}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Buscador / Search */}
            <div className="usr-toolbar">
              <div className="usr-search-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(220,210,200,0.4)" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  className="usr-search"
                  type="text"
                  placeholder="Buscar usuario..."
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                />
              </div>
            </div>

            {/* Estado de carga / Loading state */}
            {loading && <p className="usr-sin-resultados">Cargando usuarios...</p>}
            {error   && <p className="usr-sin-resultados" style={{ color: "#e07070" }}>{error}</p>}

            {/* Tabla / Table */}
            {!loading && !error && (
              <div className="usr-tabla-wrap">
                <table className="usr-tabla">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Email</th>
                      <th>Tipo</th>
                      <th>Estado</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listaFiltrada.map(u => (
                      <tr
                        key={u._id}
                        className={usuarioSeleccionado?._id === u._id ? "seleccionada" : ""}
                        onClick={() => setUsuario(u)}
                      >
                        <td>
                          <div className="usr-cell-usuario">
                            <div className="usr-avatar">
                              {u.photo
                                ? <img src={u.photo} alt={u.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.3)"/>
                                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="rgba(255,255,255,0.3)"/>
                                  </svg>
                              }
                            </div>
                            <span>{u.name} {u.lastname}</span>
                          </div>
                        </td>
                        <td className="usr-cell-email">{u.email}</td>
                        <td>
                          <span className="usr-badge cliente">Cliente</span>
                        </td>
                        <td>
                          <span className={`usr-estado ${u.isActive !== false ? "activo" : "inactivo"}`}>
                            {u.isActive !== false ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`usr-toggle ${u.isActive !== false ? "on" : "off"}`}
                            onClick={e => { e.stopPropagation(); toggleStatus(u._id); }}
                          >
                            <span className="usr-toggle-thumb" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {listaFiltrada.length === 0 && !loading && (
                  <div className="usr-sin-resultados">No se encontraron usuarios</div>
                )}
              </div>
            )}

            <p className="usr-contador">{listaFiltrada.length} usuario{listaFiltrada.length !== 1 ? "s" : ""}</p>
          </div>

          {/* ── Panel detalles / Details panel ── */}
          {usuarioSeleccionado && (
            <div className="usr-detalles">
              <div className="usr-detalles-header">
                <div className="usr-detalles-avatar">
                  {usuarioSeleccionado.photo
                    ? <img src={usuarioSeleccionado.photo} alt={usuarioSeleccionado.name}
                        style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                    : <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" fill="rgba(205,140,70,0.8)"/>
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="rgba(205,140,70,0.8)"/>
                      </svg>
                  }
                </div>
                <div>
                  <p className="usr-detalles-nombre">{usuarioSeleccionado.name} {usuarioSeleccionado.lastname}</p>
                  <span className="usr-badge cliente">Cliente</span>
                </div>
                <button className="usr-detalles-cerrar" onClick={() => setUsuario(null)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div className="usr-detalles-divider" />

              <div className="usr-detalles-body">
                <div className="usr-detalle-row">
                  <span className="usr-detalle-label">Email</span>
                  <span className="usr-detalle-valor">{usuarioSeleccionado.email}</span>
                </div>
                <div className="usr-detalle-row">
                  <span className="usr-detalle-label">Estado</span>
                  <span className={`usr-estado ${usuarioSeleccionado.isActive !== false ? "activo" : "inactivo"}`}>
                    {usuarioSeleccionado.isActive !== false ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <div className="usr-detalle-row">
                  <span className="usr-detalle-label">Verificado</span>
                  <span className="usr-detalle-valor">
                    {usuarioSeleccionado.isVerified ? "✓ Sí" : "✗ No"}
                  </span>
                </div>
                <div className="usr-detalle-row">
                  <span className="usr-detalle-label">Registro</span>
                  <span className="usr-detalle-valor">
                    {new Date(usuarioSeleccionado.createdAt).toLocaleDateString("es-ES")}
                  </span>
                </div>
                <div className="usr-detalle-row">
                  <span className="usr-detalle-label">Favoritos</span>
                  <span className="usr-detalle-valor">{usuarioSeleccionado.favorites?.length || 0}</span>
                </div>
              </div>

              <div className="usr-detalles-divider" />

              <div className="usr-detalles-acciones">
                <button
                  className={`usr-btn-estado ${usuarioSeleccionado.isActive !== false ? "suspender" : "activar"}`}
                  onClick={() => toggleStatus(usuarioSeleccionado._id)}
                >
                  {usuarioSeleccionado.isActive !== false ? "Suspender usuario" : "Activar usuario"}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}