// useReports.js
// Hook para manejar el estado de reportes
// Hook for managing reports state

import { useState, useEffect } from "react";
import adminReportsService from "../services/adminReportsService";

// ── Hook principal que carga todo de una vez / Main hook that loads everything ──
export function useReports() {
  const [stats, setStats]       = useState(null);
  const [topStores, setTopStores]     = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [growth, setGrowth]     = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        // Carga todo en paralelo / Load everything in parallel
        const [statsData, storesData, productsData, growthData] = await Promise.all([
          adminReportsService.getGeneralStats(),
          adminReportsService.getTopStores(),
          adminReportsService.getTopProducts(),
          adminReportsService.getMonthlyGrowth(),
        ]);

        setStats(statsData.stats);
        setTopStores(storesData.topStores);
        setTopProducts(productsData.topProducts);
        setGrowth(growthData.growth);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return { stats, topStores, topProducts, growth, loading, error };
}