// Reports Screen — Panel de reportes generales
// Reports Screen — General reports panel

import { useNavigate } from "react-router-dom";
import logo from "../assets/sookiLogo.png";
import "../styles/reportsStyles.css";

// ── Datos de ejemplo / Sample data ──
// Reemplaza con datos reales de tu API / Replace with real API data
const data = {
  ventasTotales: "$1.000,00",
  crecimiento: "+ 125",
  usuarios: 250,
  topTiendas: [
    { nombre: "Tienda Nombre", valor: "$0.00" },
    { nombre: "Tienda Nombre", valor: "$0.00" },
    { nombre: "Tienda Nombre", valor: "$0.00" },
    { nombre: "Tienda Nombre", valor: "$0.00" },
  ],
  topProductos: [
    { nombre: "Tienda Nombre", valor: "$0.00" },
    { nombre: "Tienda Nombre", valor: "$0.00" },
    { nombre: "Tienda Nombre", valor: "$0.00" },
    { nombre: "Tienda Nombre", valor: "$0.00" },
  ],
};

// ── Datos de la gráfica / Chart data ──
// Reemplaza con datos reales / Replace with real data
const chartData = [
  { mes: "Ene", valor: 200 },
  { mes: "Feb", valor: 350 },
  { mes: "Mar", valor: 280 },
  { mes: "Abr", valor: 500 },
  { mes: "May", valor: 420 },
  { mes: "Jun", valor: 680 },
  { mes: "Jul", valor: 750 },
  { mes: "Ago", valor: 620 },
  { mes: "Sep", valor: 900 },
];

export default function ReportsScreen() {
  const navigate = useNavigate();

  return (
    <div className="rep-page">
      <div className="rep-noise" />

      {/* ── Header ── */}
      <header className="rep-header">
        <img src={logo} alt="Sooki Logo" className="rep-logo" />
        <h1 className="rep-title">Reportes</h1>
        <button className="rep-back-btn" onClick={() => navigate("/dashboard")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver
        </button>
      </header>

      {/* ── Contenido / Content ── */}
      <main className="rep-main">
        <div className="rep-grid">

          {/* ── Fila superior / Top row ── */}

          {/* Tarjeta ventas totales / Total sales card */}
          <div className="rep-card rep-card-ventas">
            <p className="rep-card-label">Ventas totales de la plataforma</p>
            <p className="rep-ventas-total">{data.ventasTotales}</p>
            <p className="rep-crecimiento">
              <span className="rep-flecha">▲</span>
              {data.crecimiento}
            </p>
          </div>

          {/* Tarjeta usuarios / Users card */}
          <div className="rep-card rep-card-usuarios">
            <p className="rep-card-label">Usuarios</p>
            <div className="rep-usuarios-row">
              <p className="rep-usuarios-num">{data.usuarios}</p>
              {/* Ícono usuario / User icon */}
              <svg className="rep-usuario-icon" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" fill="rgba(205,140,70,0.85)" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                  fill="rgba(205,140,70,0.85)" />
              </svg>
            </div>
          </div>

          {/* Tarjeta gráfica crecimiento mensual / Monthly growth chart card */}
          <div className="rep-card rep-card-grafica">
            <p className="rep-card-label">Crecimiento Mensual</p>
            <AreaChart data={chartData} />
          </div>

          {/* ── Fila inferior / Bottom row ── */}

          {/* Top tiendas / Top stores */}
          <div className="rep-card rep-card-top">
            <p className="rep-top-titulo">Top Tiendas</p>
            <div className="rep-top-lista">
              {data.topTiendas.map((item, i) => (
                <div key={i} className="rep-top-row">
                  <span className="rep-top-nombre">
                    <span className="rep-top-num">{i + 1}-</span> {item.nombre}
                  </span>
                  <span className="rep-top-valor">{item.valor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top productos / Top products */}
          <div className="rep-card rep-card-top rep-card-productos">
            <p className="rep-top-titulo">Top Productos</p>
            <div className="rep-top-lista">
              {data.topProductos.map((item, i) => (
                <div key={i} className="rep-top-row">
                  <span className="rep-top-nombre">
                    <span className="rep-top-num">{i + 1}-</span> {item.nombre}
                  </span>
                  <span className="rep-top-valor">{item.valor}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   GRÁFICA DE ÁREA / AREA CHART — SVG puro / Pure SVG
   ───────────────────────────────────────────────────────────────────────────── */
function AreaChart({ data }) {
  const w = 340, h = 180, padX = 10, padY = 10;
  const maxVal = Math.max(...data.map(d => d.valor));
  const minVal = Math.min(...data.map(d => d.valor));

  // Coordenadas de cada punto / Coordinates of each point
  const pts = data.map((d, i) => {
    const x = padX + (i / (data.length - 1)) * (w - padX * 2);
    const y = padY + (1 - (d.valor - minVal) / (maxVal - minVal)) * (h - padY * 2);
    return { x, y };
  });

  // Path de la línea / Line path
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  // Path del área rellena / Filled area path
  const areaPath = `${linePath} L${pts[pts.length - 1].x},${h} L${pts[0].x},${h} Z`;

  return (
    <svg width={w} height={h} className="rep-chart-svg">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(80,160,220,0.6)" />
          <stop offset="100%" stopColor="rgba(80,160,220,0.05)" />
        </linearGradient>
      </defs>

      {/* Área rellena / Filled area */}
      <path d={areaPath} fill="url(#areaGrad)" />

      {/* Línea / Line */}
      <path d={linePath} fill="none"
        stroke="rgba(80,160,220,0.9)" strokeWidth="2"
        strokeLinejoin="round" strokeLinecap="round" />

      {/* Puntos / Dots */}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3"
          fill="rgba(80,160,220,1)" />
      ))}
    </svg>
  );
}