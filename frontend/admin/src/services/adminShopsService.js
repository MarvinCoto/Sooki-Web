// adminShopsService.js
// Servicio para peticiones de tiendas al backend
// Service for shops requests to the backend

const BASE_URL = "http://localhost:4000/api/admin/shops";

const fetchOptions = (method = "GET", body = null) => ({
  method,
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  ...(body ? { body: JSON.stringify(body) } : {}),
});

const adminShopsService = {};

// ── GET todas las tiendas / Get all shops ──
adminShopsService.getAllShops = async () => {
  const res = await fetch(`${BASE_URL}`, fetchOptions("GET"));
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener tiendas");
  return data;
};

// ── GET tienda por ID / Get shop by ID ──
adminShopsService.getShopById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, fetchOptions("GET"));
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener tienda");
  return data;
};

// ── GET estadísticas / Get stats ──
adminShopsService.getShopStats = async () => {
  const res = await fetch(`${BASE_URL}/stats`, fetchOptions("GET"));
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener estadísticas");
  return data;
};

// ── GET emprendedores pendientes / Get pending owners ──
adminShopsService.getPendingOwners = async () => {
  const res = await fetch(`${BASE_URL}/pending`, fetchOptions("GET"));
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener pendientes");
  return data;
};

// ── PATCH toggle estado de tienda / Toggle shop status ──
adminShopsService.toggleShopStatus = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/toggle`, fetchOptions("PATCH"));
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al cambiar estado de tienda");
  return data;
};

export default adminShopsService;