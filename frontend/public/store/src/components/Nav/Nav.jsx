import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, User, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Nav.css';

const Nav = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleProtectedClick = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      {/* Banner superior */}
      <div className="nav-top-banner">
        <span>Envío gratis en compras desde 15 dólares</span>
      </div>

      <header className="nav-header">
        <div className="nav-container">

          {/* Logo */}
          <Link to="/" className="nav-logo">
            <img
              src="https://res.cloudinary.com/deakzascp/image/upload/v1773512477/LogoSooki_es8i5j.png"
              alt="Sooki"
              className="nav-logo-img"
            />
          </Link>

          {/* Espaciador izquierdo */}
          <div className="nav-spacer" />

          {/* Buscador */}
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

          {/* Espaciador derecho */}
          <div className="nav-spacer" />

          {/* Íconos de acción */}
          <div className="nav-actions">
            <button
              className="nav-action-btn"
              title="Favoritos"
              onClick={() => handleProtectedClick('/favorites')}
            >
              <Heart size={22} />
            </button>

            <button
              className="nav-action-btn"
              title="Carrito"
              onClick={() => handleProtectedClick('/cart')}
            >
              <ShoppingCart size={22} />
            </button>

            <button
              className="nav-action-btn"
              title={isLoggedIn ? `${user?.name} ${user?.lastname}` : 'Iniciar sesión'}
              onClick={() => handleProtectedClick('/profile')}
            >
              {isLoggedIn && user?.photo ? (
                <img
                  src={user.photo}
                  alt="Perfil"
                  className="nav-avatar"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <User size={22} />
              )}
            </button>
          </div>
        </div>

        {/* Menú de navegación */}
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