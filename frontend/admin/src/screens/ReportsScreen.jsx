// ReportsScreen.jsx
// Pantalla de Reportes conectada al backend
// Reports screen connected to backend

import { useNavigate } from "react-router-dom";
import logo from "../assets/sookiLogo.png";
import { useReports } from "../hooks/useReports";
import "../styles/reportsStyles.css";

export default function ReportsScreen() {
  const navigate = useNavigate();
  const { stats, topStores, topProducts, growth, loading, error } = useReports();

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

      <main className="rep-main">

        {/* Estado de carga / Loading state */}
        {loading && <p style={{ color: "rgba(220,210,200,0.4)", textAlign: "center" }}>Cargando reportes...</p>}
        {error   && <p style={{ color: "#e07070", textAlign: "center" }}>{error}</p>}

        {!loading && !error && (
          <div className="rep-grid">

            {/* ── Ventas totales / Total sales ── */}
            <div className="rep-card rep-card-ventas">
              <p className="rep-card-label">Ventas totales de la plataforma</p>
              <p className="rep-ventas-total">$0.00</p>
              <p className="rep-crecimiento">
                <span className="rep-flecha">▲</span>
                + {stats?.newClientsThisMonth || 0} clientes este mes
              </p>
            </div>

            {/* ── Usuarios / Users ── */}
            <div className="rep-card rep-card-usuarios">
              <p className="rep-card-label">Usuarios</p>
              <div className="rep-usuarios-row">
                <p className="rep-usuarios-num">{stats?.totalClients || 0}</p>
                <svg className="rep-usuario-icon" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" fill="rgba(205,140,70,0.85)" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="rgba(205,140,70,0.85)" />
                </svg>
              </div>
            </div>

            {/* ── Gráfica crecimiento / Growth chart ── */}
            <div className="rep-card rep-card-grafica">
              <p className="rep-card-label">Crecimiento Mensual</p>
              {growth.length > 0
                ? <AreaChart data={growth} />
                : <p style={{ color: "rgba(220,210,200,0.3)", fontSize: "13px" }}>Sin datos aún</p>
              }
            </div>

            {/* ── Top Tiendas / Top Stores ── */}
            <div className="rep-card rep-card-top">
              <p className="rep-top-titulo">Top Tiendas</p>
              <div className="rep-top-lista">
                {topStores.length > 0
                  ? topStores.map((item, i) => (
                      <div key={i} className="rep-top-row">
                        <span className="rep-top-nombre">
                          <span className="rep-top-num">{i + 1}-</span> {item.storeName}
                        </span>
                        <span className="rep-top-valor">{item.totalProducts} productos</span>
                      </div>
                    ))
                  : <p style={{ color: "rgba(220,210,200,0.3)", fontSize: "13px" }}>Sin datos aún</p>
                }
              </div>
            </div>

            {/* ── Top Productos / Top Products ── */}
            <div className="rep-card rep-card-top">
              <p className="rep-top-titulo">Top Productos</p>
              <div className="rep-top-lista">
                {topProducts.length > 0
                  ? topProducts.map((item, i) => (
                      <div key={i} className="rep-top-row">
                        <span className="rep-top-nombre">
                          <span className="rep-top-num">{i + 1}-</span> {item.productName}
                        </span>
                        <span className="rep-top-valor">${item.basePrice?.toFixed(2)}</span>
                      </div>
                    ))
                  : <p style={{ color: "rgba(220,210,200,0.3)", fontSize: "13px" }}>Sin datos aún</p>
                }
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

/* ─── Gráfica de área / Area chart ── */
function AreaChart({ data }) {
  const w = 340, h = 180, padX = 10, padY = 10;
  const valores = data.map(d => d.clientes);
  const maxVal  = Math.max(...valores) || 1;
  const minVal  = Math.min(...valores);

  const pts = data.map((d, i) => {
    const x = padX + (i / (data.length - 1)) * (w - padX * 2);
    const y = padY + (1 - (d.clientes - minVal) / (maxVal - minVal || 1)) * (h - padY * 2);
    return { x, y };
  });

  const linePath  = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath  = `${linePath} L${pts[pts.length - 1].x},${h} L${pts[0].x},${h} Z`;

  return (
    <svg width={w} height={h} className="rep-chart-svg">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(80,160,220,0.6)" />
          <stop offset="100%" stopColor="rgba(80,160,220,0.05)" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#areaGrad)" />
      <path d={linePath} fill="none"
        stroke="rgba(80,160,220,0.9)" strokeWidth="2"
        strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="rgba(80,160,220,1)" />
      ))}
    </svg>
  );
}