// adminReportsController.js
// Controlador admin para reportes generales
// Admin controller for general reports

import clientsModel  from "../models/Clients.js";
import storeModel    from "../models/Stores.js";
import productsModel from "../models/Products.js";
import variantsModel from "../models/Variants.js";

const adminReportsController = {};

// ===== GET GENERAL STATS =====
// Retorna estadísticas generales del panel / Returns general panel statistics
adminReportsController.getGeneralStats = async (req, res) => {
  try {
    // ── Totales / Totals ──
    const totalClients  = await clientsModel.countDocuments();
    const totalStores   = await storeModel.countDocuments();
    const totalProducts = await productsModel.countDocuments();
    const activeStores  = await storeModel.countDocuments({ isActive: true });

    // ── Este mes / This month ──
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newClientsThisMonth  = await clientsModel.countDocuments({ createdAt: { $gte: startOfMonth } });
    const newStoresThisMonth   = await storeModel.countDocuments({ createdAt: { $gte: startOfMonth } });

    // ── Mes anterior / Last month ──
    const startOfLastMonth = new Date();
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
    startOfLastMonth.setDate(1);
    startOfLastMonth.setHours(0, 0, 0, 0);

    const endOfLastMonth = new Date();
    endOfLastMonth.setDate(0);
    endOfLastMonth.setHours(23, 59, 59, 999);

    const newClientsLastMonth = await clientsModel.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    // ── Porcentaje de crecimiento de clientes / Client growth percentage ──
    const clientGrowth = newClientsLastMonth === 0
      ? 100
      : Math.round(((newClientsThisMonth - newClientsLastMonth) / newClientsLastMonth) * 100);

    res.status(200).json({
      success: true,
      stats: {
        totalClients,
        totalStores,
        totalProducts,
        activeStores,
        newClientsThisMonth,
        newStoresThisMonth,
        clientGrowth,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// ===== GET TOP STORES =====
// Retorna las tiendas con más productos / Returns stores with most products
adminReportsController.getTopStores = async (req, res) => {
  try {
    const topStores = await productsModel.aggregate([
      // Solo productos activos / Only active products
      { $match: { status: true } },

      // Agrupar por tienda y contar productos / Group by store and count products
      { $group: { _id: "$idStore", totalProducts: { $sum: 1 } } },

      // Ordenar de mayor a menor / Sort descending
      { $sort: { totalProducts: -1 } },

      // Top 5 tiendas / Top 5 stores
      { $limit: 5 },

      // Traer datos de la tienda / Fetch store data
      {
        $lookup: {
          from: "Stores",
          localField: "_id",
          foreignField: "_id",
          as: "store",
        },
      },
      { $unwind: "$store" },

      // Solo los campos necesarios / Only needed fields
      {
        $project: {
          _id: 0,
          storeId: "$_id",
          storeName: "$store.storeName",
          logo: "$store.logo",
          isActive: "$store.isActive",
          totalProducts: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, topStores });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// ===== GET TOP PRODUCTS =====
// Retorna los productos con más stock / Returns products with most stock
adminReportsController.getTopProducts = async (req, res) => {
  try {
    const topProducts = await variantsModel.aggregate([
      // Agrupar por producto y sumar stock / Group by product and sum stock
      { $group: { _id: "$idProduct", totalStock: { $sum: "$stock" } } },

      // Ordenar de mayor a menor / Sort descending
      { $sort: { totalStock: -1 } },

      // Top 5 productos / Top 5 products
      { $limit: 5 },

      // Traer datos del producto / Fetch product data
      {
        $lookup: {
          from: "Products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },

      // Solo los campos necesarios / Only needed fields
      {
        $project: {
          _id: 0,
          productId: "$_id",
          productName: "$product.name",
          basePrice: "$product.basePrice",
          totalStock: 1,
          status: "$product.status",
        },
      },
    ]);

    res.status(200).json({ success: true, topProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// ===== GET MONTHLY GROWTH =====
// Retorna crecimiento mensual de clientes y tiendas
// Returns monthly growth of clients and stores
adminReportsController.getMonthlyGrowth = async (req, res) => {
  try {
    const months = [];
    const now = new Date();

    // Últimos 6 meses / Last 6 months
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end   = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

      const clients = await clientsModel.countDocuments({
        createdAt: { $gte: start, $lte: end },
      });

      const stores = await storeModel.countDocuments({
        createdAt: { $gte: start, $lte: end },
      });

      months.push({
        mes: start.toLocaleString("es-ES", { month: "short" }),
        clientes: clients,
        tiendas: stores,
      });
    }

    res.status(200).json({ success: true, growth: months });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

export default adminReportsController;