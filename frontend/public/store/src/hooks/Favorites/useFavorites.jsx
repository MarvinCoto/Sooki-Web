import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../utils/api";

const useFavorites = (clientId) => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ===== FETCH FAVORITOS =====
  const fetchFavorites = async () => {
    if (!clientId) {
      setFavoriteProducts([]);
      setFavoriteIds(new Set());
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/clients/favorites/${clientId}`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);

      const data = await response.json();
      const favorites = data.favorites || [];

      const ids = new Set();
      const products = [];

      favorites.forEach((fav) => {
        if (fav.idProduct && typeof fav.idProduct === "object" && fav.idProduct._id) {
          ids.add(fav.idProduct._id);
          products.push({
            ...fav.idProduct,
            categoryName: fav.idProduct.idCategory?.name || "Sin categoría",
            storeName: fav.idProduct.idStore?.storeName || "Sooki",
            finalPrice:
              fav.idProduct.discount?.active
                ? fav.idProduct.basePrice * (1 - fav.idProduct.discount.percentage / 100)
                : fav.idProduct.basePrice,
          });
        } else if (fav.idProduct) {
          ids.add(fav.idProduct);
        }
      });

      setFavoriteIds(ids);
      setFavoriteProducts(products);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError(err.message);
      setFavoriteProducts([]);
      setFavoriteIds(new Set());
    } finally {
      setLoading(false);
    }
  };

  // ===== TOGGLE FAVORITO =====
  const toggleFavorite = async (productId) => {
    if (!clientId) throw new Error("Cliente no autenticado");

    const isCurrentlyFavorite = favoriteIds.has(productId);

    const endpoint = isCurrentlyFavorite
      ? `${API_BASE_URL}/clients/favorites/remove`
      : `${API_BASE_URL}/clients/favorites/add`;

    const method = isCurrentlyFavorite ? "DELETE" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId: clientId, idProduct: productId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar favorito");
    }

    // Actualizar estado local inmediatamente
    const newIds = new Set(favoriteIds);
    if (isCurrentlyFavorite) {
      newIds.delete(productId);
      setFavoriteProducts((prev) =>
        prev.filter((p) => p._id !== productId)
      );
    } else {
      newIds.add(productId);
      setTimeout(() => fetchFavorites(), 500);
    }

    setFavoriteIds(newIds);
    return { success: true, isFavorite: !isCurrentlyFavorite };
  };

  const isFavorite = (productId) => favoriteIds.has(productId);

  useEffect(() => {
    if (clientId) fetchFavorites();
    else {
      setFavoriteProducts([]);
      setFavoriteIds(new Set());
    }
  }, [clientId]);

  return {
    favoriteProducts,
    favoriteIds,
    loading,
    error,
    toggleFavorite,
    isFavorite,
    fetchFavorites,
    isEmpty: favoriteProducts.length === 0,
    count: favoriteProducts.length,
  };
};

export default useFavorites;