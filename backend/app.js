// Configuración principal de Express
// Main Express configuration

import express from "express";
import cors    from "cors";
import morgan  from "morgan";

import financeRoutes from "./src/routes/finance.routes.js";
import shopsRoutes   from "./src/routes/shops.routes.js";
import reportsRoutes from "./src/routes/reports.routes.js";
import usersRoutes   from "./src/routes/users.routes.js";

const app = express();

// ── Middlewares ──────────────────────────────────────────────────────────────
// Permite peticiones desde el frontend / Allow requests from frontend
app.use(cors({
  origin: "http://localhost:5173", // Puerto de Vite / Vite port
  credentials: true,
}));

// Parsea el body de las peticiones a JSON / Parse request body to JSON
app.use(express.json());

// Logs de peticiones en consola / Request logs in console
app.use(morgan("dev"));

// ── Rutas / Routes ───────────────────────────────────────────────────────────
app.use("/api/finance",  financeRoutes);
app.use("/api/shops",    shopsRoutes);
app.use("/api/reports",  reportsRoutes);
app.use("/api/users",    usersRoutes);

// ── Ruta base / Base route ───────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Sooki API funcionando / Sooki API running" });
});

// ── Manejo de rutas no encontradas / Not found handler ───────────────────────
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada / Route not found" });
});

export default app;