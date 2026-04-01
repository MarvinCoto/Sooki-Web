import productModel from "../models/Products.js";
import variantModel from "../models/Variants.js";
import categoryModel from "../models/Categories.js";

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

// GET — todos los productos de la tienda con stock total
productsController.getAll = async (req, res) => {
    try {
        const storeId = req.user.id;

        const products = await productModel.find({ idStore: storeId })
            .populate("idCategory", "name")
            .sort({ createdAt: -1 });

        // Para cada producto calcular stock total de sus variantes
        const productsWithStock = await Promise.all(
            products.map(async (product) => {
                const variants = await variantModel.find({ idProduct: product._id, status: true });
                const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
                const variantCount = variants.length;
                return {
                    ...product.toObject(),
                    totalStock,
                    variantCount,
                };
            })
        );

        res.status(200).json(productsWithStock);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};

// GET — un producto por ID con variantes
productsController.getById = async (req, res) => {
    try {
        const storeId = req.user.id;
        const { id } = req.params;

        const product = await productModel.findOne({ _id: id, idStore: storeId })
            .populate("idCategory", "name");
        if (!product) return res.status(404).json({ message: "Product not found" });

        const variants = await variantModel.find({ idProduct: id });

        res.status(200).json({ ...product.toObject(), variants });
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
};

// POST — crear producto
productsController.create = async (req, res) => {
    try {
        const storeId = req.user.id;
        const { name, description, idCategory, basePrice, discount, status } = req.body;

        // Validar categoria pertenece a la tienda
        const category = await categoryModel.findOne({ _id: idCategory, idStore: storeId });
        if (!category) return res.status(404).json({ message: "Category not found" });

        // Imagenes subidas por multer
        const images = req.files ? req.files.map((f) => f.path) : [];

        const newProduct = new productModel({
            name: name.trim(),
            description: description?.trim() || "",
            idCategory,
            idStore: storeId,
            images,
            basePrice: parseFloat(basePrice),
            discount: discount ? JSON.parse(discount) : { percentage: 0, active: false },
            status: status !== undefined ? status === "true" : true,
        });

        await newProduct.save();
        res.status(201).json({ message: "Product created", data: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error: error.message });
    }
};

// PUT — editar producto
productsController.update = async (req, res) => {
    try {
        const storeId = req.user.id;
        const { id } = req.params;
        const { name, description, idCategory, basePrice, discount, status, keepImages } = req.body;

        const product = await productModel.findOne({ _id: id, idStore: storeId });
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (idCategory) {
            const category = await categoryModel.findOne({ _id: idCategory, idStore: storeId });
            if (!category) return res.status(404).json({ message: "Category not found" });
            product.idCategory = idCategory;
        }

        // Imagenes — si hay nuevas, reemplazar. Si keepImages=true, agregar a las existentes
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map((f) => f.path);
            if (keepImages === "true") {
                product.images = [...product.images, ...newImages].slice(0, 5);
            } else {
                product.images = newImages;
            }
        }

        if (name) product.name = name.trim();
        if (description !== undefined) product.description = description.trim();
        if (basePrice) product.basePrice = parseFloat(basePrice);
        if (discount) product.discount = JSON.parse(discount);
        if (status !== undefined) product.status = status === "true";

        await product.save();
        res.status(200).json({ message: "Product updated", data: product });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
};

// DELETE — eliminar producto y sus variantes
productsController.remove = async (req, res) => {
    try {
        const storeId = req.user.id;
        const { id } = req.params;

        const product = await productModel.findOne({ _id: id, idStore: storeId });
        if (!product) return res.status(404).json({ message: "Product not found" });

        await variantModel.deleteMany({ idProduct: id });
        await productModel.deleteOne({ _id: id });

        res.status(200).json({ message: "Product and variants deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
};

// PATCH — toggle status del producto
productsController.toggleStatus = async (req, res) => {
    try {
        const storeId = req.user.id;
        const { id } = req.params;

        const product = await productModel.findOne({ _id: id, idStore: storeId });
        if (!product) return res.status(404).json({ message: "Product not found" });

        product.status = !product.status;
        await product.save();

        res.status(200).json({ message: "Product status updated", status: product.status });
    } catch (error) {
        res.status(500).json({ message: "Error updating status", error: error.message });
    }
};

export default productsController;