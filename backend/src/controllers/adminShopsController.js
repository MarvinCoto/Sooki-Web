// adminShopsController.js
// Controlador admin para gestión de tiendas
// Admin controller for shops management

import storeModel from "../models/Stores.js";
import storeOwnerModel from "../models/StoreOwners.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const adminShopsController = {};

// ===== GET ALL STORES (Admin) =====
// Retorna todas las tiendas con y sin isActive / Returns all stores active and inactive
adminShopsController.getAllShops = async (req, res) => {
  try {
    const stores = await storeModel
      .find()
      .select("-password -credentialsToken -credentialsTokenExpires")
      .populate("owner", "ownerName email phoneNumber isVerified")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: stores.length,
      stores,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// ===== GET STORE BY ID (Admin) =====
adminShopsController.getShopById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id))
      return res.status(400).json({ success: false, message: "ID de tienda inválido" });

    const store = await storeModel
      .findById(id)
      .select("-password -credentialsToken -credentialsTokenExpires")
      .populate("owner", "ownerName email phoneNumber isVerified documentType");

    if (!store)
      return res.status(404).json({ success: false, message: "Tienda no encontrada" });

    res.status(200).json({ success: true, store });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// ===== TOGGLE STORE STATUS =====
// Activa o desactiva una tienda / Activates or deactivates a store
adminShopsController.toggleShopStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id))
      return res.status(400).json({ success: false, message: "ID de tienda inválido" });

    const store = await storeModel.findById(id);

    if (!store)
      return res.status(404).json({ success: false, message: "Tienda no encontrada" });

    // Alterna el estado / Toggle status
    const nuevoEstado = !store.isActive;

    const storeActualizada = await storeModel
      .findByIdAndUpdate(id, { isActive: nuevoEstado }, { new: true })
      .select("-password -credentialsToken -credentialsTokenExpires");

    res.status(200).json({
      success: true,
      message: `Tienda ${nuevoEstado ? "activada" : "desactivada"} exitosamente`,
      store: storeActualizada,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// ===== GET PENDING OWNERS (Admin) =====
// Retorna emprendedores pendientes de aprobación
// Returns entrepreneurs pending approval
adminShopsController.getPendingOwners = async (req, res) => {
  try {
    const pendingOwners = await storeOwnerModel
      .find({ isVerified: false, emailIsVerified: true })
      .select("-credentialsToken -credentialsTokenExpires")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingOwners.length,
      owners: pendingOwners,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// ===== GET SHOP STATS (para Reports) =====
// Retorna estadísticas de tiendas / Returns store statistics
adminShopsController.getShopStats = async (req, res) => {
  try {
    const totalStores    = await storeModel.countDocuments();
    const activeStores   = await storeModel.countDocuments({ isActive: true });
    const inactiveStores = await storeModel.countDocuments({ isActive: false });
    const pendingOwners  = await storeOwnerModel.countDocuments({
      isVerified: false,
      emailIsVerified: true,
    });

    // Tiendas creadas este mes / Stores created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newThisMonth = await storeModel.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    res.status(200).json({
      success: true,
      stats: {
        totalStores,
        activeStores,
        inactiveStores,
        pendingOwners,
        newThisMonth,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

export default adminShopsController;