// Users Screen — Gestión de usuarios estilo tabla admin
// Users Screen — Admin table style user management

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/sookiLogo.png";
import "../styles/usersStyles.css";

// ── Datos de ejemplo / Sample data ──
// Reemplaza con datos reales de tu API / Replace with real API data
const usuariosData = [
  { id: 1, nombre: "Nombre del usuario", email: "usuario@email.com", tipo: "Cliente",       estado: true  },
  { id: 2, nombre: "Nombre del usuario", email: "usuario@email.com", tipo: "Emprendedor",   estado: true  },
  { id: 3, nombre: "Nombre del usuario", email: "usuario@email.com", tipo: "Cliente",       estado: false },
  { id: 4, nombre: "Nombre del usuario", email: "usuario@email.com", tipo: "Emprendedor",   estado: true  },
  { id: 5, nombre: "Nombre del usuario", email: "usuario@email.com", tipo: "Cliente",       estado: true  },
  { id: 6, nombre: "Nombre del usuario", email: "usuario@email.com", tipo: "Emprendedor",   estado: false },
  { id: 7, nombre: "Nombre del usuario", email: "usuario@email.com", tipo: "Cliente",       estado: true  },
];

// Filtros disponibles / Available filters
const filtros = ["Todos", "Clientes", "Emprendedores"];

export default function UsersScreen() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios]               = useState(usuariosData);
  const [filtroActivo, setFiltroActivo]       = useState("Todos");
  const [usuarioSeleccionado, setUsuario]     = useState(null);
  const [busqueda, setBusqueda]               = useState("");

  // Filtra la lista según el filtro y la búsqueda / Filter list by filter and search
  const listaFiltrada = usuarios.filter(u => {
    const matchFiltro =
      filtroActivo === "Todos" ||
      (filtroActivo === "Clientes"      && u.tipo === "Cliente") ||
      (filtroActivo === "Emprendedores" && u.tipo === "Emprendedor");
    const matchBusqueda = u.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return matchFiltro && matchBusqueda;
  });

  // Alterna el estado del usuario / Toggle user state
  const toggleEstado = (id) => {
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, estado: !u.estado } : u));
    // Actualiza el usuario seleccionado si es el mismo / Update selected if same
    if (usuarioSeleccionado?.id === id) {
      setUsuario(prev => ({ ...prev, estado: !prev.estado }));
    }
  };

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

            {/* Barra de herramientas / Toolbar */}
            <div className="usr-toolbar">

              {/* Buscador / Search bar */}
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

              {/* Filtros / Filters */}
              <div className="usr-filtros">
                {filtros.map(f => (
                  <button
                    key={f}
                    className={`usr-filtro ${filtroActivo === f ? "activo" : ""}`}
                    onClick={() => setFiltroActivo(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabla / Table */}
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
                      key={u.id}
                      className={usuarioSeleccionado?.id === u.id ? "seleccionada" : ""}
                      onClick={() => setUsuario(u)}
                    >
                      {/* Avatar + nombre / Avatar + name */}
                      <td>
                        <div className="usr-cell-usuario">
                          <div className="usr-avatar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.3)"/>
                              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="rgba(255,255,255,0.3)"/>
                            </svg>
                          </div>
                          <span>{u.nombre}</span>
                        </div>
                      </td>

                      <td className="usr-cell-email">{u.email}</td>

                      {/* Badge tipo / Type badge */}
                      <td>
                        <span className={`usr-badge ${u.tipo === "Cliente" ? "cliente" : "emprendedor"}`}>
                          {u.tipo}
                        </span>
                      </td>

                      {/* Estado / Status */}
                      <td>
                        <span className={`usr-estado ${u.estado ? "activo" : "inactivo"}`}>
                          {u.estado ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      {/* Toggle / Toggle */}
                      <td>
                        <button
                          className={`usr-toggle ${u.estado ? "on" : "off"}`}
                          onClick={e => { e.stopPropagation(); toggleEstado(u.id); }}
                        >
                          <span className="usr-toggle-thumb" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Sin resultados / No results */}
              {listaFiltrada.length === 0 && (
                <div className="usr-sin-resultados">
                  No se encontraron usuarios
                </div>
              )}
            </div>

            {/* Contador / Counter */}
            <p className="usr-contador">
              {listaFiltrada.length} usuario{listaFiltrada.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* ── Panel derecho: detalles / Right panel: details ── */}
          {usuarioSeleccionado && (
            <div className="usr-detalles">
              <div className="usr-detalles-header">
                <div className="usr-detalles-avatar">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" fill="rgba(205,140,70,0.8)"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="rgba(205,140,70,0.8)"/>
                  </svg>
                </div>
                <div>
                  <p className="usr-detalles-nombre">{usuarioSeleccionado.nombre}</p>
                  <span className={`usr-badge ${usuarioSeleccionado.tipo === "Cliente" ? "cliente" : "emprendedor"}`}>
                    {usuarioSeleccionado.tipo}
                  </span>
                </div>
                {/* Cerrar panel / Close panel */}
                <button className="usr-detalles-cerrar" onClick={() => setUsuario(null)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div className="usr-detalles-divider" />

              {/* Datos del usuario / User data */}
              <div className="usr-detalles-body">
                <div className="usr-detalle-row">
                  <span className="usr-detalle-label">Email</span>
                  <span className="usr-detalle-valor">{usuarioSeleccionado.email}</span>
                </div>
                <div className="usr-detalle-row">
                  <span className="usr-detalle-label">Estado</span>
                  <span className={`usr-estado ${usuarioSeleccionado.estado ? "activo" : "inactivo"}`}>
                    {usuarioSeleccionado.estado ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <div className="usr-detalle-row">
                  <span className="usr-detalle-label">ID</span>
                  <span className="usr-detalle-valor"># {usuarioSeleccionado.id}</span>
                </div>

                {/* Campos extra — agrega los que necesites / Extra fields — add as needed */}
                <div className="usr-detalle-row">
                  <span className="usr-detalle-label">Registro</span>
                  <span className="usr-detalle-valor">Ejemplo de dato</span>
                </div>
                <div className="usr-detalle-row">
                  <span className="usr-detalle-label">Último acceso</span>
                  <span className="usr-detalle-valor">Ejemplo de dato</span>
                </div>
              </div>

              <div className="usr-detalles-divider" />

              {/* Acciones del usuario / User actions */}
              <div className="usr-detalles-acciones">
                <button
                  className={`usr-btn-estado ${usuarioSeleccionado.estado ? "suspender" : "activar"}`}
                  onClick={() => toggleEstado(usuarioSeleccionado.id)}
                >
                  {usuarioSeleccionado.estado ? "Suspender usuario" : "Activar usuario"}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}