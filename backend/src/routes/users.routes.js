// Rutas de users / users routes
import { Router } from "express";

const router = Router();

// Se irán agregando las rutas aquí / Routes will be added here
router.get("/", (req, res) => {
  res.json({ message: "users ok" });
});

export default router;