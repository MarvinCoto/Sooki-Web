import React from "react";
import { Heart, Plus } from "lucide-react";
import "./TemplateFood.css";

const CardFood = ({ product, isFavorite, onToggleFavorite, onAddToCart }) => {
  const { name, images, basePrice, discount, description } = product;
  const hasDiscount = discount?.active && discount?.percentage > 0;
  const finalPrice = hasDiscount ? basePrice * (1 - discount.percentage / 100) : basePrice;

  return (
    <div className="tc-card">
      <div className="tc-card-img-wrap">
        {images?.[0]
          ? <img src={images[0]} alt={name} className="tc-card-img" />
          : (
            <div className="tc-card-img-empty">
              <span>🍽️</span>
            </div>
          )
        }
        {hasDiscount && (
          <span className="tc-card-badge">−{discount.percentage}%</span>
        )}
        <button
          className={`tc-card-fav ${isFavorite ? "active" : ""}`}
          onClick={onToggleFavorite}
        >
          <Heart size={14} fill={isFavorite ? "var(--c1)" : "none"} stroke="var(--c1)" />
        </button>
      </div>

      <div className="tc-card-body">
        <h3 className="tc-card-name">{name}</h3>
        {description && (
          <p className="tc-card-desc">{description}</p>
        )}
        <div className="tc-card-footer">
          <div className="tc-card-prices">
            <span className="tc-card-price">${finalPrice.toFixed(2)}</span>
            {hasDiscount && (
              <span className="tc-card-orig">${basePrice.toFixed(2)}</span>
            )}
          </div>
          <button
            className="tc-card-add"
            onClick={() => onAddToCart?.(product, 1)}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardFood;