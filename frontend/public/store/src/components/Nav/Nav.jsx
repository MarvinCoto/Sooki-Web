import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, User, Search } from 'lucide-react';
import './Nav.css';

const Nav = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchValue.trim())}`);
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
              placeholder="Buscar tiendas"
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
            <Link to="/favoritos" className="nav-action-btn" title="Favoritos">
              <Heart size={22} />
            </Link>
            <Link to="/carrito" className="nav-action-btn" title="Carrito">
              <ShoppingCart size={22} />
            </Link>
            <Link to="/perfil" className="nav-action-btn" title="Perfil">
              <User size={22} />
            </Link>
          </div>
        </div>

        {/* Menú de navegación */}
        <nav className="nav-menu">
          <div className="nav-menu-container">
            <Link to="/" className="nav-menu-link">Home</Link>
            <Link to="/productos" className="nav-menu-link">Productos</Link>
            <Link to="/categorias" className="nav-menu-link">Categorías</Link>
            <Link to="/tiendas" className="nav-menu-link">Tiendas</Link>
            <Link to="/acerca-de" className="nav-menu-link">Acerca de</Link>
            <Link to="/contacto" className="nav-menu-link">Contáctanos</Link>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Nav;