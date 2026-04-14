import categoryModel from "../models/Categories.js";
import productModel from "../models/Products.js";

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

// GET — todas las categorias de la tienda con sus hijos
categoriesController.getAll = async (req, res) => {
    try {
        const storeId = req.user.id;

        // Obtener categorias padre (sin parent)
        const parents = await categoryModel.find({ idStore: storeId, parent: null })
            .sort({ createdAt: -1 });

        // Para cada padre, obtener sus hijos
        const result = await Promise.all(
            parents.map(async (parent) => {
                const children = await categoryModel.find({
                    idStore: storeId,
                    parent: parent._id
                }).sort({ createdAt: -1 });
                return { ...parent.toObject(), children };
            })
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
};

// POST — crear categoria
categoriesController.create = async (req, res) => {
    try {
        const storeId = req.user.id;
        const { name, parent } = req.body;

        if (!name || name.trim().length < 2) {
            return res.status(400).json({ message: "Category name must be at least 2 characters" });
        }

        // Verificar nombre duplicado en la misma tienda
        const existing = await categoryModel.findOne({
            idStore: storeId,
            name: name.trim(),
            parent: parent || null
        });
        if (existing) {
            return res.status(400).json({ message: "A category with this name already exists" });
        }

        // Si tiene parent, verificar que pertenece a la tienda
        if (parent) {
            const parentCat = await categoryModel.findOne({ _id: parent, idStore: storeId });
            if (!parentCat) {
                return res.status(404).json({ message: "Parent category not found" });
            }
        }

        const newCategory = new categoryModel({
            name: name.trim(),
            idStore: storeId,
            parent: parent || null,
        });

        await newCategory.save();
        res.status(201).json({ message: "Category created", data: newCategory });
    } catch (error) {
        res.status(500).json({ message: "Error creating category", error: error.message });
    }
};

// PUT — editar categoria
categoriesController.update = async (req, res) => {
    try {
        const storeId = req.user.id;
        const { id } = req.params;
        const { name } = req.body;

        if (!name || name.trim().length < 2) {
            return res.status(400).json({ message: "Category name must be at least 2 characters" });
        }

        const category = await categoryModel.findOne({ _id: id, idStore: storeId });
        if (!category) return res.status(404).json({ message: "Category not found" });

        // Verificar nombre duplicado
        const existing = await categoryModel.findOne({
            idStore: storeId,
            name: name.trim(),
            parent: category.parent,
            _id: { $ne: id }
        });
        if (existing) return res.status(400).json({ message: "A category with this name already exists" });

        category.name = name.trim();
        await category.save();

        res.status(200).json({ message: "Category updated", data: category });
    } catch (error) {
        res.status(500).json({ message: "Error updating category", error: error.message });
    }
};

// DELETE — eliminar categoria
categoriesController.remove = async (req, res) => {
    try {
        const storeId = req.user.id;
        const { id } = req.params;

        const category = await categoryModel.findOne({ _id: id, idStore: storeId });
        if (!category) return res.status(404).json({ message: "Category not found" });

        // Verificar que la categoria no tiene productos
        const productsWithCategory = await productModel.countDocuments({ idCategory: id });
        if (productsWithCategory > 0) {
            return res.status(400).json({
                message: `No se puede eliminar. Hay ${productsWithCategory} producto(s) usando esta categoria.`
            });
        }

        // Si es padre, verificar que sus hijos tampoco tienen productos
        const children = await categoryModel.find({ parent: id, idStore: storeId });
        for (const child of children) {
            const childProducts = await productModel.countDocuments({ idCategory: child._id });
            if (childProducts > 0) {
                return res.status(400).json({
                    message: `No se puede eliminar. La subcategoria "${child.name}" tiene ${childProducts} producto(s) asignado(s).`
                });
            }
        }

        // Si pasa todas las verificaciones, eliminar hijos y luego el padre
        await categoryModel.deleteMany({ parent: id, idStore: storeId });
        await categoryModel.deleteOne({ _id: id });

        res.status(200).json({ message: "Category deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting category", error: error.message });
    }
};

export default categoriesController;