import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, User, ArrowLeft, Menu, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import "./TemplateGaming.css";

const NavGaming = ({ store }) => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleProtected = (path) => {
    if (isLoggedIn) navigate(path);
    else navigate("/login");
  };

  return (
    <nav className="tg-nav">
      <div className="tg-nav-inner">
        <Link to="/stores" className="tg-nav-back">
          <ArrowLeft size={14} /> <span>SOOKI</span>
        </Link>

        <div className="tg-nav-logo">
          {store.logo
            ? <img src={store.logo} alt={store.storeName} className="tg-nav-logo-img" />
            : <span className="tg-nav-name">{store.storeName}</span>
          }
        </div>

        <div className="tg-nav-links">
          <a href="#products">PRODUCTOS</a>
          <a href="#about">NOSOTROS</a>
          <a href="#contact">CONTACTO</a>
        </div>

        <div className="tg-nav-actions">
          <button onClick={() => handleProtected("/favorites")}><Heart size={18} /></button>
          <button onClick={() => handleProtected("/cart")}><ShoppingCart size={18} /></button>
          <button onClick={() => handleProtected("/profile")}>
            {isLoggedIn && user?.photo
              ? <img src={user.photo} alt="" className="tg-nav-avatar" />
              : <User size={18} />}
          </button>
          <button className="tg-nav-burger" onClick={() => setOpen(!open)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="tg-nav-mobile">
          <a href="#products" onClick={() => setOpen(false)}>PRODUCTOS</a>
          <a href="#about" onClick={() => setOpen(false)}>NOSOTROS</a>
          <a href="#contact" onClick={() => setOpen(false)}>CONTACTO</a>
        </div>
      )}
    </nav>
  );
};

export default NavGaming;