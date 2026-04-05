// Pantalla de Finanzas — Vista principal y vista de comisiones
// Finanzas screen — Main view and commissions view

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/sookiLogo.png";
import "../styles/financeStyles.css";

// ── Datos de ejemplo para la gráfica / Sample chart data ──
const chartData = [
  { mes: "Ene", valor: 400 },
  { mes: "Feb", valor: 300 },
  { mes: "Mar", valor: 600 },
  { mes: "Abr", valor: 800 },
  { mes: "May", valor: 500 },
  { mes: "Jun", valor: 900 },
  { mes: "Jul", valor: 1200 },
];

// ── Datos de ejemplo de tiendas / Sample store data ──
const tiendas = [
  { nombre: "Tienda A", comision: "$0.00" },
  { nombre: "Tienda B", comision: "$0.00" },
  { nombre: "Tienda C", comision: "$0.00" },
  { nombre: "Tienda D", comision: "$0.00" },
];

// ── Datos de ejemplo para el modal de ganancia neta / Sample net profit modal data ──
// Reemplaza con datos reales de tu API / Replace with real API data
const gananciaNeta = {
  totalMesActual: "$0,000.00",
  totalMesAnterior: "$0,000.00",
  porcentajeCrecimiento: "0%",
  crecimientoPositivo: true, // true = verde / verde, false = rojo / red
};

