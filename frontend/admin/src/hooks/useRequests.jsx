// useRequests.js
// Hook para manejar solicitudes de emprendedores
// Hook for managing entrepreneur requests

import { useState, useEffect, useCallback } from "react";
import adminRequestsService from "../services/adminRequestsService";

export function useRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminRequestsService.getAllOwners();
      setRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Aprobar tienda / Approve store
  const approveStore = async (ownerId) => {
    try {
      await adminRequestsService.approveStore(ownerId);
      // Actualiza el estado local / Update local state
      setRequests(prev =>
        prev.map(r => r._id === ownerId ? { ...r, isVerified: true } : r)
      );
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return { requests, loading, error, fetchRequests, approveStore };
}