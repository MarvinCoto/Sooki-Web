import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, User, ArrowLeft, Menu, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import "./TemplateMinimalist.css";

const NavMinimalist = ({ store }) => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleProtected = (path) => {
    if (isLoggedIn) navigate(path);
    else navigate("/login");
  };

  return (
    <nav className={`tm-nav ${scrolled ? "tm-nav--scrolled" : ""}`}>
      <div className="tm-nav-inner">
        {/* Volver */}
        <Link to="/stores" className="tm-nav-back">
          <ArrowLeft size={15} />
          <span>Sooki</span>
        </Link>

        {/* Logo */}
        <div className="tm-nav-logo">
          {store.logo ? (
            <img src={store.logo} alt={store.storeName} className="tm-nav-logo-img" />
          ) : (
            <span className="tm-nav-logo-text">{store.storeName}</span>
          )}
        </div>

        {/* Links desktop */}
        <div className="tm-nav-links">
          <a href="#products">Productos</a>
          <a href="#about">Nosotros</a>
          <a href="#contact">Contacto</a>
        </div>

        {/* Acciones */}
        <div className="tm-nav-actions">
          <button onClick={() => handleProtected("/favorites")} title="Favoritos">
            <Heart size={20} />
          </button>
          <button onClick={() => handleProtected("/cart")} title="Carrito">
            <ShoppingCart size={20} />
          </button>
          <button onClick={() => handleProtected("/profile")} title="Perfil">
            {isLoggedIn && user?.photo
              ? <img src={user.photo} alt="perfil" className="tm-nav-avatar" />
              : <User size={20} />
            }
          </button>
          <button className="tm-nav-burger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Menú mobile */}
      {menuOpen && (
        <div className="tm-nav-mobile">
          <a href="#products" onClick={() => setMenuOpen(false)}>Productos</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>Nosotros</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contacto</a>
        </div>
      )}
    </nav>
  );
};

export default NavMinimalist;