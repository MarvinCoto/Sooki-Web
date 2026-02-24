import express from "express";
import storesController from "../controllers/storeController.js";
import storesValidation from "../middlewares/validations/storesValidation.js";
import upload from "../middlewares/uploadLogo.js";

const router = express.Router();

router.route("/insertStore")
    .post(
        upload.single("logo"),       // 1. Sube imagen a Cloudinary
        storesValidation.validate,   // 2. Valida el resto de campos
        storesController.insertStores // 3. Guarda en DB
    );

export default router;