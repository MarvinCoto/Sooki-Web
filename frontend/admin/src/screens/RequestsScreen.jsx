// RequestsScreen.jsx
// Pantalla de solicitudes de emprendedores pendientes de aprobación
// Entrepreneur requests screen pending approval

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/sookiLogo.png";
import { useRequests } from "../hooks/useRequests";
import "../styles/requestsStyles.css";

export default function RequestsScreen() {
  const navigate = useNavigate();
  const { requests, loading, error, approveStore } = useRequests();

  // Solicitud seleccionada para ver detalles / Selected request for details
  const [selected, setSelected]   = useState(null);
  // Filtro activo / Active filter
  const [filtro, setFiltro]       = useState("todos");
  // Estado de aprobación / Approval state
  const [approving, setApproving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Filtra solicitudes / Filter requests
  const listaFiltrada = requests.filter(r => {
    if (filtro === "pendientes") return !r.isVerified;
    if (filtro === "aprobadas")  return r.isVerified;
    return true;
  });

  // Maneja la aprobación / Handle approval
  const handleApprove = async (ownerId) => {
    setApproving(true);
    setSuccessMsg("");
    const ok = await approveStore(ownerId);
    if (ok) {
      setSuccessMsg("¡Tienda aprobada! Se envió el email al emprendedor.");
      setSelected(prev => ({ ...prev, isVerified: true }));
    }
    setApproving(false);
  };

  return (
    <div className="req-page">
      <div className="req-noise" />

      {/* ── Header ── */}
      <header className="req-header">
        <img src={logo} alt="Sooki Logo" className="req-logo" />
        <h1 className="req-title">Solicitudes de Emprendedores</h1>
        <button className="req-back-btn" onClick={() => navigate("/dashboard")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver
        </button>
      </header>

      <main className="req-main">
        <div className="req-layout">

          {/* ── Panel izquierdo: lista / Left panel: list ── */}
          <div className="req-panel-izq">

            {/* Filtros / Filters */}
            <div className="req-filtros">
              {["todos", "pendientes", "aprobadas"].map(f => (
                <button
                  key={f}
                  className={`req-filtro ${filtro === f ? "activo" : ""}`}
                  onClick={() => { setFiltro(f); setSelected(null); }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Estado de carga / Loading state */}
            {loading && <p className="req-loading">Cargando solicitudes...</p>}
            {error   && <p className="req-error">{error}</p>}

            {/* Lista de solicitudes / Requests list */}
            <div className="req-lista">
              {listaFiltrada.map(r => (
                <div
                  key={r._id}
                  className={`req-item ${selected?._id === r._id ? "seleccionado" : ""}`}
                  onClick={() => { setSelected(r); setSuccessMsg(""); }}
                >
                  {/* Avatar / Avatar */}
                  <div className="req-avatar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.3)"/>
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="rgba(255,255,255,0.3)"/>
                    </svg>
                  </div>

                  <div className="req-item-info">
                    <span className="req-item-nombre">{r.ownerName}</span>
                    <span className="req-item-email">{r.email}</span>
                  </div>

                  {/* Badge estado / Status badge */}
                  <span className={`req-badge ${r.isVerified ? "aprobada" : "pendiente"}`}>
                    {r.isVerified ? "Aprobada" : "Pendiente"}
                  </span>
                </div>
              ))}

              {!loading && listaFiltrada.length === 0 && (
                <p className="req-loading">No hay solicitudes</p>
              )}
            </div>

            {/* Contador / Counter */}
            <p className="req-contador">
              {listaFiltrada.length} solicitud{listaFiltrada.length !== 1 ? "es" : ""}
            </p>
          </div>

          {/* ── Panel derecho: detalles / Right panel: details ── */}
          {selected && (
            <div className="req-detalles">

              {/* Cabecera / Header */}
              <div className="req-detalles-header">
                <div>
                  <p className="req-detalles-nombre">{selected.ownerName}</p>
                  <span className={`req-badge ${selected.isVerified ? "aprobada" : "pendiente"}`}>
                    {selected.isVerified ? "Aprobada" : "Pendiente"}
                  </span>
                </div>
                <button className="req-cerrar" onClick={() => setSelected(null)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div className="req-divider" />

              {/* Información personal / Personal info */}
              <div className="req-seccion">
                <p className="req-seccion-titulo">Información Personal</p>
                <div className="req-filas">
                  <div className="req-fila">
                    <span className="req-label">Nombre</span>
                    <span className="req-valor">{selected.ownerName}</span>
                  </div>
                  <div className="req-fila">
                    <span className="req-label">Email</span>
                    <span className="req-valor">{selected.email}</span>
                  </div>
                  <div className="req-fila">
                    <span className="req-label">Teléfono</span>
                    <span className="req-valor">{selected.phoneNumber}</span>
                  </div>
                  <div className="req-fila">
                    <span className="req-label">Documento</span>
                    <span className="req-valor">{selected.documentType}</span>
                  </div>
                  {selected.nit && (
                    <div className="req-fila">
                      <span className="req-label">NIT</span>
                      <span className="req-valor">{selected.nit}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="req-divider" />

              {/* Datos bancarios / Bank info */}
              <div className="req-seccion">
                <p className="req-seccion-titulo">Datos Bancarios</p>
                <div className="req-filas">
                  <div className="req-fila">
                    <span className="req-label">Titular</span>
                    <span className="req-valor">{selected.accountHolderName}</span>
                  </div>
                  <div className="req-fila">
                    <span className="req-label">Banco</span>
                    <span className="req-valor">{selected.bankName}</span>
                  </div>
                  <div className="req-fila">
                    <span className="req-label">Tipo</span>
                    <span className="req-valor">{selected.accountType}</span>
                  </div>
                </div>
              </div>

              <div className="req-divider" />

              {/* Documentos / Documents */}
              <div className="req-seccion">
                <p className="req-seccion-titulo">Documentos</p>
                <div className="req-docs">
                  {selected.selfieWithDocument && (
                    <a href={selected.selfieWithDocument} target="_blank" rel="noreferrer"
                      className="req-doc-link">
                      📷 Selfie con documento
                    </a>
                  )}
                  {selected.duiFront && (
                    <a href={selected.duiFront} target="_blank" rel="noreferrer"
                      className="req-doc-link">
                      🪪 DUI frontal
                    </a>
                  )}
                  {selected.duiBack && (
                    <a href={selected.duiBack} target="_blank" rel="noreferrer"
                      className="req-doc-link">
                      🪪 DUI trasero
                    </a>
                  )}
                  {selected.passportPhoto && (
                    <a href={selected.passportPhoto} target="_blank" rel="noreferrer"
                      className="req-doc-link">
                      📘 Pasaporte
                    </a>
                  )}
                </div>
              </div>

              <div className="req-divider" />

              {/* Mensaje de éxito / Success message */}
              {successMsg && <p className="req-success">{successMsg}</p>}

              {/* Botón aprobar / Approve button */}
              {!selected.isVerified && (
                <button
                  className="req-btn-aprobar"
                  onClick={() => handleApprove(selected._id)}
                  disabled={approving}
                >
                  {approving ? "Aprobando..." : "✓ Aprobar Solicitud"}
                </button>
              )}

              {selected.isVerified && (
                <div className="req-aprobada-msg">
                  ✓ Esta solicitud ya fue aprobada
                </div>
              )}

            </div>
          )}
        </div>
      </main>
    </div>
  );
}