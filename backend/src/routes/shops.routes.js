// Rutas de shops / shops routes
import { Router } from "express";

const router = Router();

// Se irán agregando las rutas aquí / Routes will be added here
router.get("/", (req, res) => {
  res.json({ message: "shops ok" });
});

export default router;