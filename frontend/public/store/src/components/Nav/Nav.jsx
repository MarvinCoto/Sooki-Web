import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, User, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCartContext } from '../../context/CartContext';
import './Nav.css';

const Nav = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const { getTotalItems } = useCartContext();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleProtectedClick = (path) => {
    if (isLoggedIn) navigate(path);
    else navigate('/login');
  };

  const cartCount = getTotalItems();

  return (
    <>
      <div className="nav-top-banner">
        <span>Envío gratis en compras desde 15 dólares</span>
      </div>

      <header className="nav-header">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <img
              src="https://res.cloudinary.com/deakzascp/image/upload/v1773512477/LogoSooki_es8i5j.png"
              alt="Sooki"
              className="nav-logo-img"
            />
          </Link>

          <div className="nav-spacer" />

          <form className="nav-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar productos"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="nav-search-input"
            />
            <button type="submit" className="nav-search-btn">
              <Search size={18} />
            </button>
          </form>

          <div className="nav-spacer" />

          <div className="nav-actions">
            <button className="nav-action-btn" title="Favoritos" onClick={() => handleProtectedClick('/favorites')}>
              <Heart size={22} />
            </button>

            <button className="nav-action-btn nav-cart-btn" title="Carrito" onClick={() => handleProtectedClick('/cart')}>
              <ShoppingCart size={22} />
              {isLoggedIn && cartCount > 0 && (
                <span className="nav-cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </button>

            <button className="nav-action-btn" title={isLoggedIn ? user?.name : 'Iniciar sesión'} onClick={() => handleProtectedClick('/profile')}>
              {isLoggedIn && user?.photo ? (
                <img src={user.photo} alt="Perfil" className="nav-avatar" onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                <User size={22} />
              )}
            </button>
          </div>
        </div>

        <nav className="nav-menu">
          <div className="nav-menu-container">
            <Link to="/" className="nav-menu-link">Home</Link>
            <Link to="/products" className="nav-menu-link">Productos</Link>
            <Link to="/categories" className="nav-menu-link">Categorías</Link>
            <Link to="/stores" className="nav-menu-link">Tiendas</Link>
            <Link to="/aboutUs" className="nav-menu-link">Acerca de</Link>
            <Link to="/contactUs" className="nav-menu-link">Contáctanos</Link>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Nav;