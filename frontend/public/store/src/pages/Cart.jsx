import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCartContext } from '../context/CartContext';
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const {
    cart,
    loading,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isEmpty,
  } = useCartContext();

  // ===== NO AUTENTICADO =====
  if (!isLoggedIn) {
    return (
      <div className="cart-page">
        <div className="cart-hero">
          <div className="cart-hero-overlay" />
          <div className="cart-hero-content">
            <ShoppingCart size={40} className="cart-hero-icon" />
            <h1>Mi Carrito</h1>
            <p>Inicia sesión para ver tu carrito</p>
          </div>
        </div>
        <div className="cart-container">
          <div className="cart-empty-state">
            <ShoppingCart size={64} color="#e2e8f0" />
            <h3>Debes iniciar sesión</h3>
            <p>Accede a tu cuenta para ver y gestionar tu carrito de compras.</p>
            <div className="cart-empty-actions">
              <button className="cart-btn cart-btn--primary" onClick={() => navigate("/login")}>
                Iniciar Sesión
              </button>
              <button className="cart-btn cart-btn--outline" onClick={() => navigate("/register")}>
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-hero">
          <div className="cart-hero-overlay" />
          <div className="cart-hero-content">
            <ShoppingCart size={40} className="cart-hero-icon" />
            <h1>Mi Carrito</h1>
          </div>
        </div>
        <div className="cart-container">
          <div className="cart-loading">
            <div className="cart-spinner" />
            <p>Cargando tu carrito...</p>
          </div>
        </div>
      </div>
    );
  }

  // ===== VACÍO =====
  if (isEmpty) {
    return (
      <div className="cart-page">
        <div className="cart-hero">
          <div className="cart-hero-overlay" />
          <div className="cart-hero-content">
            <ShoppingCart size={40} className="cart-hero-icon" />
            <h1>Mi Carrito</h1>
            <p>Tu carrito está vacío</p>
          </div>
        </div>
        <div className="cart-container">
          <div className="cart-empty-state">
            <ShoppingBag size={64} color="#e2e8f0" />
            <h3>Tu carrito está vacío</h3>
            <p>Explora nuestros productos y agrega los que más te gusten.</p>
            <div className="cart-empty-actions">
              <button className="cart-btn cart-btn--primary" onClick={() => navigate("/products")}>
                <ShoppingBag size={18} /> Explorar productos
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== CON PRODUCTOS =====
  return (
    <div className="cart-page">
      {/* Hero */}
      <div className="cart-hero">
        <div className="cart-hero-overlay" />
        <div className="cart-hero-content">
          <ShoppingCart size={40} className="cart-hero-icon" />
          <h1>Mi Carrito</h1>
          <p>{getTotalItems()} producto{getTotalItems() !== 1 ? "s" : ""} en tu carrito</p>
        </div>
      </div>

      <div className="cart-container">
        <div className="cart-layout">

          {/* LISTA DE PRODUCTOS */}
          <div className="cart-items-col">
            <div className="cart-items-header">
              <h2>Productos</h2>
              <button className="cart-clear-btn" onClick={clearCart}>
                <Trash2 size={15} /> Vaciar carrito
              </button>
            </div>

            <div className="cart-items-list">
              {cart.items.map((item) => {
                const product = item.idProduct;
                if (!product || typeof product !== "object") return null;

                const hasDiscount = product.discount?.active && product.discount?.percentage > 0;
                const finalPrice = hasDiscount
                  ? product.basePrice * (1 - product.discount.percentage / 100)
                  : product.basePrice;
                const imageUrl = product.images?.[0] || null;
                const storeName = item.idStore?.storeName || "Sooki";

                return (
                  <div key={item._id || product._id} className="cart-item">
                    {/* Imagen */}
                    <div className="cart-item-img-wrap">
                      {imageUrl
                        ? <img src={imageUrl} alt={product.name} className="cart-item-img" />
                        : <div className="cart-item-img-placeholder"><ShoppingBag size={24} /></div>
                      }
                    </div>

                    {/* Info */}
                    <div className="cart-item-info">
                      <p className="cart-item-name">{product.name}</p>
                      <p className="cart-item-store">{storeName}</p>
                      <div className="cart-item-price-row">
                        <span className="cart-item-price">${finalPrice.toFixed(2)}</span>
                        {hasDiscount && (
                          <span className="cart-item-original">${product.basePrice.toFixed(2)}</span>
                        )}
                      </div>
                    </div>

                    {/* Cantidad */}
                    <div className="cart-item-qty">
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(product._id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="cart-qty-num">{item.quantity}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(product._id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="cart-item-subtotal">
                      <span>${(finalPrice * item.quantity).toFixed(2)}</span>
                    </div>

                    {/* Eliminar */}
                    <button
                      className="cart-item-remove"
                      onClick={() => removeItem(product._id)}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RESUMEN */}
          <div className="cart-summary-col">
            <div className="cart-summary">
              <h3 className="cart-summary-title">Resumen del pedido</h3>

              <div className="cart-summary-rows">
                <div className="cart-summary-row">
                  <span>Productos ({getTotalItems()})</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Envío</span>
                  <span className="cart-summary-free">
                    {getTotalPrice() >= 15 ? "Gratis" : "$5.00"}
                  </span>
                </div>
                {getTotalPrice() < 15 && (
                  <p className="cart-summary-hint">
                    Agrega ${(15 - getTotalPrice()).toFixed(2)} más para envío gratis
                  </p>
                )}
              </div>

              <div className="cart-summary-total">
                <span>Total</span>
                <span>
                  ${(getTotalPrice() + (getTotalPrice() >= 15 ? 0 : 5)).toFixed(2)}
                </span>
              </div>

              <button className="cart-checkout-btn" disabled>
                Proceder al pago <ArrowRight size={17} />
              </button>
              <p className="cart-checkout-note">Próximamente disponible</p>

              <button
                className="cart-continue-btn"
                onClick={() => navigate("/products")}
              >
                Seguir comprando
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;