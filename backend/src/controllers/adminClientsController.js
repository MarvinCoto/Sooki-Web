// adminClientsController.js
// Controlador admin para gestión de clientes
// Admin controller for client management

import clientsModel from "../models/Clients.js";
import mongoose from "mongoose";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const adminClientsController = {};

// ===== GET ALL CLIENTS (Admin) =====
// Retorna todos los clientes con su estado / Returns all clients with their status
adminClientsController.getAllClients = async (req, res) => {
  try {
    const { type } = req.query; // type = "client" o "entrepreneur (futuro)

    const clients = await clientsModel
      .find()
      .select("-password -favorites")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clients.length,
      clients,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// ===== GET CLIENT BY ID (Admin) =====
adminClientsController.getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id))
      return res.status(400).json({ success: false, message: "ID de cliente inválido" });

    const client = await clientsModel.findById(id).select("-password");

    if (!client)
      return res.status(404).json({ success: false, message: "Cliente no encontrado" });

    res.status(200).json({ success: true, client });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// ===== TOGGLE CLIENT STATUS =====
// Activa o desactiva un cliente / Activates or deactivates a client
adminClientsController.toggleClientStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id))
      return res.status(400).json({ success: false, message: "ID de cliente inválido" });

    const client = await clientsModel.findById(id);

    if (!client)
      return res.status(404).json({ success: false, message: "Cliente no encontrado" });

    // Alterna el estado / Toggle status
    const nuevoEstado = !client.isActive;

    const clientActualizado = await clientsModel
      .findByIdAndUpdate(id, { isActive: nuevoEstado }, { new: true })
      .select("-password");

    res.status(200).json({
      success: true,
      message: `Cliente ${nuevoEstado ? "activado" : "desactivado"} exitosamente`,
      client: clientActualizado,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// ===== GET CLIENT STATS (para Reports) =====
// Retorna estadísticas de clientes / Returns client statistics
adminClientsController.getClientStats = async (req, res) => {
  try {
    const totalClients    = await clientsModel.countDocuments();
    const activeClients   = await clientsModel.countDocuments({ isActive: true });
    const inactiveClients = await clientsModel.countDocuments({ isActive: false });
    const verifiedClients = await clientsModel.countDocuments({ isVerified: true });

    // Clientes registrados este mes / Clients registered this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newThisMonth = await clientsModel.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    res.status(200).json({
      success: true,
      stats: {
        totalClients,
        activeClients,
        inactiveClients,
        verifiedClients,
        newThisMonth,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

export default adminClientsController;