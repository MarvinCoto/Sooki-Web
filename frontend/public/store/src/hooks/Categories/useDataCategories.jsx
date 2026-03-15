import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../utils/api';

const useDataCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const categoriesData = data.success ? data.data : data;

      if (!Array.isArray(categoriesData)) {
        setCategories([]);
      } else {
        setCategories(categoriesData);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching categories:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    isEmpty: categories.length === 0,
    count: categories.length,
  };
};

export default useDataCategories;