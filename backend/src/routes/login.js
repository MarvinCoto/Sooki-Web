// IMPORTACIONES NECESARIAS
import express from "express"                        // Framework de servidor web
import loginController from "../controllers/loginController.js"; // Controlador con lógica de login
//import { validateAuthToken } from "../middlewares/ValidateAuthToken.js"; // Middleware de validación (comentado)

// CREAR ROUTER DE EXPRESS PARA AGRUPAR RUTAS RELACIONADAS
const router = express.Router();

// RUTA: POST /api/login
// PROPÓSITO: Manejar login tradicional con email y contraseña
// MÉTODO HTTP: POST (para enviar credenciales de forma segura)
// CONTROLADOR: loginController.login
router.post("/", loginController.login);

// RUTA: GET /api/login/verify
// PROPÓSITO: Verificar si un token JWT existente es válido
// MÉTODO HTTP: GET (para obtener información del estado de autenticación)
// CONTROLADOR: loginController.verify
// USO: El frontend llama esta ruta al cargar para verificar si hay sesión activa
router.get("/verify", loginController.verify);

// RUTA: POST /api/login/firebase
// PROPÓSITO: Manejar autenticación con Firebase (Google y Facebook)
// MÉTODO HTTP: POST (para enviar datos del usuario de Firebase)
// CONTROLADOR: loginController.firebaseLogin
// USO: El frontend llama esta ruta después de autenticarse con Firebase
//router.post("/firebase", loginController.firebaseLogin);

// EXPORTAR EL ROUTER PARA USO EN LA APLICACIÓN PRINCIPAL
// Este router se montará en "/api/login" en el archivo principal de la aplicación
export default router;