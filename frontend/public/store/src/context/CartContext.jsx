import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { API_BASE_URL } from "../utils/api";

const CartContext = createContext();

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isLoggedIn, user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  // ===== FETCH =====
  const fetchCart = async () => {
    if (!isLoggedIn || !user?.id) {
      setCart({ items: [] });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/cart/${user.id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setCart(data.cart);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isLoggedIn, user?.id]);

  // ===== AGREGAR =====
  const addItem = async (product, quantity = 1) => {
    if (!isLoggedIn || !user?.id) {
      toast.error("Debes iniciar sesión para agregar al carrito");
      return { success: false };
    }

    try {
      // Si ya está en el carrito, actualizar cantidad localmente primero
      const existingIndex = cart.items.findIndex(
        (item) =>
          item.idProduct?._id === product._id ||
          item.idProduct === product._id
      );

      const res = await fetch(`${API_BASE_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          clientId: user.id,
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

      // Actualizar estado local inmediatamente
      if (existingIndex >= 0) {
        setCart((prev) => ({
          ...prev,
          items: prev.items.map((item, i) =>
            i === existingIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        }));
      } else {
        // Agregar item temporal con datos básicos
        setCart((prev) => ({
          ...prev,
          items: [
            ...prev.items,
            {
              idProduct: product,
              idStore: product.idStore,
              quantity,
              _id: Date.now().toString(),
            },
          ],
        }));
      }

      toast.success("Producto agregado al carrito");
      return { success: true };
    } catch (err) {
      toast.error("Error al agregar al carrito");
      return { success: false };
    }
  };

  // ===== ACTUALIZAR CANTIDAD =====
  const updateQuantity = async (idProduct, quantity) => {
    if (!isLoggedIn || !user?.id) return { success: false };

    try {
      const res = await fetch(`${API_BASE_URL}/cart/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ clientId: user.id, idProduct, quantity }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || "Error al actualizar cantidad");
        return { success: false };
      }

      setCart((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.idProduct?._id === idProduct || item.idProduct === idProduct
            ? { ...item, quantity }
            : item
        ),
      }));

      return { success: true };
    } catch {
      toast.error("Error al actualizar cantidad");
      return { success: false };
    }
  };

  // ===== ELIMINAR =====
  const removeItem = async (idProduct) => {
    if (!isLoggedIn || !user?.id) return { success: false };

    try {
      const res = await fetch(`${API_BASE_URL}/cart/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ clientId: user.id, idProduct }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || "Error al eliminar producto");
        return { success: false };
      }

      setCart((prev) => ({
        ...prev,
        items: prev.items.filter(
          (item) =>
            item.idProduct?._id !== idProduct &&
            item.idProduct !== idProduct
        ),
      }));

      toast.success("Producto eliminado del carrito");
      return { success: true };
    } catch {
      toast.error("Error al eliminar producto");
      return { success: false };
    }
  };

  // ===== VACIAR =====
  const clearCart = async () => {
    if (!isLoggedIn || !user?.id) return { success: false };

    try {
      const res = await fetch(`${API_BASE_URL}/cart/clear/${user.id}`, {
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
    } catch {
      toast.error("Error al vaciar el carrito");
      return { success: false };
    }
  };

  // ===== UTILIDADES =====
  const isInCart = (idProduct) =>
    cart.items.some(
      (item) =>
        item.idProduct?._id === idProduct || item.idProduct === idProduct
    );

  const getItemQuantity = (idProduct) => {
    const item = cart.items.find(
      (i) => i.idProduct?._id === idProduct || i.idProduct === idProduct
    );
    return item?.quantity || 0;
  };

  const getTotalItems = () =>
    cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const getTotalPrice = () =>
    cart.items.reduce((sum, item) => {
      const product = item.idProduct;
      if (!product || typeof product !== "object") return sum;
      const hasDiscount = product.discount?.active && product.discount?.percentage > 0;
      const price = hasDiscount
        ? product.basePrice * (1 - product.discount.percentage / 100)
        : product.basePrice;
      return sum + price * item.quantity;
    }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};