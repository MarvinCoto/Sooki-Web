import productModel from "../models/Products.js";
import variantModel from "../models/Variants.js";
import variantAttributeModel from "../models/VariantAttributes.js";
import categoryModel from "../models/Categories.js";

const productsController = {};

// Calcula el precio minimo de las variantes activas de un producto
const getMinPrice = (variants) => {
    const active = variants.filter((v) => v.status && v.stock > 0);
    if (active.length === 0) return null;
    return Math.min(...active.map((v) => v.price));
};

// Aplica descuento a un precio
const applyDiscount = (price, discount) => {
    if (!discount?.active || !discount?.percentage) return price;
    return price - (price * discount.percentage / 100);
};

// GET publico — solo productos activos con variantes con stock
productsController.getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find({ status: true })
            .populate("idCategory", "name")
            .populate("idStore", "storeName logo")
            .sort({ createdAt: -1 });

        const result = await Promise.all(
            products.map(async (product) => {
                const variants = await variantModel.find({ idProduct: product._id, status: true });
                const activeVariants = variants.filter((v) => v.stock > 0);

                // Solo incluir si tiene al menos una variante activa con stock
                if (activeVariants.length === 0) return null;

                const minPrice = getMinPrice(variants);
                const finalPrice = applyDiscount(minPrice, product.discount);
                const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

                return {
                    ...product.toObject(),
                    minPrice,
                    finalPrice,
                    totalStock,
                    variantCount: variants.length,
                };
            })
        );

        res.status(200).json(result.filter(Boolean));
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET panel owner — todos los productos de la tienda con stock total
productsController.getAll = async (req, res) => {
    try {
        const storeId = req.user.id;

        const products = await productModel.find({ idStore: storeId })
            .populate("idCategory", "name")
            .sort({ createdAt: -1 });

        const productsWithStock = await Promise.all(
            products.map(async (product) => {
                const variants = await variantModel.find({ idProduct: product._id });
                const activeVariants = variants.filter((v) => v.status);
                const totalStock = activeVariants.reduce((sum, v) => sum + v.stock, 0);
                const variantCount = variants.length;
                const minPrice = getMinPrice(variants);
                const prices = [...new Set(activeVariants.map((v) => v.price))];
                const hasMultiplePrices = prices.length > 1;

                return {
                    ...product.toObject(),
                    totalStock,
                    variantCount,
                    minPrice,
                    hasMultiplePrices,
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

// POST — crear producto con variante inicial obligatoria
productsController.create = async (req, res) => {
    try {
        const storeId = req.user.id;
        const { name, description, idCategory, discount, variantPrice, variantStock } = req.body;

        if (!variantPrice || parseFloat(variantPrice) < 0) {
            return res.status(400).json({ message: "Variant price is required" });
        }

        const category = await categoryModel.findOne({ _id: idCategory, idStore: storeId });
        if (!category) return res.status(404).json({ message: "Category not found" });

        const images = req.files ? req.files.map((f) => f.path) : [];

        const newProduct = new productModel({
            name: name.trim(),
            description: description?.trim() || "",
            idCategory,
            idStore: storeId,
            images,
            discount: discount ? JSON.parse(discount) : { percentage: 0, active: false },
            status: false, // inactivo por defecto
        });

        await newProduct.save();

        // Crear variante inicial obligatoria
        const initialVariant = new variantModel({
            idProduct: newProduct._id,
            price: parseFloat(variantPrice),
            stock: parseInt(variantStock) || 0,
            status: true,
        });

        await initialVariant.save();

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
        const { name, description, idCategory, discount, status, keepImages } = req.body;

        const product = await productModel.findOne({ _id: id, idStore: storeId });
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (idCategory) {
            const category = await categoryModel.findOne({ _id: idCategory, idStore: storeId });
            if (!category) return res.status(404).json({ message: "Category not found" });
            product.idCategory = idCategory;
        }

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map((f) => f.path);
            product.images = keepImages === "true"
                ? [...product.images, ...newImages].slice(0, 5)
                : newImages;
        }

        if (name) product.name = name.trim();
        if (description !== undefined) product.description = description.trim();
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

        // Eliminar VariantAttributes de todas las variantes
        const variants = await variantModel.find({ idProduct: id });
        for (const variant of variants) {
            await variantAttributeModel.deleteMany({ idVariant: variant._id });
        }

        await variantModel.deleteMany({ idProduct: id });
        await productModel.deleteOne({ _id: id });

        res.status(200).json({ message: "Product and variants deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
};

// PATCH — toggle status
productsController.toggleStatus = async (req, res) => {
    try {
        const storeId = req.user.id;
        const { id } = req.params;

        const product = await productModel.findOne({ _id: id, idStore: storeId });
        if (!product) return res.status(404).json({ message: "Product not found" });

        // No permitir activar si no tiene variantes con stock
        if (!product.status) {
            const variants = await variantModel.find({ idProduct: id, status: true });
            const hasStock = variants.some((v) => v.stock > 0);
            if (!hasStock) {
                return res.status(400).json({
                    message: "No se puede activar. El producto no tiene variantes con stock disponible."
                });
            }
        }

        product.status = !product.status;
        await product.save();

        res.status(200).json({ message: "Product status updated", status: product.status });
    } catch (error) {
        res.status(500).json({ message: "Error updating status", error: error.message });
    }
};

export default productsController;