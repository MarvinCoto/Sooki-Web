import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, User, ArrowLeft, Menu, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import "./TemplateFood.css";

const NavFood = ({ store }) => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const hp = (path) => { if (isLoggedIn) navigate(path); else navigate("/login"); };

  return (
    <nav className={`tc-nav ${scrolled ? "tc-nav--scrolled" : ""}`}>
      <div className="tc-nav-inner">
        <Link to="/stores" className="tc-nav-back">
          <ArrowLeft size={14} /> Sooki
        </Link>

        <div className="tc-nav-logo">
          {store.logo
            ? <img src={store.logo} alt={store.storeName} className="tc-nav-logo-img" />
            : <span className="tc-nav-name">{store.storeName}</span>
          }
        </div>

        <div className="tc-nav-links">
          <a href="#products">Menú</a>
          <a href="#about">Nosotros</a>
          <a href="#contact">Contacto</a>
        </div>

        <div className="tc-nav-actions">
          <button onClick={() => hp("/favorites")}><Heart size={19} /></button>
          <button onClick={() => hp("/cart")}><ShoppingCart size={19} /></button>
          <button onClick={() => hp("/profile")}>
            {isLoggedIn && user?.photo
              ? <img src={user.photo} alt="" className="tc-nav-avatar" />
              : <User size={19} />}
          </button>
          <button className="tc-nav-burger" onClick={() => setOpen(!open)}>
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="tc-nav-mobile">
          <a href="#products" onClick={() => setOpen(false)}>Menú</a>
          <a href="#about" onClick={() => setOpen(false)}>Nosotros</a>
          <a href="#contact" onClick={() => setOpen(false)}>Contacto</a>
        </div>
      )}
    </nav>
  );
};

export default NavFood;