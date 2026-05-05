// adminAuthService.js
// Servicio de autenticación del admin
// Admin authentication service

const BASE_URL = "http://localhost:4000/api";

const adminAuthService = {};

// ── POST /api/login — iniciar sesión / login ──
adminAuthService.login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    credentials: "include", // Envía y recibe cookies / Send and receive cookies
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al iniciar sesión");
  // Verifica que sea admin / Verify it's admin
  if (data.user?.userType !== "admin") {
    throw new Error("Acceso denegado. Solo el administrador puede ingresar.");
  }
  return data;
};

// ── POST /api/logout — cerrar sesión / logout ──
adminAuthService.logout = async () => {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al cerrar sesión");
  return data;
};

// ── GET /api/login/verify — verificar token / verify token ──
adminAuthService.verify = async () => {
  const res = await fetch(`${BASE_URL}/login/verify`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Token inválido");
  return data;
};

export default adminAuthService;