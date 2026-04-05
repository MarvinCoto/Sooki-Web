import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Search, ShoppingBag, ArrowUpDown } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import useFavorites from "../hooks/Favorites/useFavorites";
import CardProduct from "../Components/Products/CardProduct";
import "./Favorites.css";

const Favorites = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const clientId = user?.id || null;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const { favoriteProducts, loading, error, toggleFavorite, isFavorite, isEmpty, count } =
    useFavorites(isLoggedIn ? clientId : null);

  // ===== FILTRAR Y ORDENAR =====
  const processedProducts = useMemo(() => {
    let result = [...favoriteProducts];

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.categoryName?.toLowerCase().includes(term) ||
          p.storeName?.toLowerCase().includes(term)
      );
    }

    // Ordenar
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "price-low":
        result.sort((a, b) => (a.finalPrice ?? a.basePrice) - (b.finalPrice ?? b.basePrice));
        break;
      case "price-high":
        result.sort((a, b) => (b.finalPrice ?? b.basePrice) - (a.finalPrice ?? a.basePrice));
        break;
      case "name":
        result.sort((a, b) => a.name?.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [favoriteProducts, searchTerm, sortBy]);

  // ===== HANDLERS =====
  const handleToggleFavorite = useCallback(
    async (productId) => {
      try {
        const wasFav = isFavorite(productId);
        const result = await toggleFavorite(productId);
        if (result.success) {
          toast.success(wasFav ? "Eliminado de favoritos" : "Agregado a favoritos");
        }
      } catch (err) {
        toast.error("Error al actualizar favoritos");
      }
    },
    [isFavorite, toggleFavorite]
  );

  // ===== ESTADOS =====

  // No autenticado
  if (!isLoggedIn) {
    return (
      <div className="fav-page">
        <div className="fav-hero">
          <div className="fav-hero-overlay" />
          <div className="fav-hero-content">
            <Heart size={40} className="fav-hero-icon" />
            <h1>Tus Favoritos</h1>
            <p>Inicia sesión para ver tus productos guardados</p>
          </div>
        </div>
        <div className="fav-container">
          <div className="fav-empty-state">
            <Heart size={64} color="#e2e8f0" />
            <h3>Debes iniciar sesión</h3>
            <p>Guarda tus productos favoritos y accede a ellos cuando quieras.</p>
            <div className="fav-empty-actions">
              <button className="fav-btn fav-btn-primary" onClick={() => navigate("/login")}>
                Iniciar Sesión
              </button>
              <button className="fav-btn fav-btn-outline" onClick={() => navigate("/register")}>
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="fav-page">
        <div className="fav-hero">
          <div className="fav-hero-overlay" />
          <div className="fav-hero-content">
            <Heart size={40} className="fav-hero-icon" />
            <h1>Tus Favoritos</h1>
          </div>
        </div>
        <div className="fav-container">
          <div className="fav-loading">
            <div className="fav-spinner" />
            <p>Cargando tus favoritos...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="fav-page">
        <div className="fav-hero">
          <div className="fav-hero-overlay" />
          <div className="fav-hero-content">
            <Heart size={40} className="fav-hero-icon" />
            <h1>Tus Favoritos</h1>
          </div>
        </div>
        <div className="fav-container">
          <div className="fav-empty-state">
            <h3>Error al cargar favoritos</h3>
            <p>{error}</p>
            <button className="fav-btn fav-btn-primary" onClick={() => window.location.reload()}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sin favoritos
  if (isEmpty) {
    return (
      <div className="fav-page">
        <div className="fav-hero">
          <div className="fav-hero-overlay" />
          <div className="fav-hero-content">
            <Heart size={40} className="fav-hero-icon" />
            <h1>Tus Favoritos</h1>
            <p>Aún no tienes productos guardados</p>
          </div>
        </div>
        <div className="fav-container">
          <div className="fav-empty-state">
            <Heart size={64} color="#e2e8f0" />
            <h3>No tienes favoritos aún</h3>
            <p>Explora nuestros productos y guarda los que más te gusten.</p>
            <div className="fav-empty-actions">
              <button className="fav-btn fav-btn-primary" onClick={() => navigate("/products")}>
                <ShoppingBag size={18} /> Explorar Productos
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Con favoritos
  return (
    <div className="fav-page">
      {/* Hero */}
      <div className="fav-hero">
        <div className="fav-hero-overlay" />
        <div className="fav-hero-content">
          <Heart size={40} className="fav-hero-icon" />
          <h1>Tus Favoritos</h1>
          <p>Tienes {count} producto{count !== 1 ? "s" : ""} guardado{count !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="fav-container">
        <div className="fav-card">

          {/* Barra de búsqueda y ordenar */}
          <div className="fav-toolbar">
            <div className="fav-search-wrap">
              <Search size={16} className="fav-search-icon" />
              <input
                type="text"
                placeholder="Buscar por nombre, categoría o tienda..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="fav-search-input"
              />
              {searchTerm && (
                <button className="fav-search-clear" onClick={() => setSearchTerm("")}>×</button>
              )}
            </div>

            <div className="fav-sort-wrap">
              <ArrowUpDown size={15} color="#94a3b8" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="fav-sort-select"
              >
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguos</option>
                <option value="price-low">Precio: Menor a mayor</option>
                <option value="price-high">Precio: Mayor a menor</option>
                <option value="name">Nombre A-Z</option>
              </select>
            </div>
          </div>

          {/* Info resultados */}
          {searchTerm && (
            <p className="fav-results-info">
              {processedProducts.length > 0
                ? <><strong>{processedProducts.length}</strong> resultado{processedProducts.length !== 1 ? "s" : ""} para "{searchTerm}"</>
                : <span className="fav-no-results">No se encontraron productos para "{searchTerm}"</span>
              }
            </p>
          )}

          {/* Grid de productos */}
          {processedProducts.length > 0 ? (
            <div className="fav-grid">
              {processedProducts.map((product) => (
                <CardProduct
                  key={product._id}
                  product={product}
                  isFavorite={isFavorite(product._id)}
                  onToggleFavorite={() => handleToggleFavorite(product._id)}
                  onAddToCart={(p, qty) => console.log("Carrito:", p.name, qty)}
                />
              ))}
            </div>
          ) : searchTerm ? (
            <div className="fav-empty-state">
              <Search size={48} color="#e2e8f0" />
              <h3>Sin resultados</h3>
              <p>Intenta con otros términos de búsqueda.</p>
              <button className="fav-btn fav-btn-outline" onClick={() => setSearchTerm("")}>
                Limpiar búsqueda
              </button>
            </div>
          ) : null}

        </div>
      </div>
    </div>
  );
};

export default Favorites;