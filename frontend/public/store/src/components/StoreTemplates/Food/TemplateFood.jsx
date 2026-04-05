import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import useFavorites from "../../../hooks/Favorites/useFavorites";
import { toast } from "react-hot-toast";
import NavFood from "./NavFood";
import CardFood from "./CardFood";
import Footer from "../../Footer/Footer";
import "./TemplateFood.css";

const TemplateFood = ({ store, products }) => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites(isLoggedIn ? user?.id : null);

  const [c1, c2, c3] = store.colors;

  const handleToggleFavorite = async (productId) => {
    if (!isLoggedIn) {
      toast.error("Inicia sesión para guardar favoritos");
      navigate("/login");
      return;
    }
    try {
      const wasFav = isFavorite(productId);
      await toggleFavorite(productId);
      toast.success(wasFav ? "Eliminado de favoritos" : "Agregado a favoritos");
    } catch {
      toast.error("Error al actualizar favoritos");
    }
  };

  return (
    <div className="tc-root" style={{ "--c1": c1, "--c2": c2, "--c3": c3 }}>
      <NavFood store={store} />

      {/* HERO */}
      <section className="tc-hero">
        <div className="tc-hero-blob tc-hero-blob--1" />
        <div className="tc-hero-blob tc-hero-blob--2" />
        <div className="tc-hero-inner">
          <div className="tc-hero-badge">🍽️ Bienvenido</div>
          <h1 className="tc-hero-title">{store.storeName}</h1>
          {store.location && (
            <div className="tc-hero-location">
              <span>📍</span> {store.location}
            </div>
          )}
          <div className="tc-hero-actions">
            <a href="#products" className="tc-btn tc-btn--primary">Ver menú</a>
            <a href="#about" className="tc-btn tc-btn--ghost">Nuestra historia</a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <div className="tc-features">
        <div className="tc-features-inner">
          <div className="tc-feature">
            <span className="tc-feature-icon">🌿</span>
            <span>Ingredientes frescos</span>
          </div>
          <div className="tc-feature-dot" />
          <div className="tc-feature">
            <span className="tc-feature-icon">❤️</span>
            <span>Hecho con amor</span>
          </div>
          <div className="tc-feature-dot" />
          <div className="tc-feature">
            <span className="tc-feature-icon">⚡</span>
            <span>Entrega rápida</span>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      {(store.about?.description || store.about?.mission || store.about?.vision) && (
        <section className="tc-about" id="about">
          <div className="tc-about-inner">
            <div className="tc-about-text">
              <span className="tc-label">Nuestra historia</span>
              <h2>Sobre nosotros</h2>
              {store.about.description && (
                <p className="tc-about-desc">{store.about.description}</p>
              )}
              <div className="tc-about-cards">
                {store.about.mission && (
                  <div className="tc-about-card">
                    <span className="tc-about-card-icon">🎯</span>
                    <h4>Misión</h4>
                    <p>{store.about.mission}</p>
                  </div>
                )}
                {store.about.vision && (
                  <div className="tc-about-card">
                    <span className="tc-about-card-icon">✨</span>
                    <h4>Visión</h4>
                    <p>{store.about.vision}</p>
                  </div>
                )}
              </div>
            </div>
            {store.about.images?.length > 0 && (
              <div className="tc-about-images">
                {store.about.images.slice(0, 3).map((img, i) => (
                  <div key={i} className={`tc-about-img tc-about-img--${i}`}>
                    <img src={img} alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* PRODUCTS */}
      <section className="tc-products" id="products">
        <div className="tc-products-inner">
          <div className="tc-products-header">
            <span className="tc-label">Lo que ofrecemos</span>
            <h2>Nuestro menú</h2>
            <p className="tc-products-sub">{products.length} productos disponibles hoy</p>
          </div>
          {products.length === 0 ? (
            <div className="tc-empty">
              <span>🍽️</span>
              <p>No hay productos disponibles en este momento.</p>
            </div>
          ) : (
            <div className="tc-grid">
              {products.map((p) => (
                <CardFood
                  key={p._id}
                  product={p}
                  isFavorite={isFavorite(p._id)}
                  onToggleFavorite={() => handleToggleFavorite(p._id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section className="tc-contact" id="contact">
        <div className="tc-contact-inner">
          <span className="tc-label">Visítanos</span>
          <h2>¿Dónde encontrarnos?</h2>
          <div className="tc-contact-cards">
            {store.email && (
              <a href={`mailto:${store.email}`} className="tc-contact-card">
                <span className="tc-contact-icon">✉️</span>
                <div>
                  <span className="tc-contact-title">Correo</span>
                  <span className="tc-contact-val">{store.email}</span>
                </div>
              </a>
            )}
            {store.location && (
              <div className="tc-contact-card">
                <span className="tc-contact-icon">📍</span>
                <div>
                  <span className="tc-contact-title">Ubicación</span>
                  <span className="tc-contact-val">{store.location}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TemplateFood;