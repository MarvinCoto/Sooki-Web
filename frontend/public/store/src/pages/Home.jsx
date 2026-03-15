import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import CardStore from '../Components/Stores/CardStore';
import CardProduct from '../Components/Products/CardProduct';
import useDataStores from '../hooks/Stores/useDataStores';
import useDataProducts from '../hooks/Products/useDataProducts';
import './Home.css';

/* ─── Slides del banner ─────────────────────────────────────────
   Para cambiar las imágenes: reemplaza el campo `image` con la URL
   de tu imagen. Si no hay imagen, se muestra el gradiente de `bg`.
──────────────────────────────────────────────────────────────── */
const SLIDES = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/deakzascp/image/upload/v1773532472/landscape1_fkvspy.png',
    bg: 'linear-gradient(135deg, #1B2B44 0%, #0d1a2b 100%)',
    title: 'Descubre las mejores tiendas',
    subtitle: 'Todo lo que necesitas en un solo lugar',
  },
  {
    id: 2,
    image: 'https://res.cloudinary.com/deakzascp/image/upload/v1773532472/landscape1_fkvspy.png',
    bg: 'linear-gradient(135deg, #2a1a0d 0%, #1B2B44 100%)',
    title: 'Ofertas exclusivas hoy',
    subtitle: 'Hasta 50% de descuento en productos seleccionados',
  },
  {
    id: 3,
    image: 'https://res.cloudinary.com/deakzascp/image/upload/v1773532472/landscape1_fkvspy.png',
    bg: 'linear-gradient(135deg, #1B2B44 0%, #1a3050 100%)',
    title: 'Envío gratis desde $15',
    subtitle: 'Compra sin preocuparte por los costos de envío',
  },
];

const SLIDE_INTERVAL = 4000;

const Home = () => {
  const navigate = useNavigate();
  const [slideIndex, setSlideIndex] = useState(0);

  const { stores, loading: storesLoading, error: storesError } = useDataStores();
  const { products, loading: productsLoading, error: productsError } = useDataProducts();

  /* ─── Auto-play slider ─── */
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(i => (i === SLIDES.length - 1 ? 0 : i + 1));
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setSlideIndex(i => (i === 0 ? SLIDES.length - 1 : i - 1));
  const nextSlide = () => setSlideIndex(i => (i === SLIDES.length - 1 ? 0 : i + 1));

  const currentSlide = SLIDES[slideIndex];

  /* ─── Productos por sección ─── */
  const featuredProducts = products.slice(0, 8);
  const sookiProducts = products.filter(p =>
    p.idStore?.storeName?.toLowerCase().includes('sooki')
  );

  return (
    <main className="home">

      {/* ── HERO SLIDER ── */}
      <div className="home-hero-wrapper">
      <section
        className="home-hero"
        style={
          currentSlide.image
            ? { backgroundImage: `url(${currentSlide.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: currentSlide.bg }
        }
      >
        {/* Overlay oscuro cuando hay imagen */}
        {currentSlide.image && <div className="home-hero-overlay" />}

        <div className="home-hero-content">
          <h1 className="home-hero-title">{currentSlide.title}</h1>
          <p className="home-hero-subtitle">{currentSlide.subtitle}</p>
          <button className="home-hero-cta" onClick={() => navigate('/tiendas/registro')}>
            Registra tu tienda aquí <ArrowRight size={16} />
          </button>
        </div>

        <button className="home-slider-btn home-slider-btn--prev" onClick={prevSlide}>
          <ChevronLeft size={22} />
        </button>
        <button className="home-slider-btn home-slider-btn--next" onClick={nextSlide}>
          <ChevronRight size={22} />
        </button>

        <div className="home-slider-dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`home-slider-dot ${i === slideIndex ? 'active' : ''}`}
              onClick={() => setSlideIndex(i)}
            />
          ))}
        </div>
      </section>
      </div>

      {/* ── NUESTRAS TIENDAS ── */}
      <section className="home-section">
        <h2 className="home-section-title">Nuestras tiendas</h2>
        {storesLoading && <p className="home-loading">Cargando tiendas...</p>}
        {storesError && <p className="home-error">Error al cargar tiendas: {storesError}</p>}
        {!storesLoading && !storesError && (
          <div className="home-stores-grid">
            {stores.length === 0
              ? <p className="home-empty">No hay tiendas disponibles.</p>
              : stores.map(store => <CardStore key={store._id} store={store} />)
            }
          </div>
        )}
      </section>

      {/* ── PRODUCTOS DESTACADOS ── */}
      <section className="home-section">
        <div className="home-section-header">
          <h2 className="home-section-title home-section-title--left">Productos destacados</h2>
          <button className="home-ver-todo" onClick={() => navigate('/productos')}>
            Ver todo <ArrowRight size={15} />
          </button>
        </div>
        {productsLoading && <p className="home-loading">Cargando productos...</p>}
        {productsError && <p className="home-error">Error: {productsError}</p>}
        {!productsLoading && !productsError && (
          <div className="home-products-grid">
            {featuredProducts.length === 0
              ? <p className="home-empty">No hay productos disponibles.</p>
              : featuredProducts.map(product => (
                  <CardProduct
                    key={product._id}
                    product={product}
                    onAddToCart={(p, qty) => console.log('Carrito:', p.name, qty)}
                    onToggleFavorite={(id) => console.log('Favorito:', id)}
                  />
                ))
            }
          </div>
        )}
      </section>

      {/* ── PRODUCTOS DE SOOKI ── */}
      {(sookiProducts.length > 0 || productsLoading) && (
        <section className="home-section">
          <div className="home-section-header">
            <h2 className="home-section-title home-section-title--left">Productos de Sooki</h2>
            <button className="home-ver-todo" onClick={() => navigate('/productos?tienda=sooki')}>
              Ver todo <ArrowRight size={15} />
            </button>
          </div>
          {productsLoading && <p className="home-loading">Cargando...</p>}
          {!productsLoading && (
            <div className="home-products-grid">
              {sookiProducts.map(product => (
                <CardProduct
                  key={product._id}
                  product={product}
                  onAddToCart={(p, qty) => console.log('Carrito:', p.name, qty)}
                  onToggleFavorite={(id) => console.log('Favorito:', id)}
                />
              ))}
            </div>
          )}
        </section>
      )}

    </main>
  );
};

export default Home;