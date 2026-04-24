// useShops.js
// Hook para manejar el estado de tiendas
// Hook for managing shops state

import { useState, useEffect, useCallback } from "react";
import adminShopsService from "../services/adminShopsService";

export function useShops() {
  const [shops, setShops]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // Carga todas las tiendas / Load all shops
  const fetchShops = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminShopsService.getAllShops();
      setShops(data.stores);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  // Toggle estado de tienda / Toggle shop status
  const toggleStatus = async (id) => {
    try {
      const data = await adminShopsService.toggleShopStatus(id);
      setShops(prev =>
        prev.map(s => s._id === id ? { ...s, isActive: data.store.isActive } : s)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return { shops, loading, error, fetchShops, toggleStatus };
}

// ── Hook para emprendedores pendientes / Hook for pending owners ──
export function usePendingOwners() {
  const [owners, setOwners]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetchOwners = async () => {
      setLoading(true);
      try {
        const data = await adminShopsService.getPendingOwners();
        setOwners(data.owners);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOwners();
  }, []);

  return { owners, loading, error };
}

// ── Hook para estadísticas / Hook for stats ──
export function useShopStats() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await adminShopsService.getShopStats();
        setStats(data.stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, loading, error };
}