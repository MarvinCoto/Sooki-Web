import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../utils/api";

const useStoreDetails = (storeId) => {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!storeId) return;

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [storeRes, productsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/stores/${storeId}`),
          fetch(`${API_BASE_URL}/products/store/${storeId}`),
        ]);

        if (!storeRes.ok) {
          if (storeRes.status === 404) throw new Error("Tienda no encontrada");
          if (storeRes.status === 403) throw new Error("Esta tienda no está disponible");
          throw new Error("Error al cargar la tienda");
        }

        const storeData = await storeRes.json();
        const productsData = productsRes.ok ? await productsRes.json() : [];

        // Normalizar colores — si no hay 3, completar con defaults
        const defaultColors = ["#FF8C42", "#1B2B44", "#f8fafc"];
        const colors = [
          storeData.colors?.[0] || defaultColors[0],
          storeData.colors?.[1] || defaultColors[1],
          storeData.colors?.[2] || defaultColors[2],
        ];

        setStore({ ...storeData, colors });
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [storeId]);

  return { store, products, loading, error };
};

export default useStoreDetails;