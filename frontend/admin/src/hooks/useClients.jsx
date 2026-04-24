// useClients.js
// Hook para manejar el estado de clientes
// Hook for managing clients state

import { useState, useEffect, useCallback } from "react";
import adminClientsService from "../services/adminClientsService";

export function useClients() {
  const [clients, setClients]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // Carga todos los clientes / Load all clients
  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminClientsService.getAllClients();
      setClients(data.clients);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga al montar el componente / Load on component mount
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Toggle estado del cliente / Toggle client status
  const toggleStatus = async (id) => {
    try {
      const data = await adminClientsService.toggleClientStatus(id);
      // Actualiza el cliente en la lista sin recargar todo
      // Updates the client in the list without reloading everything
      setClients(prev =>
        prev.map(c => c._id === id ? { ...c, isActive: data.client.isActive } : c)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return { clients, loading, error, fetchClients, toggleStatus };
}

// ── Hook para estadísticas / Hook for stats ──
export function useClientStats() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await adminClientsService.getClientStats();
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