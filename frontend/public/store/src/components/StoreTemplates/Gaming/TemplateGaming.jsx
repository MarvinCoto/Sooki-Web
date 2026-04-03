import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import useFavorites from "../../../hooks/Favorites/useFavorites";
import { toast } from "react-hot-toast";
import NavGaming from "./NavGaming";
import CardGaming from "./CardGaming";
import Footer from "../../Footer/Footer";
import "./TemplateGaming.css";

const TemplateGaming = ({ store, products }) => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites(isLoggedIn ? user?.id : null);

  const [c1, c2, c3] = store.colors;

  const handleToggleFavorite = async (productId) => {
    if (!isLoggedIn) {
      toast.error("Inicia sesión para agregar favoritos");
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
    <div className="tg-root" style={{ "--c1": c1, "--c2": c2, "--c3": c3 }}>
      <NavGaming store={store} />

      {/* HERO */}
      <section className="tg-hero">
        <div className="tg-hero-grid" />
        <div className="tg-hero-content">
          <div className="tg-hero-badge">// TIENDA OFICIAL</div>
          <h1 className="tg-hero-title">
            <span className="tg-hero-accent">{store.storeName}</span>
          </h1>
          {store.location && <p className="tg-hero-loc">📍 {store.location}</p>}
          <div className="tg-hero-btns">
            <a href="#products" className="tg-btn tg-btn--primary">
              Ver productos <span>▶</span>
            </a>
            <a href="#about" className="tg-btn tg-btn--outline">Sobre nosotros</a>
          </div>
        </div>
        <div className="tg-hero-scan" />
      </section>

      {/* ABOUT */}
      {(store.about?.description || store.about?.mission || store.about?.vision) && (
        <section className="tg-about" id="about">
          <div className="tg-about-inner">
            <div className="tg-section-header">
              <span className="tg-tag">// ACERCA_DE</span>
              <h2>Sobre nosotros</h2>
            </div>
            <div className="tg-about-grid">
              {store.about.description && (
                <div className="tg-panel">
                  <div className="tg-panel-header">
                    <span className="tg-panel-dot" /><span className="tg-panel-dot" /><span className="tg-panel-dot" />
                    <span>DESCRIPCION.exe</span>
                  </div>
                  <p>{store.about.description}</p>
                </div>
              )}
              {store.about.mission && (
                <div className="tg-panel">
                  <div className="tg-panel-header">
                    <span className="tg-panel-dot" /><span className="tg-panel-dot" /><span className="tg-panel-dot" />
                    <span>MISION.exe</span>
                  </div>
                  <p>{store.about.mission}</p>
                </div>
              )}
              {store.about.vision && (
                <div className="tg-panel">
                  <div className="tg-panel-header">
                    <span className="tg-panel-dot" /><span className="tg-panel-dot" /><span className="tg-panel-dot" />
                    <span>VISION.exe</span>
                  </div>
                  <p>{store.about.vision}</p>
                </div>
              )}
            </div>
            {store.about.images?.length > 0 && (
              <div className="tg-about-images">
                {store.about.images.slice(0, 3).map((img, i) => (
                  <div key={i} className="tg-about-img">
                    <img src={img} alt="" />
                    <div className="tg-about-img-scan" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* PRODUCTS */}
      <section className="tg-products" id="products">
        <div className="tg-products-inner">
          <div className="tg-section-header">
            <span className="tg-tag">// INVENTARIO</span>
            <h2>Productos disponibles <span className="tg-count">[{products.length}]</span></h2>
          </div>
          {products.length === 0 ? (
            <p className="tg-empty">{">"} Sin productos disponibles_</p>
          ) : (
            <div className="tg-grid">
              {products.map((p) => (
                <CardGaming
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
      <section className="tg-contact" id="contact">
        <div className="tg-contact-inner">
          <span className="tg-tag">// CONTACTO</span>
          <h2>Conecta con nosotros</h2>
          <div className="tg-contact-items">
            {store.email && (
              <a href={`mailto:${store.email}`} className="tg-contact-item">
                <span className="tg-contact-icon">✉</span>
                <span>{store.email}</span>
              </a>
            )}
            {store.location && (
              <div className="tg-contact-item">
                <span className="tg-contact-icon">📍</span>
                <span>{store.location}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TemplateGaming;