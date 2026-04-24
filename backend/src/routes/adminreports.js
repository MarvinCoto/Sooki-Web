// adminReports.js
// Rutas admin para reportes generales
// Admin routes for general reports

import { Router } from "express";
import adminReportsController from "../controllers/adminReportsController.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = Router();

// Todas las rutas requieren ser admin / All routes require admin
router.use(isAdmin);

// GET /api/admin/reports/stats    — estadísticas generales / general stats
router.get("/stats",   adminReportsController.getGeneralStats);

// GET /api/admin/reports/stores   — top tiendas / top stores
router.get("/stores",  adminReportsController.getTopStores);

// GET /api/admin/reports/products — top productos / top products
router.get("/products", adminReportsController.getTopProducts);

// GET /api/admin/reports/growth   — crecimiento mensual / monthly growth
router.get("/growth",  adminReportsController.getMonthlyGrowth);

export default router;