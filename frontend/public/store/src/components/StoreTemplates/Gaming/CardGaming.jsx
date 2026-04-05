import React from "react";
import { Heart, ShoppingCart, Zap } from "lucide-react";
import "./TemplateGaming.css";

const CardGaming = ({ product, isFavorite, onToggleFavorite, onAddToCart }) => {
  const { name, images, basePrice, discount } = product;
  const hasDiscount = discount?.active && discount?.percentage > 0;
  const finalPrice = hasDiscount ? basePrice * (1 - discount.percentage / 100) : basePrice;

  return (
    <div className="tg-card">
      <div className="tg-card-corner tg-card-corner--tl" />
      <div className="tg-card-corner tg-card-corner--br" />

      <div className="tg-card-img-wrap">
        {images?.[0]
          ? <img src={images[0]} alt={name} className="tg-card-img" />
          : <div className="tg-card-img-empty"><ShoppingCart size={28} /></div>
        }
        {hasDiscount && <span className="tg-card-badge">−{discount.percentage}%</span>}
        <button
          className={`tg-card-fav ${isFavorite ? "active" : ""}`}
          onClick={onToggleFavorite}
        >
          <Heart size={14} fill={isFavorite ? "var(--c1)" : "none"} stroke="var(--c1)" />
        </button>
      </div>

      <div className="tg-card-body">
        <p className="tg-card-name">{name}</p>
        <div className="tg-card-bottom">
          <div className="tg-card-prices">
            <span className="tg-card-price">${finalPrice.toFixed(2)}</span>
            {hasDiscount && <span className="tg-card-orig">${basePrice.toFixed(2)}</span>}
          </div>
          <button className="tg-card-btn" onClick={() => onAddToCart?.(product, 1)}>
            <Zap size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardGaming;