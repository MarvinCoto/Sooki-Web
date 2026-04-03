import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';
import './CardStore.css';

const CardStore = ({ store }) => {
  const navigate = useNavigate();
  const { storeName, logo, bannerImage, _id } = store || {};

  return (
    <div
      className="card-store"
      onClick={() => navigate(`/stores/${_id}`)}
    >
      {/* Banner */}
      <div className="card-store-banner">
        <img
          src={bannerImage || 'https://res.cloudinary.com/deakzascp/image/upload/v1773532472/landscape1_fkvspy.png'}
          alt={storeName}
          className="card-store-banner-img"
          onError={(e) => { e.target.src = 'https://res.cloudinary.com/deakzascp/image/upload/v1773532472/landscape1_fkvspy.png'; }}
        />
      </div>

      {/* Info */}
      <div className="card-store-info">
        <div className="card-store-left">
          <div className="card-store-logo-wrap">
            {logo ? (
              <img
                src={logo}
                alt={storeName}
                className="card-store-logo"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <Store size={20} color="#fff" />
            )}
          </div>

          <div className="card-store-details">
            <div className="card-store-name-row">
              <span className="card-store-name">{storeName}</span>
              <span className="card-store-separator">•</span>
              <span className="card-store-category">Productos varios</span>
            </div>
            <div className="card-store-rating">
              <span className="card-store-star">★</span>
              <span>4.6</span>
            </div>
          </div>
        </div>

        <button
          className="card-store-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/stores/${_id}`);
          }}
        >
          Explorar <span>⊞</span>
        </button>
      </div>
    </div>
  );
};

export default CardStore;