export default function FinanzasScreen() {
  const navigate = useNavigate();
  const [verComisiones, setVerComisiones] = useState(false);
  // Controla si el modal está abierto / Controls if modal is open
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <div className="fin-page">
      <div className="fin-noise" />

      {/* ── Header ── */}
      <header className="fin-header">
        <img src={logo} alt="Sooki Logo" className="fin-logo" />
        <h1 className="fin-title">Finanzas</h1>
        <button className="fin-back-btn" onClick={() => navigate("/dashboard")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver
        </button>
      </header>

      {/* ── Contenido dinámico / Dynamic content ── */}
      <main className="fin-main">
        {!verComisiones
          ? <VistaPrincipal
              onConsultar={() => setVerComisiones(true)}
              onGananciaNeta={() => setModalAbierto(true)}
            />
          : <VistaComisiones onVolver={() => setVerComisiones(false)} />
        }
      </main>

      {/* ── Modal Ganancia Neta / Net Profit Modal ── */}
      {modalAbierto && (
        <ModalGananciaNeta
          datos={gananciaNeta}
          onCerrar={() => setModalAbierto(false)}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   VISTA PRINCIPAL / MAIN VIEW
   ───────────────────────────────────────────────────────────────────────────── */
function VistaPrincipal({ onConsultar, onGananciaNeta }) {
  return (
    <div className="fin-grid-principal">

      {/* ── Tarjeta Ingresos / Income card ── */}
      <div className="fin-card fin-card-ingresos">
        <p className="fin-card-tag">INGRESOS</p>

        <div className="fin-ingreso-row">
          <span className="fin-ingreso-label">Ingresos totales :</span>
          <span className="fin-ingreso-valor">$0,000</span>
        </div>

        {/* Total comisiones con valor a la par / Commissions total with value alongside */}
        <div className="fin-ingreso-row">
          <span className="fin-ingreso-label">Total comisiones generadas :</span>
          <span className="fin-ingreso-valor">$0.00</span>
        </div>

        {/* Botón ganancia neta — abre el modal / Opens modal */}
        <button className="fin-btn-ganancia" onClick={onGananciaNeta}>
          Ganancia Neta
        </button>
      </div>

      {/* ── Tarjeta Resumen / Summary card ── */}
      <div className="fin-card fin-card-resumen">
        <p className="fin-card-tag">RESUMEN</p>
        <p className="fin-resumen-sub">% por producto vendido</p>

        <button className="fin-btn-consultar" onClick={onConsultar}>
          Consultar tienda
        </button>
      </div>

      {/* ── Tarjeta Gráfica / Chart card ── */}
      <div className="fin-card fin-card-grafica">
        <MiniChart data={chartData} />
      </div>

    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MODAL GANANCIA NETA / NET PROFIT MODAL
   ───────────────────────────────────────────────────────────────────────────── */
function ModalGananciaNeta({ datos, onCerrar }) {
  return (
    <>
      {/* Fondo oscuro detrás del modal / Dark backdrop behind modal */}
      <div className="fin-modal-backdrop" onClick={onCerrar} />

      <div className="fin-modal">
        {/* Cabecera del modal / Modal header */}
        <div className="fin-modal-header">
          <h2 className="fin-modal-titulo">Ganancia Neta</h2>
          <button className="fin-modal-cerrar" onClick={onCerrar}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Línea divisora / Divider */}
        <div className="fin-modal-divider" />

        {/* Contenido del modal / Modal content */}
        <div className="fin-modal-body">

          {/* Total mes actual / Current month total */}
          <div className="fin-modal-item">
            <span className="fin-modal-label">Total neto del mes actual</span>
            <span className="fin-modal-valor">{datos.totalMesActual}</span>
          </div>

          {/* Comparación mes anterior / Previous month comparison */}
          <div className="fin-modal-item">
            <span className="fin-modal-label">Mes anterior</span>
            <span className="fin-modal-valor">{datos.totalMesAnterior}</span>
          </div>

          {/* Porcentaje de crecimiento / Growth percentage */}
          <div className="fin-modal-item">
            <span className="fin-modal-label">Crecimiento</span>
            <span className={`fin-modal-crecimiento ${datos.crecimientoPositivo ? "positivo" : "negativo"}`}>
              {datos.crecimientoPositivo ? "▲" : "▼"} {datos.porcentajeCrecimiento}
            </span>
          </div>

        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   VISTA COMISIONES / COMMISSIONS VIEW
   ───────────────────────────────────────────────────────────────────────────── */
function VistaComisiones({ onVolver }) {
  return (
    <div className="fin-grid-comisiones">

      <div className="fin-card fin-card-comisiones">
        <p className="fin-comision-titulo">Comision de tiendas</p>
        <p className="fin-comision-total">$0.000,00</p>

        <div className="fin-tiendas-lista">
          {tiendas.map((t) => (
            <div key={t.nombre} className="fin-tienda-row">
              <span className="fin-tienda-nombre">{t.nombre}</span>
              <span className="fin-tienda-valor">{t.comision}</span>
            </div>
          ))}
        </div>

        <button className="fin-btn-volver-vista" onClick={onVolver}>
          ← Volver a Finanzas
        </button>
      </div>

      <div className="fin-card fin-card-principales">
        <p className="fin-principales-titulo">Principales tiendas</p>
        <div className="fin-principales-stat">
          <p className="fin-porcentaje">21%</p>
          <div className="fin-principales-detalle">
            <div className="fin-detalle-row">
              <span className="fin-detalle-label">Ultimo ingreso :</span>
              <span className="fin-detalle-valor">$0.00</span>
            </div>
            <div className="fin-detalle-row">
              <span className="fin-detalle-label">Mejor Mes :</span>
              <span className="fin-detalle-valor">Ejemplo mes</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MINI GRÁFICA / MINI CHART
   ───────────────────────────────────────────────────────────────────────────── */
function MiniChart({ data }) {
  const w = 560, h = 160, pad = 10;
  const maxVal = Math.max(...data.map(d => d.valor));
  const minVal = Math.min(...data.map(d => d.valor));

  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((d.valor - minVal) / (maxVal - minVal)) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={w} height={h} className="fin-chart-svg">
      <polyline
        points={points}
        fill="none"
        stroke="rgba(205,140,70,0.7)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {data.map((d, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2);
        const y = h - pad - ((d.valor - minVal) / (maxVal - minVal)) * (h - pad * 2);
        return <circle key={i} cx={x} cy={y} r="3" fill="rgba(205,140,70,0.9)" />;
      })}
    </svg>
  );
}