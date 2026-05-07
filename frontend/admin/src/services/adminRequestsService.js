// adminRequestsService.js
// Servicio para peticiones de solicitudes de emprendedores
// Service for entrepreneur requests

const BASE_URL = "http://localhost:4000/api/stores";

const fetchOptions = (method = "GET", body = null) => ({
  method,
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  ...(body ? { body: JSON.stringify(body) } : {}),
});

const adminRequestsService = {};

// ── GET todas las solicitudes / Get all requests ──
adminRequestsService.getAllOwners = async () => {
  const res = await fetch(`${BASE_URL}/owners`, fetchOptions("GET"));
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener solicitudes");
  return data;
};

// ── GET solicitud por ID / Get request by ID ──
adminRequestsService.getOwnerById = async (id) => {
  const res = await fetch(`${BASE_URL}/owners/${id}`, fetchOptions("GET"));
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener solicitud");
  return data;
};

// ── POST aprobar tienda / Approve store ──
adminRequestsService.approveStore = async (ownerId) => {
  const res = await fetch(`${BASE_URL}/approveStore`, fetchOptions("POST", { ownerId }));
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al aprobar tienda");
  return data;
};

export default adminRequestsService;