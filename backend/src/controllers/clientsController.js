//clientsController.js
import clientsModel from "../models/Clients.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config.js";
import mongoose from "mongoose";

cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret,
});

// ===== UTILIDADES =====
const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateStringLength = (str, min, max) => {
  if (!str || typeof str !== "string") return false;
  const trimmed = str.trim();
  return trimmed.length >= min && trimmed.length <= max;
};

const validatePassword = (password) => {
  if (!password || typeof password !== "string") return false;
  return password.length >= 8;
};

const clientsController = {};

// ===== GET ALL =====
clientsController.getClients = async (req, res) => {
  try {
    const clients = await clientsModel.find().select("-password");
    res.status(200).json({ success: true, count: clients.length, clients });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// ===== GET BY ID =====
clientsController.getClientById = async (req, res) => {
  try {
    const clientId = req.params.id;
    if (!validateObjectId(clientId))
      return res.status(400).json({ success: false, message: "ID de cliente inválido" });

    const client = await clientsModel.findById(clientId).select("-password");
    if (!client)
      return res.status(404).json({ success: false, message: "Cliente no encontrado" });

    res.status(200).json({ success: true, client });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// ===== UPDATE =====
clientsController.updateClients = async (req, res) => {
  const { name, lastname, birthdate, email } = req.body;

  try {
    const clientId = req.params.id;
    if (!validateObjectId(clientId))
      return res.status(400).json({ success: false, message: "ID de cliente inválido" });

    const existingClient = await clientsModel.findById(clientId);
    if (!existingClient)
      return res.status(404).json({ success: false, message: "Cliente no encontrado" });

    if (name && !validateStringLength(name, 2, 50))
      return res.status(400).json({ success: false, message: "El nombre debe tener entre 2 y 50 caracteres" });

    if (lastname && !validateStringLength(lastname, 2, 50))
      return res.status(400).json({ success: false, message: "El apellido debe tener entre 2 y 50 caracteres" });

    if (email && !validateEmail(email))
      return res.status(400).json({ success: false, message: "Formato de email inválido" });

    if (email && email.trim().toLowerCase() !== existingClient.email) {
      const emailExists = await clientsModel.findOne({
        email: email.trim().toLowerCase(),
        _id: { $ne: clientId },
      });
      if (emailExists)
        return res.status(409).json({ success: false, message: "El email ya está en uso" });
    }

    let photo = existingClient.photo;

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "sooki/clients",
          allowed_formats: ["jpg", "png", "jpeg", "webp", "jfif"],
          transformation: [{ width: 500, height: 500, crop: "limit" }, { quality: "auto" }],
        });
        photo = result.secure_url;
      } catch (cloudinaryError) {
        return res.status(500).json({ success: false, message: "Error al subir la imagen" });
      }
    }

    const updateData = {
      name: name ? name.trim() : existingClient.name,
      lastname: lastname ? lastname.trim() : existingClient.lastname,
      birthdate: birthdate ? new Date(birthdate) : existingClient.birthdate,
      email: email ? email.trim().toLowerCase() : existingClient.email,
      photo,
    };

    const clientUpdated = await clientsModel
      .findByIdAndUpdate(clientId, updateData, { new: true })
      .select("-password");

    return res.status(200).json({ success: true, message: "Cliente actualizado exitosamente", client: clientUpdated });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// ===== CHANGE PASSWORD =====
clientsController.changePassword = async (req, res) => {
  try {
    const clientId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    if (!validateObjectId(clientId))
      return res.status(400).json({ success: false, message: "ID de cliente inválido" });

    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: "Contraseña actual y nueva contraseña son requeridas" });

    if (!validatePassword(newPassword))
      return res.status(400).json({ success: false, message: "La nueva contraseña debe tener al menos 8 caracteres" });

    if (currentPassword === newPassword)
      return res.status(400).json({ success: false, message: "La nueva contraseña debe ser diferente a la actual" });

    const client = await clientsModel.findById(clientId);
    if (!client)
      return res.status(404).json({ success: false, message: "Cliente no encontrado" });

    const isValid = await bcrypt.compare(currentPassword, client.password);
    if (!isValid)
      return res.status(401).json({ success: false, message: "Contraseña actual incorrecta" });

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await clientsModel.findByIdAndUpdate(clientId, { password: hashedPassword });

    return res.status(200).json({ success: true, message: "Contraseña cambiada exitosamente" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// ===== DELETE =====
clientsController.deleteClients = async (req, res) => {
  try {
    const clientId = req.params.id;
    if (!validateObjectId(clientId))
      return res.status(400).json({ success: false, message: "ID de cliente inválido" });

    const deleted = await clientsModel.findByIdAndDelete(clientId);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Cliente no encontrado" });

    res.status(200).json({ success: true, message: "Cliente eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// ===== FAVORITOS (PRODUCTOS) =====

clientsController.getFavoritesByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!validateObjectId(userId))
      return res.status(400).json({ success: false, message: "ID de usuario inválido" });

    const user = await clientsModel.findById(userId).populate({
      path: "favorites.idProduct",
      populate: { path: "idCategory", model: "Categories" },
    });

    if (!user)
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    res.status(200).json({
      success: true,
      count: user.favorites.length,
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

clientsController.addFavoriteProduct = async (req, res) => {
  const { userId, idProduct } = req.body;
  try {
    if (!userId || !idProduct)
      return res.status(400).json({ success: false, message: "userId e idProduct son requeridos" });

    if (!validateObjectId(userId) || !validateObjectId(idProduct))
      return res.status(400).json({ success: false, message: "IDs inválidos" });

    const user = await clientsModel.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    const alreadyFav = user.favorites.some(
      (fav) => fav.idProduct.toString() === idProduct
    );
    if (alreadyFav)
      return res.status(409).json({ success: false, message: "El producto ya está en favoritos" });

    user.favorites.push({ idProduct });
    await user.save();

    res.status(200).json({
      success: true,
      message: "Producto agregado a favoritos",
      favoritesCount: user.favorites.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

clientsController.removeFavoriteProduct = async (req, res) => {
  const { userId, idProduct } = req.body;
  try {
    if (!userId || !idProduct)
      return res.status(400).json({ success: false, message: "userId e idProduct son requeridos" });

    if (!validateObjectId(userId) || !validateObjectId(idProduct))
      return res.status(400).json({ success: false, message: "IDs inválidos" });

    const user = await clientsModel.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    const initialLength = user.favorites.length;
    user.favorites = user.favorites.filter(
      (fav) => fav.idProduct.toString() !== idProduct
    );

    if (user.favorites.length === initialLength)
      return res.status(404).json({ success: false, message: "Producto no encontrado en favoritos" });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Producto eliminado de favoritos",
      favoritesCount: user.favorites.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

clientsController.checkFavoriteStatus = async (req, res) => {
  const { userId, idProduct } = req.params;
  try {
    if (!validateObjectId(userId) || !validateObjectId(idProduct))
      return res.status(400).json({ success: false, message: "IDs inválidos" });

    const user = await clientsModel.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    const isFavorite = user.favorites.some(
      (fav) => fav.idProduct.toString() === idProduct
    );

    res.status(200).json({ success: true, isFavorite });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

clientsController.getFavoritesCount = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!validateObjectId(userId))
      return res.status(400).json({ success: false, message: "ID de usuario inválido" });

    const user = await clientsModel.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    res.status(200).json({ success: true, count: user.favorites.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

export default clientsController;