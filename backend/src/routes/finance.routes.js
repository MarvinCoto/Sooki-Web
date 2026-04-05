// Rutas de finance / finance routes
import { Router } from "express";

const router = Router();

// Se irán agregando las rutas aquí / Routes will be added here
router.get("/", (req, res) => {
  res.json({ message: "finance ok" });
});

export default router;