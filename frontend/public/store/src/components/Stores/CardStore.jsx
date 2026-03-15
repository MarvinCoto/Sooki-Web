import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CardStore.css';

const CardStore = ({ store }) => {
  const navigate = useNavigate();

  const { storeName = 'Tienda', logo, _id } = store || {};

  const handleClick = () => {
    if (_id) navigate(`/tiendas/${_id}`);
  };

  return (
    <div className="card-store" onClick={handleClick} title={storeName}>
      {logo ? (
        <img
          src={logo}
          alt={storeName}
          className="card-store-logo"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div
        className="card-store-fallback"
        style={{ display: logo ? 'none' : 'flex' }}
      >
        <span>{storeName.charAt(0).toUpperCase()}</span>
      </div>
    </div>
  );
};

export default CardStore;