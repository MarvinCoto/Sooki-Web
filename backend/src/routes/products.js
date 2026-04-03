import express from "express";
import productsController from "../controllers/productsController.js";
import isStore from "../middlewares/isStore.js";
import uploadProductImages from "../middlewares/uploadProductImages.js";

const router = express.Router();

//router.use(isStore);


router.get("/", productsController.getAllProducts)
router.get("/store", productsController.getAll);
router.get("/store/:storeId", productsController.getProductsByStore);
router.get("/:id", productsController.getById);
router.use(isStore);
router.post("/", (req, res, next) => {
    uploadProductImages(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message });
        next();
    });
}, productsController.create);
router.put("/:id", (req, res, next) => {
    uploadProductImages(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message });
        next();
    });
}, productsController.update);
router.delete("/:id", productsController.remove);
router.patch("/:id/toggle", productsController.toggleStatus);

export default router;