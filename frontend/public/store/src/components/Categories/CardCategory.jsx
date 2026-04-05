import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './CardCategory.css';

const CardCategory = ({ category }) => {
  const navigate = useNavigate();
  const { _id, name, image } = category || {};

  return (
    <div
      className="card-category"
      onClick={() => navigate(`/productos?categoria=${_id}`)}
    >
      <div className="card-category-top">
        <span className="card-category-name">{name}</span>
      </div>
      <div className="card-category-bottom">
        <ChevronRight size={18} className="card-category-arrow" />
        {image ? (
    <img
      src={image}
      alt={name}
      className="card-category-img"
      onError={(e) => { e.target.src = 'https://res.cloudinary.com/deakzascp/image/upload/v1773539441/categorieSooki_r6ntvl.png'; }}
    />
    ) : (
    <img
      src="https://res.cloudinary.com/deakzascp/image/upload/v1773539441/categorieSooki_r6ntvl.png"
      alt={name}
      className="card-category-img"
    />
)}
      </div>
    </div>
  );
};

export default CardCategory;