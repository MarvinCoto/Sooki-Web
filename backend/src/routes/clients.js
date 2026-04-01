import express from "express";
import clientsController from "../controllers/clientsController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "public/clients" });

// ===== FAVORITOS =====
router.get("/favorites/:userId", clientsController.getFavoritesByUserId);
router.post("/favorites/add", clientsController.addFavoriteProduct);
router.delete("/favorites/remove", clientsController.removeFavoriteProduct);
router.get("/favorites/count/:userId", clientsController.getFavoritesCount);
router.get("/favorites/check/:userId/:idProduct", clientsController.checkFavoriteStatus);

// ===== CAMBIO DE CONTRASEÑA =====
router.put("/changePassword/:id", clientsController.changePassword);

// ===== CRUD PRINCIPAL =====
router.get("/", clientsController.getClients);
router.get("/:id", clientsController.getClientById);
router.put("/:id", upload.single("photo"), clientsController.updateClients);
router.delete("/:id", clientsController.deleteClients);

export default router;