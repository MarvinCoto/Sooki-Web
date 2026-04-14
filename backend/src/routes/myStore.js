import express from "express";
import myStoreController from "../controllers/myStoreController.js";
import isStore from "../middlewares/isStore.js";
import uploadAboutImages from "../middlewares/uploadAboutImages.js";

const router = express.Router();

router.use(isStore);

// Obtener datos de la propia tienda
router.get("/", myStoreController.getMyStore);

// Actualizar info general (nombre, ubicacion, diseño, colores, logo)
router.put("/info", (req, res, next) => {
    uploadAboutImages(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message });
        next();
    });
}, myStoreController.updateStoreInfo);

// Actualizar about (descripcion, mision, vision e imagenes)
router.put("/about", (req, res, next) => {
    uploadAboutImages(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message });
        next();
    });
}, myStoreController.updateAbout);

export default router;