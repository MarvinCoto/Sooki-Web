import { Router } from "express";
import recoveryPasswordController from "../controllers/recoveryPasswordController.js";

const router = Router();

// POST - Solicitar código de recuperación
router.post("/requestCode", recoveryPasswordController.requestCode);

// POST - Verificar código de recuperación
router.post("/verifyCode", recoveryPasswordController.verifyCode);

// POST - Establecer nueva contraseña
router.post("/newPassword", recoveryPasswordController.newPassword);

export default router;