import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import useFavorites from "../../../hooks/Favorites/useFavorites";
import { toast } from "react-hot-toast";
import NavFashion from "./NavFashion";
import CardFashion from "./CardFashion";
import Footer from "../../Footer/Footer";
import "./TemplateFashion.css";

const TemplateFashion = ({ store, products }) => {
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
    <div className="tf-root" style={{ "--c1": c1, "--c2": c2, "--c3": c3 }}>
      <NavFashion store={store} />

      {/* HERO */}
      <section className="tf-hero">
        <div className="tf-hero-left">
          <p className="tf-hero-season">NUEVA COLECCIÓN</p>
          <h1 className="tf-hero-title">{store.storeName}</h1>
          {store.location && <p className="tf-hero-loc">{store.location}</p>}
          <a href="#products" className="tf-hero-cta">Descubrir</a>
        </div>
        <div className="tf-hero-right">
          <div className="tf-hero-accent-block" />
          {store.logo && (
            <img src={store.logo} alt={store.storeName} className="tf-hero-logo-large" />
          )}
        </div>
      </section>

      {/* ABOUT */}
      {(store.about?.description || store.about?.mission || store.about?.vision) && (
        <section className="tf-about" id="about">
          <div className="tf-about-inner">
            {store.about.images?.length > 0 && (
              <div className="tf-about-images">
                {store.about.images.slice(0, 3).map((img, i) => (
                  <div key={i} className={`tf-about-img tf-about-img--${i}`}>
                    <img src={img} alt="" />
                  </div>
                ))}
              </div>
            )}
            <div className="tf-about-text">
              <span className="tf-label">Nuestra historia</span>
              {store.about.description && (
                <p className="tf-about-desc">{store.about.description}</p>
              )}
              <div className="tf-about-mvs">
                {store.about.mission && (
                  <div className="tf-about-mv">
                    <h4>Misión</h4>
                    <p>{store.about.mission}</p>
                  </div>
                )}
                {store.about.vision && (
                  <div className="tf-about-mv">
                    <h4>Visión</h4>
                    <p>{store.about.vision}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PRODUCTS */}
      <section className="tf-products" id="products">
        <div className="tf-products-inner">
          <div className="tf-products-header">
            <span className="tf-label">Colección</span>
            <h2>Nuestras piezas</h2>
            <p className="tf-products-sub">{products.length} artículos seleccionados</p>
          </div>
          {products.length === 0 ? (
            <p className="tf-empty">No hay productos disponibles en este momento.</p>
          ) : (
            <div className="tf-grid">
              {products.map((p) => (
                <CardFashion
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
      <section className="tf-contact" id="contact">
        <div className="tf-contact-inner">
          <span className="tf-label tf-label--light">Contacto</span>
          <h2>Visítanos</h2>
          <div className="tf-contact-list">
            {store.email && (
              <a href={`mailto:${store.email}`} className="tf-contact-line">
                <span>Correo</span>
                <span>{store.email}</span>
              </a>
            )}
            {store.location && (
              <div className="tf-contact-line">
                <span>Ubicación</span>
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

export default TemplateFashion;