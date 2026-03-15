//categoriesController.js
import categoriesModel from "../models/Categories.js"
import storesModel from "../models/Stores.js"
import mongoose from "mongoose" // Necesario para validar ObjectId

const categoriesController = {};

//SELECT
categoriesController.getAllCategories = async(req, res) => {
    try {
        const categories = await categoriesModel.find().populate('idStore')
        res.status(200).json(categories)
    } catch (error) {
        console.log("error" + error)
        res.status(500).json({message: "Internal server error"})
    }
}

export default categoriesController;