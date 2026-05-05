import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../../utils/api";

const useCart = (clientId) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ===== FETCH CARRITO =====
  const fetchCart = async () => {
    if (!clientId) {
      setCart({ items: [] });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/cart/${clientId}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setCart(data.cart);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== AGREGAR AL CARRITO =====
  const addItem = async (product, quantity = 1) => {
    if (!clientId) {
      toast.error("Debes iniciar sesión para agregar al carrito");
      return { success: false };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          clientId,
          idProduct: product._id,
          idStore: product.idStore?._id || product.idStore,
          quantity,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || "Error al agregar al carrito");
        return { success: false };
      }

      await fetchCart();
      toast.success("Producto agregado al carrito");
      return { success: true };
    } catch (err) {
      toast.error("Error al agregar al carrito");
      return { success: false };
    }
  };

  // ===== ACTUALIZAR CANTIDAD =====
  const updateQuantity = async (idProduct, quantity) => {
    if (!clientId) return { success: false };

    try {
      const res = await fetch(`${API_BASE_URL}/cart/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ clientId, idProduct, quantity }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || "Error al actualizar cantidad");
        return { success: false };
      }

      // Actualizar estado local inmediatamente
      setCart((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.idProduct._id === idProduct || item.idProduct === idProduct
            ? { ...item, quantity }
            : item
        ),
      }));

      return { success: true };
    } catch (err) {
      toast.error("Error al actualizar cantidad");
      return { success: false };
    }
  };

  // ===== ELIMINAR ITEM =====
  const removeItem = async (idProduct) => {
    if (!clientId) return { success: false };

    try {
      const res = await fetch(`${API_BASE_URL}/cart/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ clientId, idProduct }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || "Error al eliminar producto");
        return { success: false };
      }

      // Actualizar estado local inmediatamente
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter(
          (item) =>
            item.idProduct._id !== idProduct && item.idProduct !== idProduct
        ),
      }));

      toast.success("Producto eliminado del carrito");
      return { success: true };
    } catch (err) {
      toast.error("Error al eliminar producto");
      return { success: false };
    }
  };

  // ===== VACIAR CARRITO =====
  const clearCart = async () => {
    if (!clientId) return { success: false };

    try {
      const res = await fetch(`${API_BASE_URL}/cart/clear/${clientId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || "Error al vaciar el carrito");
        return { success: false };
      }

      setCart({ items: [] });
      toast.success("Carrito vaciado");
      return { success: true };
    } catch (err) {
      toast.error("Error al vaciar el carrito");
      return { success: false };
    }
  };

  // ===== UTILIDADES =====
  const isInCart = (idProduct) => {
    return cart.items.some(
      (item) =>
        item.idProduct?._id === idProduct || item.idProduct === idProduct
    );
  };

  const getItemQuantity = (idProduct) => {
    const item = cart.items.find(
      (i) => i.idProduct?._id === idProduct || i.idProduct === idProduct
    );
    return item?.quantity || 0;
  };

  const getTotalItems = () => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.items.reduce((sum, item) => {
      const product = item.idProduct;
      if (!product || typeof product !== "object") return sum;
      const hasDiscount = product.discount?.active && product.discount?.percentage > 0;
      const price = hasDiscount
        ? product.basePrice * (1 - product.discount.percentage / 100)
        : product.basePrice;
      return sum + price * item.quantity;
    }, 0);
  };

  useEffect(() => {
    if (clientId) fetchCart();
    else setCart({ items: [] });
  }, [clientId]);

  return {
    cart,
    loading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    fetchCart,
    isInCart,
    getItemQuantity,
    getTotalItems,
    getTotalPrice,
    isEmpty: cart.items.length === 0,
    itemCount: cart.items.length,
  };
};

export default useCart;