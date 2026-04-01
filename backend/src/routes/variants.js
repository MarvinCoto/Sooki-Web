import express from "express";
import variantsController from "../controllers/variantsController.js";
import isStore from "../middlewares/isStore.js";

const router = express.Router();

router.use(isStore);

// Atributos de la tienda
router.get("/attributes", variantsController.getAttributes);
router.post("/attributes", variantsController.createAttribute);
router.put("/attributes/:id", variantsController.updateAttribute);
router.delete("/attributes/:id", variantsController.deleteAttribute);

// Valores de un atributo
router.post("/attributes/:id/values", variantsController.createValue);
router.delete("/values/:valueId", variantsController.deleteValue);

// Variantes de un producto
router.get("/product/:productId", variantsController.getVariants);
router.post("/product/:productId", variantsController.createVariant);
router.put("/:variantId", variantsController.updateVariant);
router.delete("/:variantId", variantsController.deleteVariant);

export default router;