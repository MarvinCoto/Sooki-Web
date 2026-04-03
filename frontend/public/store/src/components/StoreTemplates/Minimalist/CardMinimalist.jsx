import React from "react";
import { Heart, ShoppingCart } from "lucide-react";
import "./TemplateMinimalist.css";

const CardMinimalist = ({ product, isFavorite, onToggleFavorite, onAddToCart }) => {
  const { name, images, basePrice, discount } = product;
  const hasDiscount = discount?.active && discount?.percentage > 0;
  const finalPrice = hasDiscount ? basePrice * (1 - discount.percentage / 100) : basePrice;
  const imageUrl = images?.[0] || null;

  return (
    <div className="tm-card">
      <div className="tm-card-img-wrap">
        {imageUrl
          ? <img src={imageUrl} alt={name} className="tm-card-img" />
          : <div className="tm-card-img-placeholder"><ShoppingCart size={28} /></div>
        }
        {hasDiscount && (
          <span className="tm-card-badge">−{discount.percentage}%</span>
        )}
        <button
          className={`tm-card-fav ${isFavorite ? "active" : ""}`}
          onClick={onToggleFavorite}
          title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <Heart size={16} fill={isFavorite ? "var(--c1)" : "none"} stroke="var(--c1)" />
        </button>
      </div>

      <div className="tm-card-body">
        <p className="tm-card-name">{name}</p>
        <div className="tm-card-price-row">
          <span className="tm-card-price">${finalPrice.toFixed(2)}</span>
          {hasDiscount && (
            <span className="tm-card-original">${basePrice.toFixed(2)}</span>
          )}
        </div>
        <button
          className="tm-card-cart"
          onClick={() => onAddToCart?.(product, 1)}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default CardMinimalist;