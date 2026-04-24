// admin.clients.routes.js
// Rutas admin para gestión de clientes
// Admin routes for client management

import { Router } from "express";
import adminClientsController from "../controllers/adminClientsController.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = Router();

// Todas las rutas requieren ser admin / All routes require admin
router.use(isAdmin);

// GET  /api/admin/clients       — lista todos los clientes / list all clients
router.get("/", adminClientsController.getAllClients);

// GET  /api/admin/clients/stats — estadísticas para reportes / stats for reports
router.get("/stats", adminClientsController.getClientStats);

// GET  /api/admin/clients/:id   — detalle de un cliente / client detail
router.get("/:id", adminClientsController.getClientById);

// PATCH /api/admin/clients/:id/toggle — activa o desactiva / activate or deactivate
router.patch("/:id/toggle", adminClientsController.toggleClientStatus);

export default router;