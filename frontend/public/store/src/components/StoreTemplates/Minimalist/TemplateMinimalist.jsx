import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import useFavorites from "../../../hooks/Favorites/useFavorites";
import { toast } from "react-hot-toast";
import NavMinimalist from "./NavMinimalist";
import CardMinimalist from "./CardMinimalist";
import Footer from "../../Footer/Footer";
import "./TemplateMinimalist.css";

const TemplateMinimalist = ({ store, products }) => {
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
    <div
      className="tm-root"
      style={{
        "--c1": c1,
        "--c2": c2,
        "--c3": c3,
      }}
    >
      <NavMinimalist store={store} />

      {/* ── HERO ── */}
      <section className="tm-hero">
        <div className="tm-hero-inner">
          <span className="tm-hero-tag">Tienda oficial</span>
          <h1 className="tm-hero-title">{store.storeName}</h1>
          {store.location && (
            <p className="tm-hero-location">📍 {store.location}</p>
          )}
          <div className="tm-hero-divider" />
          <a href="#products" className="tm-hero-cta">
            Ver productos
          </a>
        </div>
      </section>

      {/* ── SOBRE NOSOTROS ── */}
      {(store.about?.description || store.about?.mission || store.about?.vision) && (
        <section className="tm-about" id="about">
          <div className="tm-about-inner">
            <p className="tm-section-label">Nuestra historia</p>
            <h2 className="tm-about-title">Sobre nosotros</h2>

            <div className="tm-about-grid">
              {store.about.description && (
                <div className="tm-about-card">
                  <span className="tm-about-card-num">01</span>
                  <h3>Quiénes somos</h3>
                  <p>{store.about.description}</p>
                </div>
              )}
              {store.about.mission && (
                <div className="tm-about-card">
                  <span className="tm-about-card-num">02</span>
                  <h3>Nuestra misión</h3>
                  <p>{store.about.mission}</p>
                </div>
              )}
              {store.about.vision && (
                <div className="tm-about-card">
                  <span className="tm-about-card-num">03</span>
                  <h3>Nuestra visión</h3>
                  <p>{store.about.vision}</p>
                </div>
              )}
            </div>

            {store.about.images?.length > 0 && (
              <div className="tm-about-images">
                {store.about.images.slice(0, 3).map((img, i) => (
                  <div key={i} className="tm-about-img-wrap">
                    <img src={img} alt={`${store.storeName} ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── PRODUCTOS ── */}
      <section className="tm-products" id="products">
        <div className="tm-products-inner">
          <p className="tm-section-label">Catálogo</p>
          <h2 className="tm-products-title">Nuestros productos</h2>
          <p className="tm-products-count">
            {products.length} producto{products.length !== 1 ? "s" : ""} disponible{products.length !== 1 ? "s" : ""}
          </p>

          {products.length === 0 ? (
            <div className="tm-empty">
              <p>Esta tienda aún no tiene productos disponibles.</p>
            </div>
          ) : (
            <div className="tm-grid">
              {products.map((product) => (
                <CardMinimalist
                  key={product._id}
                  product={product}
                  isFavorite={isFavorite(product._id)}
                  onToggleFavorite={() => handleToggleFavorite(product._id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CONTACTO ── */}
      <section className="tm-contact" id="contact">
        <div className="tm-contact-inner">
          <p className="tm-section-label">Contacto</p>
          <h2 className="tm-contact-title">Encuéntranos</h2>
          <div className="tm-contact-grid">
            {store.email && (
              <div className="tm-contact-item">
                <span className="tm-contact-label">Email</span>
                <a href={`mailto:${store.email}`}>{store.email}</a>
              </div>
            )}
            {store.location && (
              <div className="tm-contact-item">
                <span className="tm-contact-label">Ubicación</span>
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

export default TemplateMinimalist;