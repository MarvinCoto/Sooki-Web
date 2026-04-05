import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../utils/api';

const useDataProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const productsData = data.success ? data.data : data;

      if (!Array.isArray(productsData)) {
        console.warn('Expected array but got:', typeof productsData);
        setProducts([]);
      } else {
        const processed = productsData.map(p => ({
          ...p,
          storeName: p.idStore?.storeName || 'Sooki',
          categoryName: p.idCategory?.name || 'General',
          finalPrice: p.discount?.active
            ? p.basePrice * (1 - (p.discount.percentage / 100))
            : p.basePrice,
        }));
        setProducts(processed);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    isEmpty: products.length === 0,
    count: products.length,
  };
};

export default useDataProducts;