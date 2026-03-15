import express from "express";
import categoriesController from "../controllers/categoriesController.js";


const router = express.Router();

router
  .route("/")
  .get(categoriesController.getAllCategories)

export default router;