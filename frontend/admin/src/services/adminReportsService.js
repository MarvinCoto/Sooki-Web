// adminReportsService.js
// Servicio para peticiones de reportes al backend
// Service for reports requests to the backend

const BASE_URL = "http://localhost:4000/api/admin/reports";

const fetchOptions = (method = "GET") => ({
  method,
  credentials: "include",
  headers: { "Content-Type": "application/json" },
});

const adminReportsService = {};

// ── GET estadísticas generales / Get general stats ──
adminReportsService.getGeneralStats = async () => {
  const res = await fetch(`${BASE_URL}/stats`, fetchOptions());
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener estadísticas");
  return data;
};

// ── GET top tiendas / Get top stores ──
adminReportsService.getTopStores = async () => {
  const res = await fetch(`${BASE_URL}/stores`, fetchOptions());
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener top tiendas");
  return data;
};

// ── GET top productos / Get top products ──
adminReportsService.getTopProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`, fetchOptions());
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener top productos");
  return data;
};

// ── GET crecimiento mensual / Get monthly growth ──
adminReportsService.getMonthlyGrowth = async () => {
  const res = await fetch(`${BASE_URL}/growth`, fetchOptions());
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener crecimiento");
  return data;
};

export default adminReportsService;