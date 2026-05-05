import express from "express";
import categoriesController from "../controllers/categoriesController.js";
import isStore from "../middlewares/isStore.js";

const router = express.Router();

router.get("/",categoriesController.getAllCategories)
router.use(isStore); // todas las rutas requieren estar logueado como tienda a partir de aquí abajo
router.get("/store", categoriesController.getAll);
router.post("/", categoriesController.create);
router.put("/:id", categoriesController.update);
router.delete("/:id", categoriesController.remove);

export default router;