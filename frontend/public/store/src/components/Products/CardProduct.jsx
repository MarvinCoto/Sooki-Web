import React, { useState } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import './CardProduct.css';

const CardProduct = ({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const {
    name = 'Producto',
    images = [],
    basePrice = 0,
    finalPrice,
    discount,
    idStore,
  } = product || {};

  const displayPrice = finalPrice ?? basePrice;
  const hasDiscount = discount?.active && discount?.percentage > 0;
  const rating = 4.6; // TODO: conectar con ratings reales cuando existan

  const imageUrl = images?.[0] || null;

  const handleDecrease = () => setQuantity(q => Math.max(1, q - 1));
  const handleIncrease = () => setQuantity(q => q + 1);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    if (onAddToCart) {
      await onAddToCart(product, quantity);
    }
    setTimeout(() => setIsAddingToCart(false), 600);
  };

  return (
    <div className="card-product">
      {/* Encabezado: rating + favorito */}
      <div className="card-product-top">
        <div className="card-product-rating">
          <Star size={13} fill="#f97316" stroke="none" />
          <span>{rating}</span>
        </div>
        <button
          className={`card-product-fav ${isFavorite ? 'active' : ''}`}
          onClick={() => onToggleFavorite?.(product._id)}
          title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart size={16} fill={isFavorite ? '#f97316' : 'none'} stroke={isFavorite ? '#f97316' : '#f97316'} />
        </button>
      </div>

      {/* Imagen */}
      <div className="card-product-image-wrap">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="card-product-image"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/200x160?text=Sin+imagen'; }}
          />
        ) : (
          <div className="card-product-image-placeholder">
            <ShoppingCart size={32} color="#cbd5e1" />
          </div>
        )}
        {hasDiscount && (
          <span className="card-product-badge">-{discount.percentage}%</span>
        )}
      </div>

      {/* Info */}
      <div className="card-product-info">
        <p className="card-product-name">{name}</p>

        <div className="card-product-price-row">
          <span className="card-product-price">${displayPrice.toFixed(2)}</span>
          {hasDiscount && (
            <span className="card-product-original-price">${basePrice.toFixed(2)}</span>
          )}
        </div>
      </div>

      {/* Controles */}
      <div className="card-product-controls">
        <div className="card-product-qty">
          <button className="card-product-qty-btn" onClick={handleDecrease}>−</button>
          <span className="card-product-qty-value">{quantity}</span>
          <button className="card-product-qty-btn" onClick={handleIncrease}>+</button>
        </div>
        <button
          className={`card-product-cart-btn ${isAddingToCart ? 'adding' : ''}`}
          onClick={handleAddToCart}
          title="Agregar al carrito"
        >
          <ShoppingCart size={17} />
        </button>
      </div>
    </div>
  );
};

export default CardProduct;