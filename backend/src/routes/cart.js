import express from "express";
import cartController from "../controllers/cartController.js";

const router = express.Router();

// GET — obtener carrito
router.get("/:clientId", cartController.getCart);

// POST — agregar producto
router.post("/add", cartController.addItem);

// PUT — actualizar cantidad
router.put("/update", cartController.updateQuantity);

// DELETE — eliminar producto
router.delete("/remove", cartController.removeItem);

// DELETE — vaciar carrito
router.delete("/clear/:clientId", cartController.clearCart);

export default router;