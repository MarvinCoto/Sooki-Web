import cartModel from "../models/Cart.js";
import productModel from "../models/Products.js";
import mongoose from "mongoose";

const cartController = {};

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET — obtener carrito del cliente
cartController.getCart = async (req, res) => {
  try {
    const { clientId } = req.params;

    if (!validateObjectId(clientId))
      return res.status(400).json({ success: false, message: "ID de cliente inválido" });

    const cart = await cartModel
      .findOne({ idClient: clientId })
      .populate({
        path: "items.idProduct",
        select: "name images basePrice discount status",
      })
      .populate({
        path: "items.idStore",
        select: "storeName logo",
      });

    if (!cart) {
      return res.status(200).json({ success: true, cart: { idClient: clientId, items: [] } });
    }

    // Filtrar items de productos que ya no están activos
    const activeItems = cart.items.filter(
      (item) => item.idProduct && item.idProduct.status !== false
    );

    res.status(200).json({ success: true, cart: { ...cart.toObject(), items: activeItems } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// POST — agregar producto al carrito
cartController.addItem = async (req, res) => {
  try {
    const { clientId, idProduct, idStore, quantity = 1 } = req.body;

    if (!validateObjectId(clientId) || !validateObjectId(idProduct) || !validateObjectId(idStore))
      return res.status(400).json({ success: false, message: "IDs inválidos" });

    if (quantity < 1)
      return res.status(400).json({ success: false, message: "La cantidad mínima es 1" });

    // Verificar que el producto existe y está activo
    const product = await productModel.findById(idProduct);
    if (!product)
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    if (!product.status)
      return res.status(400).json({ success: false, message: "Producto no disponible" });

    let cart = await cartModel.findOne({ idClient: clientId });

    if (!cart) {
      // Crear carrito nuevo
      cart = new cartModel({
        idClient: clientId,
        items: [{ idProduct, idStore, quantity }],
      });
    } else {
      // Verificar si el producto ya está en el carrito
      const existingIndex = cart.items.findIndex(
        (item) => item.idProduct.toString() === idProduct
      );

      if (existingIndex >= 0) {
        // Si ya existe, sumar la cantidad
        cart.items[existingIndex].quantity += quantity;
      } else {
        // Si no existe, agregar
        cart.items.push({ idProduct, idStore, quantity });
      }
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Producto agregado al carrito",
      itemCount: cart.items.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// PUT — actualizar cantidad de un item
cartController.updateQuantity = async (req, res) => {
  try {
    const { clientId, idProduct, quantity } = req.body;

    if (!validateObjectId(clientId) || !validateObjectId(idProduct))
      return res.status(400).json({ success: false, message: "IDs inválidos" });

    if (!quantity || quantity < 1)
      return res.status(400).json({ success: false, message: "La cantidad mínima es 1" });

    const cart = await cartModel.findOne({ idClient: clientId });
    if (!cart)
      return res.status(404).json({ success: false, message: "Carrito no encontrado" });

    const itemIndex = cart.items.findIndex(
      (item) => item.idProduct.toString() === idProduct
    );

    if (itemIndex < 0)
      return res.status(404).json({ success: false, message: "Producto no encontrado en el carrito" });

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({ success: true, message: "Cantidad actualizada" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// DELETE — eliminar un producto del carrito
cartController.removeItem = async (req, res) => {
  try {
    const { clientId, idProduct } = req.body;

    if (!validateObjectId(clientId) || !validateObjectId(idProduct))
      return res.status(400).json({ success: false, message: "IDs inválidos" });

    const cart = await cartModel.findOne({ idClient: clientId });
    if (!cart)
      return res.status(404).json({ success: false, message: "Carrito no encontrado" });

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.idProduct.toString() !== idProduct
    );

    if (cart.items.length === initialLength)
      return res.status(404).json({ success: false, message: "Producto no encontrado en el carrito" });

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Producto eliminado del carrito",
      itemCount: cart.items.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// DELETE — vaciar carrito completo
cartController.clearCart = async (req, res) => {
  try {
    const { clientId } = req.params;

    if (!validateObjectId(clientId))
      return res.status(400).json({ success: false, message: "ID de cliente inválido" });

    const cart = await cartModel.findOne({ idClient: clientId });
    if (!cart)
      return res.status(404).json({ success: false, message: "Carrito no encontrado" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ success: true, message: "Carrito vaciado" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

export default cartController;