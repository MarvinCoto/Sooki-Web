// adminClientsService.js
// Servicio para peticiones de clientes al backend
// Service for client requests to the backend

const BASE_URL = "http://localhost:4000/api/admin/clients";

// Opciones base para fetch con credenciales / Base fetch options with credentials
const fetchOptions = (method = "GET", body = null) => ({
  method,
  credentials: "include", // Envía las cookies con cada petición / Send cookies with each request
  headers: { "Content-Type": "application/json" },
  ...(body ? { body: JSON.stringify(body) } : {}),
});

const adminClientsService = {};

// ── GET todos los clientes / Get all clients ──
adminClientsService.getAllClients = async () => {
  const res = await fetch(`${BASE_URL}`, fetchOptions("GET"));
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener clientes");
  return data;
};

// ── GET cliente por ID / Get client by ID ──
adminClientsService.getClientById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, fetchOptions("GET"));
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener cliente");
  return data;
};

// ── GET estadísticas de clientes / Get client stats ──
adminClientsService.getClientStats = async () => {
  const res = await fetch(`${BASE_URL}/stats`, fetchOptions("GET"));
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al obtener estadísticas");
  return data;
};

// ── PATCH toggle estado del cliente / Toggle client status ──
adminClientsService.toggleClientStatus = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/toggle`, fetchOptions("PATCH"));
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al cambiar estado del cliente");
  return data;
};

export default adminClientsService;