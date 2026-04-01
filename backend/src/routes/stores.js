import express from "express";
import storesController from "../controllers/storesController.js";
import storesValidation from "../middlewares/validations/storesValidation.js";
import { uploadStoreImages } from "../middlewares/uploadLogo.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

// Publicas
router.post("/insertStore", uploadStoreImages, storesValidation.validate, storesController.insertStores);
router.post("/verifyEmail", storesController.verifyEmail);
router.post("/resendCode", storesController.resendCode);
router.get("/setup-credentials", storesController.getSetupData);
router.post("/setup-credentials", uploadStoreImages, storesValidation.validateSetup, storesController.setupCredentials);

// Publicas — tiendas activas (sin datos sensibles)
router.get("/", storesController.getAllStores);

// Solo admin
router.get("/owners", isAdmin, storesController.getAllOwners);
router.get("/owners/:id", isAdmin, storesController.getOwnerById);
router.post("/approveStore", isAdmin, storesController.approveStore);

export default router;