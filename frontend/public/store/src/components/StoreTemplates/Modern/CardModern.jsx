import React from "react";
import { Heart, ShoppingCart } from "lucide-react";
import "./TemplateModern.css";

const CardModern = ({ product, isFavorite, onToggleFavorite, onAddToCart }) => {
  const { name, images, basePrice, discount } = product;
  const hasDiscount = discount?.active && discount?.percentage > 0;
  const finalPrice = hasDiscount ? basePrice * (1 - discount.percentage / 100) : basePrice;

  return (
    <div className="tmo-card">
      <div className="tmo-card-img-wrap">
        {images?.[0]
          ? <img src={images[0]} alt={name} className="tmo-card-img" />
          : <div className="tmo-card-img-empty"><ShoppingCart size={32} /></div>
        }
        <div className="tmo-card-overlay">
          <button className="tmo-card-overlay-btn" onClick={() => onAddToCart?.(product, 1)}>
            <ShoppingCart size={18} /> Agregar
          </button>
        </div>
        {hasDiscount && <span className="tmo-card-badge">−{discount.percentage}%</span>}
        <button
          className={`tmo-card-fav ${isFavorite ? "active" : ""}`}
          onClick={onToggleFavorite}
        >
          <Heart size={15} fill={isFavorite ? "var(--c1)" : "none"} stroke="var(--c1)" />
        </button>
      </div>
      <div className="tmo-card-info">
        <p className="tmo-card-name">{name}</p>
        <div className="tmo-card-prices">
          <span className="tmo-card-price">${finalPrice.toFixed(2)}</span>
          {hasDiscount && <span className="tmo-card-orig">${basePrice.toFixed(2)}</span>}
        </div>
      </div>
    </div>
  );
};

export default CardModern;