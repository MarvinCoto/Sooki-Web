import express from "express";
import storesController from "../controllers/storeController.js";
import storesValidation from "../middlewares/validations/storesValidation.js";
import upload from "../middlewares/uploadLogo.js";

const router = express.Router();

// GET todas las tiendas verificadas
router.get("/", storesController.getAllStores);

// Registro — sube imagen, valida, guarda en memoria y envía correo
router.post(
    "/insertStore",
    upload.single("logo"),
    storesValidation.validate,
    storesController.insertStores
);

// Verificar código de 6 dígitos
router.post("/verifyEmail", storesController.verifyEmail);

// Reenviar código
router.post("/resendCode", storesController.resendCode);

export default router;