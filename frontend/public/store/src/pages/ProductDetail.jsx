import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Heart, ShoppingCart, ArrowLeft, Star, Store,
  Tag, Package, ChevronLeft, ChevronRight, AlertCircle, Loader
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCartContext } from "../context/CartContext";
import useFavorites from "../hooks/Favorites/useFavorites";
import useProductDetail from "../hooks/Products/useProductDetail";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const { addItem } = useCartContext();
  const { isFavorite, toggleFavorite } = useFavorites(isLoggedIn ? user?.id : null);

  const {
    product, variants, related, loading, error,
    getFinalPrice, getUniqueAttributes, findMatchingVariant,
  } = useProductDetail(id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAttrs, setSelectedAttrs] = useState({});
  const [quantity, setQuantity] = useState(1);

  // Reset selección cuando cambia el producto
  useEffect(() => {
    setSelectedImage(0);
    setSelectedAttrs({});
    setQuantity(1);
  }, [id]);

  // Variante actualmente seleccionada
  const uniqueAttributes = product ? getUniqueAttributes() : [];
  const allAttrsSelected = uniqueAttributes.length > 0 &&
    Object.keys(selectedAttrs).length === uniqueAttributes.length;
  const matchingVariant = allAttrsSelected ? findMatchingVariant(selectedAttrs) : null;
  const activeVariant = matchingVariant || (variants.length === 1 ? variants[0] : null);

  const currentPrice = activeVariant
    ? getFinalPrice(activeVariant.price)
    : null;
  const originalPrice = activeVariant?.price || null;
  const hasDiscount = product?.discount?.active && product?.discount?.percentage > 0;
  const inStock = activeVariant ? activeVariant.stock > 0 : false;
  const stockCount = activeVariant?.stock || 0;

  // Handlers
  const handleAttrSelect = (attrId, valueId) => {
    setSelectedAttrs((prev) => ({ ...prev, [attrId]: valueId }));
    setQuantity(1);
  };

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) { toast.error("Inicia sesión para guardar favoritos"); navigate("/login"); return; }
    try {
      const wasFav = isFavorite(product._id);
      await toggleFavorite(product._id);
      toast.success(wasFav ? "Eliminado de favoritos" : "Agregado a favoritos");
    } catch { toast.error("Error al actualizar favoritos"); }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) { toast.error("Inicia sesión para agregar al carrito"); navigate("/login"); return; }
    if (uniqueAttributes.length > 0 && !allAttrsSelected) {
      toast.error("Selecciona todas las opciones del producto"); return;
    }
    if (!inStock) { toast.error("Producto sin stock disponible"); return; }
    await addItem({
      ...product,
      idStore: product.idStore?._id || product.idStore,
      selectedVariant: activeVariant,
    }, quantity);
  };

  const prevImage = () => setSelectedImage((i) => (i === 0 ? (product.images.length - 1) : i - 1));
  const nextImage = () => setSelectedImage((i) => (i === product.images.length - 1 ? 0 : i + 1));

  // ── LOADING ──
  if (loading) return (
    <div className="pd-loading">
      <Loader size={36} className="pd-spinner" />
      <p>Cargando producto...</p>
    </div>
  );

  // ── ERROR ──
  if (error) return (
    <div className="pd-error">
      <AlertCircle size={48} color="#ef4444" />
      <h2>{error}</h2>
      <button className="pd-btn pd-btn--primary" onClick={() => navigate("/products")}>
        Ver productos
      </button>
    </div>
  );

  if (!product) return null;

  const images = product.images?.length > 0 ? product.images : [];
  const storeName = product.idStore?.storeName || "Sooki";
  const storeId = product.idStore?._id || product.idStore;
  const categoryName = product.idCategory?.name || "";

  return (
    <div className="pd-page">
      {/* Breadcrumb */}
      <div className="pd-breadcrumb">
        <div className="pd-breadcrumb-inner">
          <button className="pd-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Volver
          </button>
          <div className="pd-breadcrumb-path">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/products">Productos</Link>
            {categoryName && <><span>/</span><span>{categoryName}</span></>}
            <span>/</span>
            <span className="pd-breadcrumb-current">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="pd-container">
        <div className="pd-main">

          {/* ── GALERÍA ── */}
          <div className="pd-gallery">
            <div className="pd-gallery-main">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="pd-gallery-img"
                  />
                  {images.length > 1 && (
                    <>
                      <button className="pd-gallery-nav pd-gallery-nav--prev" onClick={prevImage}>
                        <ChevronLeft size={20} />
                      </button>
                      <button className="pd-gallery-nav pd-gallery-nav--next" onClick={nextImage}>
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                  {hasDiscount && (
                    <span className="pd-gallery-badge">
                      -{product.discount.percentage}%
                    </span>
                  )}
                </>
              ) : (
                <div className="pd-gallery-placeholder">
                  <Package size={64} color="#cbd5e1" />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="pd-thumbnails">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`pd-thumb ${i === selectedImage ? "active" : ""}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── INFO ── */}
          <div className="pd-info">
            {/* Tienda y categoría */}
            <div className="pd-meta">
              {storeId && (
                <Link to={`/stores/${storeId}`} className="pd-store-link">
                  {product.idStore?.logo && (
                    <img src={product.idStore.logo} alt={storeName} className="pd-store-logo" />
                  )}
                  <Store size={14} />
                  <span>{storeName}</span>
                </Link>
              )}
              {categoryName && (
                <span className="pd-category">
                  <Tag size={13} /> {categoryName}
                </span>
              )}
            </div>

            {/* Nombre */}
            <h1 className="pd-name">{product.name}</h1>

            {/* Rating placeholder */}
            <div className="pd-rating">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={16} fill="#FFB800" stroke="#FFB800" />
              ))}
              <span className="pd-rating-text">Sin reseñas aún</span>
            </div>

            {/* Precio */}
            <div className="pd-price-wrap">
              {currentPrice !== null ? (
                <>
                  <span className="pd-price">${currentPrice.toFixed(2)}</span>
                  {hasDiscount && originalPrice && currentPrice !== originalPrice && (
                    <span className="pd-price-original">${originalPrice.toFixed(2)}</span>
                  )}
                  {hasDiscount && (
                    <span className="pd-discount-badge">-{product.discount.percentage}%</span>
                  )}
                </>
              ) : (
                <span className="pd-price-placeholder">
                  {uniqueAttributes.length > 0 ? "Selecciona opciones" : "Sin precio"}
                </span>
              )}
            </div>

            {/* Descripción */}
            {product.description && (
              <p className="pd-description">{product.description}</p>
            )}

            {/* Atributos */}
            {uniqueAttributes.length > 0 && (
              <div className="pd-attributes">
                {uniqueAttributes.map((attr) => (
                  <div key={attr.id} className="pd-attr-group">
                    <p className="pd-attr-label">{attr.name}</p>
                    <div className="pd-attr-values">
                      {attr.values.map((val) => (
                        <button
                          key={val.id}
                          className={`pd-attr-btn ${selectedAttrs[attr.id] === val.id ? "active" : ""}`}
                          onClick={() => handleAttrSelect(attr.id, val.id)}
                        >
                          {val.value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stock */}
            {activeVariant && (
              <div className={`pd-stock ${inStock ? "in-stock" : "out-stock"}`}>
                <Package size={14} />
                {inStock ? `${stockCount} unidades disponibles` : "Sin stock disponible"}
              </div>
            )}

            {/* Cantidad */}
            {inStock && (
              <div className="pd-qty-wrap">
                <span className="pd-qty-label">Cantidad</span>
                <div className="pd-qty">
                  <button
                    className="pd-qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >−</button>
                  <span className="pd-qty-num">{quantity}</span>
                  <button
                    className="pd-qty-btn"
                    onClick={() => setQuantity((q) => Math.min(stockCount, q + 1))}
                    disabled={quantity >= stockCount}
                  >+</button>
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="pd-actions">
              <button
                className={`pd-add-cart ${(!inStock || (uniqueAttributes.length > 0 && !allAttrsSelected)) ? "disabled" : ""}`}
                onClick={handleAddToCart}
                disabled={!inStock || (uniqueAttributes.length > 0 && !allAttrsSelected)}
              >
                <ShoppingCart size={20} />
                {!inStock ? "Sin stock" :
                  (uniqueAttributes.length > 0 && !allAttrsSelected) ? "Selecciona opciones" :
                  "Añadir al carrito"}
              </button>
              <button
                className={`pd-fav-btn ${isFavorite(product._id) ? "active" : ""}`}
                onClick={handleToggleFavorite}
                title={isFavorite(product._id) ? "Quitar de favoritos" : "Agregar a favoritos"}
              >
                <Heart size={20} fill={isFavorite(product._id) ? "#FF8C42" : "none"} stroke="#FF8C42" />
              </button>
            </div>

            {/* Info tienda */}
            {storeId && (
              <Link to={`/stores/${storeId}`} className="pd-store-card">
                {product.idStore?.logo && (
                  <img src={product.idStore.logo} alt={storeName} className="pd-store-card-logo" />
                )}
                <div className="pd-store-card-info">
                  <span className="pd-store-card-label">Vendido por</span>
                  <span className="pd-store-card-name">{storeName}</span>
                </div>
                <span className="pd-store-card-arrow">→</span>
              </Link>
            )}
          </div>
        </div>

        {/* ── RESEÑAS (placeholder) ── */}
        <div className="pd-reviews">
          <h2 className="pd-section-title">Reseñas y valoraciones</h2>
          <div className="pd-reviews-empty">
            <div className="pd-reviews-stars">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={28} fill="#e2e8f0" stroke="#e2e8f0" />
              ))}
            </div>
            <p>Aún no hay reseñas para este producto.</p>
            <span>Las reseñas estarán disponibles próximamente para clientes que hayan realizado una compra.</span>
          </div>
        </div>

        {/* ── PRODUCTOS RELACIONADOS ── */}
        {related.length > 0 && (
          <div className="pd-related">
            <div className="pd-related-header">
              <h2 className="pd-section-title">Más productos de {storeName}</h2>
              {storeId && (
                <Link to={`/stores/${storeId}`} className="pd-related-ver-todo">
                  Ver tienda →
                </Link>
              )}
            </div>
            <div className="pd-related-grid">
              {related.map((p) => {
                const relImg = p.images?.[0] || null;
                const relPrice = p.minPrice ?? p.basePrice;
                const relFinal = p.discount?.active
                  ? relPrice * (1 - p.discount.percentage / 100)
                  : relPrice;
                return (
                  <Link key={p._id} to={`/products/${p._id}`} className="pd-related-card">
                    <div className="pd-related-img-wrap">
                      {relImg
                        ? <img src={relImg} alt={p.name} className="pd-related-img" />
                        : <div className="pd-related-img-placeholder"><Package size={24} /></div>
                      }
                    </div>
                    <div className="pd-related-info">
                      <p className="pd-related-name">{p.name}</p>
                      {relFinal && (
                        <span className="pd-related-price">${relFinal.toFixed(2)}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;