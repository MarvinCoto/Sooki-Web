//productsController.js
import productsModel from "../models/Products.js"
import categoriesModel from "../models/Categories.js"
import storesModel from "../models/Stores.js"
import mongoose from "mongoose" // Necesario para validar ObjectId

const productsController = {};

//SELECT
productsController.getAllProducts = async(req, res) => {
    try {
        const products = await productsModel.find().populate('idCategory').populate('idStore')
        res.status(200).json(products)
    } catch (error) {
        console.log("error" + error)
        res.status(500).json({message: "Internal server error"})
    }
}

export default productsController;