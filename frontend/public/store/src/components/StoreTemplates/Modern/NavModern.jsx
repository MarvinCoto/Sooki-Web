import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, User, ArrowLeft } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import "./TemplateModern.css";

const NavModern = ({ store }) => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleProtected = (path) => {
    if (isLoggedIn) navigate(path);
    else navigate("/login");
  };

  return (
    <nav className={`tmo-nav ${scrolled ? "tmo-nav--solid" : ""}`}>
      <div className="tmo-nav-inner">

        {/* Volver */}
        <Link to="/stores" className="tmo-nav-back">
          <ArrowLeft size={14} /> Sooki
        </Link>

        {/* Logo */}
        <div className="tmo-nav-center">
          {store.logo
            ? <img src={store.logo} alt={store.storeName} className="tmo-nav-logo" />
            : <span className="tmo-nav-name">{store.storeName}</span>
          }
        </div>

        {/* Links + Acciones juntos */}
        <div className="tmo-nav-right">
          <div className="tmo-nav-links">
            <a href="#products">Productos</a>
            <a href="#about">Nosotros</a>
            <a href="#contact">Contacto</a>
          </div>
          <div className="tmo-nav-actions">
            <button onClick={() => handleProtected("/favorites")}><Heart size={19} /></button>
            <button onClick={() => handleProtected("/cart")}><ShoppingCart size={19} /></button>
            <button onClick={() => handleProtected("/profile")}>
              {isLoggedIn && user?.photo
                ? <img src={user.photo} alt="" className="tmo-nav-avatar" />
                : <User size={19} />
              }
            </button>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default NavModern;