// adminShops.js
// Rutas admin para gestión de tiendas
// Admin routes for shops management

import { Router } from "express";
import adminShopsController from "../controllers/adminShopsController.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = Router();

// Todas las rutas requieren ser admin / All routes require admin
router.use(isAdmin);

// GET  /api/admin/shops            — lista todas las tiendas / list all stores
router.get("/", adminShopsController.getAllShops);

// GET  /api/admin/shops/stats      — estadísticas para reportes / stats for reports
router.get("/stats", adminShopsController.getShopStats);

// GET  /api/admin/shops/pending    — emprendedores pendientes / pending entrepreneurs
router.get("/pending", adminShopsController.getPendingOwners);

// GET  /api/admin/shops/:id        — detalle de una tienda / store detail
router.get("/:id", adminShopsController.getShopById);

// PATCH /api/admin/shops/:id/toggle — activa o desactiva / activate or deactivate
router.patch("/:id/toggle", adminShopsController.toggleShopStatus);

export default router;