import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, User, ArrowLeft } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import "./TemplateFashion.css";

const NavFashion = ({ store }) => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const hp = (path) => { if (isLoggedIn) navigate(path); else navigate("/login"); };

  return (
    <nav className={`tf-nav ${scrolled ? "tf-nav--scrolled" : ""}`}>
      <div className="tf-nav-inner">
        <Link to="/stores" className="tf-nav-back"><ArrowLeft size={14} /> Sooki</Link>
        <div className="tf-nav-center">
          {store.logo
            ? <img src={store.logo} alt={store.storeName} className="tf-nav-logo" />
            : <span className="tf-nav-name">{store.storeName}</span>
          }
        </div>
        <div className="tf-nav-right">
          <div className="tf-nav-links">
            <a href="#products">Colección</a>
            <a href="#about">Historia</a>
            <a href="#contact">Contacto</a>
          </div>
          <div className="tf-nav-icons">
            <button onClick={() => hp("/favorites")}><Heart size={18} /></button>
            <button onClick={() => hp("/cart")}><ShoppingCart size={18} /></button>
            <button onClick={() => hp("/profile")}>
              {isLoggedIn && user?.photo
                ? <img src={user.photo} alt="" className="tf-nav-avatar" />
                : <User size={18} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavFashion;