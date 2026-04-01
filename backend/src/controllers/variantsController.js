import variantModel from "../models/Variants.js";
import attributeModel from "../models/Attributes.js";
import attributeValueModel from "../models/AttributeValues.js";
import variantAttributeModel from "../models/VariantAttributes.js";
import productModel from "../models/Products.js";

const variantsController = {};

// ─── ATTRIBUTES ───────────────────────────────────────────

// GET — atributos de la tienda
variantsController.getAttributes = async (req, res) => {
    try {
        const storeId = req.user.id;
        const attributes = await attributeModel.find({ idStore: storeId }).sort({ createdAt: -1 });

        // Para cada atributo, traer sus valores
        const result = await Promise.all(
            attributes.map(async (attr) => {
                const values = await attributeValueModel.find({ idAttribute: attr._id });
                return { ...attr.toObject(), values };
            })
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching attributes", error: error.message });
    }
};

// POST — crear atributo
variantsController.createAttribute = async (req, res) => {
    try {
        const storeId = req.user.id;
        const { name } = req.body;

        if (!name || name.trim().length < 2) {
            return res.status(400).json({ message: "Attribute name must be at least 2 characters" });
        }

        const existing = await attributeModel.findOne({ idStore: storeId, name: name.trim() });
        if (existing) return res.status(400).json({ message: "Attribute already exists" });

        const newAttr = new attributeModel({ name: name.trim(), idStore: storeId });
        await newAttr.save();

        res.status(201).json({ message: "Attribute created", data: { ...newAttr.toObject(), values: [] } });
    } catch (error) {
        res.status(500).json({ message: "Error creating attribute", error: error.message });
    }
};

// PUT — editar atributo
variantsController.updateAttribute = async (req, res) => {
    try {
        const storeId = req.user.id;
        const { id } = req.params;
        const { name } = req.body;

        const attr = await attributeModel.findOne({ _id: id, idStore: storeId });
        if (!attr) return res.status(404).json({ message: "Attribute not found" });

        attr.name = name.trim();
        await attr.save();

        res.status(200).json({ message: "Attribute updated", data: attr });
    } catch (error) {
        res.status(500).json({ message: "Error updating attribute", error: error.message });
    }
};

// DELETE — eliminar atributo y sus valores
variantsController.deleteAttribute = async (req, res) => {
    try {
        const storeId = req.user.id;
        const { id } = req.params;

        const attr = await attributeModel.findOne({ _id: id, idStore: storeId });
        if (!attr) return res.status(404).json({ message: "Attribute not found" });

        // Verificar que no está en uso en alguna variante
        const inUse = await variantAttributeModel.findOne({ idAttribute: id });
        if (inUse) {
            return res.status(400).json({ message: "No se puede eliminar. Este atributo esta en uso en una o mas variantes." });
        }

        await attributeValueModel.deleteMany({ idAttribute: id });
        await attributeModel.deleteOne({ _id: id });

        res.status(200).json({ message: "Attribute and values deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting attribute", error: error.message });
    }
};

// ─── ATTRIBUTE VALUES ─────────────────────────────────────

// POST — agregar valor a atributo
variantsController.createValue = async (req, res) => {
    try {
        const storeId = req.user.id;
        const { id } = req.params; // id del atributo
        const { value } = req.body;

        const attr = await attributeModel.findOne({ _id: id, idStore: storeId });
        if (!attr) return res.status(404).json({ message: "Attribute not found" });

        if (!value || value.trim().length === 0) {
            return res.status(400).json({ message: "Value is required" });
        }

        const existing = await attributeValueModel.findOne({ idAttribute: id, value: value.trim() });
        if (existing) return res.status(400).json({ message: "Value already exists for this attribute" });

        const newValue = new attributeValueModel({ idAttribute: id, value: value.trim() });
        await newValue.save();

        res.status(201).json({ message: "Value created", data: newValue });
    } catch (error) {
        res.status(500).json({ message: "Error creating value", error: error.message });
    }
};

// DELETE — eliminar valor
variantsController.deleteValue = async (req, res) => {
    try {
        const storeId = req.user.id;
        const { valueId } = req.params;

        // Verificar que el atributo padre pertenece a la tienda
        const val = await attributeValueModel.findById(valueId);
        if (!val) return res.status(404).json({ message: "Value not found" });

        const attr = await attributeModel.findOne({ _id: val.idAttribute, idStore: storeId });
        if (!attr) return res.status(403).json({ message: "Not authorized" });

        const inUse = await variantAttributeModel.findOne({ idValue: valueId });
        if (inUse) {
            return res.status(400).json({ message: "No se puede eliminar. Este valor esta en uso en una o mas variantes." });
        }

        await attributeValueModel.deleteOne({ _id: valueId });
        res.status(200).json({ message: "Value deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting value", error: error.message });
    }
};

// ─── VARIANTS ─────────────────────────────────────────────

// GET — variantes de un producto con sus atributos
variantsController.getVariants = async (req, res) => {
    try {
        const storeId = req.user.id;
        const { productId } = req.params;

        // Verificar que el producto pertenece a la tienda
        const product = await productModel.findOne({ _id: productId, idStore: storeId });
        if (!product) return res.status(404).json({ message: "Product not found" });

        const variants = await variantModel.find({ idProduct: productId }).sort({ createdAt: -1 });

        // Para cada variante, traer sus atributos
        const result = await Promise.all(
            variants.map(async (variant) => {
                const attrs = await variantAttributeModel.find({ idVariant: variant._id })
                    .populate("idAttribute", "name")
                    .populate("idValue", "value");
                return { ...variant.toObject(), attributes: attrs };
            })
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching variants", error: error.message });
    }
};

// POST — crear variante con sus atributos
// Body: { price, stock, status, attributes: [{ idAttribute, idValue }] }
variantsController.createVariant = async (req, res) => {
    try {
        const storeId = req.user.id;
        const { productId } = req.params;
        const { price, stock, status, attributes } = req.body;

        const product = await productModel.findOne({ _id: productId, idStore: storeId });
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (!price || parseFloat(price) < 0) {
            return res.status(400).json({ message: "Valid price is required" });
        }

        const newVariant = new variantModel({
            idProduct: productId,
            price: parseFloat(price),
            stock: parseInt(stock) || 0,
            status: status !== undefined ? status : true,
        });
        await newVariant.save();

        // Guardar atributos de la variante
        if (attributes && Array.isArray(attributes) && attributes.length > 0) {
            const variantAttrs = attributes.map((a) => ({
                idVariant: newVariant._id,
                idAttribute: a.idAttribute,
                idValue: a.idValue,
            }));
            await variantAttributeModel.insertMany(variantAttrs);
        }

        // Retornar variante con atributos
        const savedAttrs = await variantAttributeModel.find({ idVariant: newVariant._id })
            .populate("idAttribute", "name")
            .populate("idValue", "value");

        res.status(201).json({ message: "Variant created", data: { ...newVariant.toObject(), attributes: savedAttrs } });
    } catch (error) {
        res.status(500).json({ message: "Error creating variant", error: error.message });
    }
};

// PUT — editar variante (precio, stock, status y atributos)
variantsController.updateVariant = async (req, res) => {
    try {
        const storeId = req.user.id;
        const { variantId } = req.params;
        const { price, stock, status, attributes } = req.body;

        const variant = await variantModel.findById(variantId);
        if (!variant) return res.status(404).json({ message: "Variant not found" });

        const product = await productModel.findOne({ _id: variant.idProduct, idStore: storeId });
        if (!product) return res.status(403).json({ message: "Not authorized" });

        if (price !== undefined) variant.price = parseFloat(price);
        if (stock !== undefined) variant.stock = parseInt(stock);
        if (status !== undefined) variant.status = status;

        await variant.save();

        // Actualizar atributos — borra los anteriores y guarda los nuevos
        if (attributes && Array.isArray(attributes)) {
            await variantAttributeModel.deleteMany({ idVariant: variantId });

            if (attributes.length > 0) {
                const newAttrs = attributes
                    .filter((a) => a.idAttribute && a.idValue)
                    .map((a) => ({
                        idVariant: variant._id,
                        idAttribute: a.idAttribute,
                        idValue: a.idValue,
                    }));
                if (newAttrs.length > 0) {
                    await variantAttributeModel.insertMany(newAttrs);
                }
            }
        }

        res.status(200).json({ message: "Variant updated", data: variant });
    } catch (error) {
        res.status(500).json({ message: "Error updating variant", error: error.message });
    }
};

// DELETE — eliminar variante y sus atributos
variantsController.deleteVariant = async (req, res) => {
    try {
        const storeId = req.user.id;
        const { variantId } = req.params;

        const variant = await variantModel.findById(variantId);
        if (!variant) return res.status(404).json({ message: "Variant not found" });

        const product = await productModel.findOne({ _id: variant.idProduct, idStore: storeId });
        if (!product) return res.status(403).json({ message: "Not authorized" });

        await variantAttributeModel.deleteMany({ idVariant: variantId });
        await variantModel.deleteOne({ _id: variantId });

        res.status(200).json({ message: "Variant deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting variant", error: error.message });
    }
};

export default variantsController;