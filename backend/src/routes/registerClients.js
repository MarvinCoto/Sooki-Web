import express from "express";
import registerClientsController from "../controllers/registerClientsController.js";
import multer from "multer";

const upload = multer({ dest: 'public/register' })
const router = express.Router()

// AGREGAR middleware para procesar form-data en todas las rutas
const formDataParser = multer().none();

// /api/registerClients
router.route("/")
  .post(upload.single("photo"), registerClientsController.registerClient)

// MODIFICAR ESTAS RUTAS - agregar formDataParser
router.post("/verifyCodeEmail", formDataParser, (req, res, next) => {
    console.log("🔵 === RUTA /verifyCodeEmail ALCANZADA ===");
    console.log("Body recibido:", req.body);
    console.log("Cookies recibidas:", req.cookies);
    console.log("Cookie VerificationToken existe:", !!req.cookies?.VerificationToken);
    if (req.cookies?.VerificationToken) {
        console.log("Token preview:", req.cookies.VerificationToken.substring(0, 30) + "...");
    }
    console.log("==========================================");
    next();
}, registerClientsController.verifyCodeEmail);

// Ruta para reenviar código de verificación - AGREGAR formDataParser
router.post("/resendCode", formDataParser, registerClientsController.resendVerificationCode);

export default router;