import React from "react";
import { Heart } from "lucide-react";
import "./TemplateFashion.css";

const CardFashion = ({ product, isFavorite, onToggleFavorite, onAddToCart }) => {
  const { name, images, basePrice, discount } = product;
  const hasDiscount = discount?.active && discount?.percentage > 0;
  const finalPrice = hasDiscount ? basePrice * (1 - discount.percentage / 100) : basePrice;

  return (
    <div className="tf-card">
      <div className="tf-card-img-wrap">
        {images?.[0]
          ? <img src={images[0]} alt={name} className="tf-card-img" />
          : <div className="tf-card-img-empty"><span>{name?.charAt(0)}</span></div>
        }
        {hasDiscount && <span className="tf-card-badge">−{discount.percentage}%</span>}
        <button
          className={`tf-card-fav ${isFavorite ? "active" : ""}`}
          onClick={onToggleFavorite}
        >
          <Heart size={14} fill={isFavorite ? "var(--c1)" : "none"} stroke="var(--c1)" />
        </button>
        <div className="tf-card-hover">
          <button className="tf-card-add" onClick={() => onAddToCart?.(product, 1)}>
            Agregar al carrito
          </button>
        </div>
      </div>
      <div className="tf-card-info">
        <p className="tf-card-name">{name}</p>
        <div className="tf-card-prices">
          <span className="tf-card-price">${finalPrice.toFixed(2)}</span>
          {hasDiscount && <span className="tf-card-orig">${basePrice.toFixed(2)}</span>}
        </div>
      </div>
    </div>
  );
};

export default CardFashion;