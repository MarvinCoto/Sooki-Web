import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../utils/api';

const useDataStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/stores`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const storesData = data.success ? data.data : data;

      if (!Array.isArray(storesData)) {
        console.warn('Expected array but got:', typeof storesData);
        setStores([]);
      } else {
        setStores(storesData);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching stores:', err);
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return {
    stores,
    loading,
    error,
    refetch: fetchStores,
    isEmpty: stores.length === 0,
    count: stores.length,
  };
};

export default useDataStores;