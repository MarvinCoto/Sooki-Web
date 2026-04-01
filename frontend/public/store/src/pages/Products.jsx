import React, { useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useFavorites from '../hooks/Favorites/useFavorites';
import CardProduct from '../Components/Products/CardProduct';
import useDataProducts from '../Hooks/Products/useDataProducts';
import useDataCategories from '../Hooks/Categories/useDataCategories';
import './Products.css';

const PRODUCTS_PER_PAGE = 9;

const Products = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites(isLoggedIn ? user?.id : null);
  const { products, loading: productsLoading, error: productsError } = useDataProducts();
  const { categories, loading: categoriesLoading } = useDataCategories();

  // Filtros
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular precio máximo real cuando lleguen los productos
  useMemo(() => {
    if (products.length > 0) {
      const max = Math.ceil(Math.max(...products.map(p => p.finalPrice ?? p.basePrice ?? 0)));
      setMaxPrice(max || 1000);
      setPriceRange([0, max || 1000]);
    }
  }, [products]);

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const price = p.finalPrice ?? p.basePrice ?? 0;
      const inPrice = price >= priceRange[0] && price <= priceRange[1];
      const inCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(p.idCategory?._id || p.idCategory);
      return inPrice && inCategory;
    });
  }, [products, priceRange, selectedCategories]);

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleCategoryToggle = (categoryId) => {
    setCurrentPage(1);
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handlePriceChange = (e) => {
    setCurrentPage(1);
    setPriceRange([0, Number(e.target.value)]);
  };

  const handleToggleFavorite = async (productId) => {
    if (!isLoggedIn) {
      toast.error('Debes iniciar sesion para agregar favoritos');
      navigate('/login');
      return;
    }
    try {
      const wasFav = isFavorite(productId);
      await toggleFavorite(productId);
      toast.success(wasFav ? 'Eliminado de favoritos' : 'Agregado a favoritos');
    } catch {
      toast.error('Error al actualizar favoritos');
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="products-page">

      {/* ── SIDEBAR FILTROS ── */}
      <aside className="products-sidebar">

        {/* Precio */}
        <div className="sidebar-section">
          <h3 className="sidebar-title">Precio</h3>
          <div className="price-range-labels">
            <span>$0</span>
            <span>${priceRange[1]}</span>
          </div>
          <input
            type="range"
            min={0}
            max={maxPrice}
            value={priceRange[1]}
            onChange={handlePriceChange}
            className="price-slider"
          />
        </div>

        {/* Categorías */}
        <div className="sidebar-section">
          <h3 className="sidebar-title">Categoría</h3>
          {categoriesLoading && <p className="sidebar-loading">Cargando...</p>}
          {!categoriesLoading && (
            <ul className="category-list">
              {categories.map(cat => (
                <li key={cat._id} className="category-item">
                  <label className="category-label">
                    <input
                      type="checkbox"
                      className="category-checkbox"
                      checked={selectedCategories.includes(cat._id)}
                      onChange={() => handleCategoryToggle(cat._id)}
                    />
                    <span>{cat.name}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

      </aside>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div className="products-main">

        {/* Resultados count */}
        {!productsLoading && !productsError && (
          <p className="products-count">
            <span className="products-count-num">{filteredProducts.length}</span> resultados
          </p>
        )}

        {/* Estados */}
        {productsLoading && <p className="products-loading">Cargando productos...</p>}
        {productsError && <p className="products-error">Error: {productsError}</p>}

        {/* Grid */}
        {!productsLoading && !productsError && (
          <>
            {paginatedProducts.length === 0 ? (
              <div className="products-empty">
                <p>No hay productos que coincidan con los filtros.</p>
              </div>
            ) : (
              <div className="products-grid">
                {paginatedProducts.map(product => (
                  <CardProduct
                    key={product._id}
                    product={product}
                    isFavorite={isFavorite(product._id)}
                    onAddToCart={(p, qty) => console.log('Carrito:', p.name, qty)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  Primero
                </button>
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>

                {getPageNumbers().map((page, i) =>
                  page === '...' ? (
                    <span key={`dots-${i}`} className="pagination-dots">...</span>
                  ) : (
                    <button
                      key={page}
                      className={`pagination-num ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Último
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;