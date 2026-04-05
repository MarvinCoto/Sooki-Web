import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import useFavorites from "../../../hooks/Favorites/useFavorites";
import { toast } from "react-hot-toast";
import NavModern from "./NavModern";
import CardModern from "./CardModern";
import Footer from "../../Footer/Footer";
import "./TemplateModern.css";

const TemplateModern = ({ store, products }) => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites(isLoggedIn ? user?.id : null);

  const [c1, c2, c3] = store.colors;

  const handleToggleFavorite = async (productId) => {
    if (!isLoggedIn) {
      toast.error("Debes iniciar sesión para agregar favoritos");
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
    <div className="tmo-root" style={{ "--c1": c1, "--c2": c2, "--c3": c3 }}>
      <NavModern store={store} />

      {/* HERO */}
      <section className="tmo-hero">
        <div className="tmo-hero-bg" />
        <div className="tmo-hero-content">
          <div className="tmo-hero-text">
            <div className="tmo-hero-line" />
            <h1>{store.storeName}</h1>
            <p>{store.location || "Tu destino de compras"}</p>
            <a href="#products" className="tmo-hero-btn">Explorar →</a>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="tmo-stats">
        <div className="tmo-stats-inner">
          <div className="tmo-stat">
            <span className="tmo-stat-num">{products.length}</span>
            <span className="tmo-stat-label">Productos</span>
          </div>
          <div className="tmo-stat-divider" />
          <div className="tmo-stat">
            <span className="tmo-stat-num">100%</span>
            <span className="tmo-stat-label">Autenticidad</span>
          </div>
          <div className="tmo-stat-divider" />
          <div className="tmo-stat">
            <span className="tmo-stat-num">24h</span>
            <span className="tmo-stat-label">Respuesta</span>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      {(store.about?.description || store.about?.mission || store.about?.vision) && (
        <section className="tmo-about" id="about">
          <div className="tmo-about-inner">
            <div className="tmo-about-left">
              <span className="tmo-label">Sobre nosotros</span>
              {store.about.description && <p className="tmo-about-desc">{store.about.description}</p>}
              <div className="tmo-about-cards">
                {store.about.mission && (
                  <div className="tmo-about-card">
                    <h4>Misión</h4>
                    <p>{store.about.mission}</p>
                  </div>
                )}
                {store.about.vision && (
                  <div className="tmo-about-card">
                    <h4>Visión</h4>
                    <p>{store.about.vision}</p>
                  </div>
                )}
              </div>
            </div>
            {store.about.images?.length > 0 && (
              <div className="tmo-about-right">
                {store.about.images.slice(0, 3).map((img, i) => (
                  <div key={i} className={`tmo-about-img tmo-about-img--${i}`}>
                    <img src={img} alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* PRODUCTS */}
      <section className="tmo-products" id="products">
        <div className="tmo-products-inner">
          <div className="tmo-products-header">
            <span className="tmo-label">Catálogo</span>
            <h2>Nuestros productos</h2>
          </div>
          {products.length === 0 ? (
            <p className="tmo-empty">Esta tienda aún no tiene productos.</p>
          ) : (
            <div className="tmo-grid">
              {products.map((p) => (
                <CardModern
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
      <section className="tmo-contact" id="contact">
        <div className="tmo-contact-inner">
          <span className="tmo-label tmo-label--light">Contacto</span>
          <h2>¿Tienes preguntas?</h2>
          <div className="tmo-contact-items">
            {store.email && (
              <a href={`mailto:${store.email}`} className="tmo-contact-chip">
                ✉ {store.email}
              </a>
            )}
            {store.location && (
              <span className="tmo-contact-chip">📍 {store.location}</span>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TemplateModern;