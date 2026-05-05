import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Tag, Loader, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCartContext } from "../context/CartContext";
import useFavorites from "../hooks/Favorites/useFavorites";
import CardProduct from "../components/Products/CardProduct";
import { API_BASE_URL } from "../utils/api";
import "./CategoryDetail.css";

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const { addItem } = useCartContext();
  const { isFavorite, toggleFavorite } = useFavorites(isLoggedIn ? user?.id : null);

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/products/category/${id}`);
        if (!res.ok) throw new Error("Error al cargar los productos");
        const data = await res.json();
        setProducts(data);
        if (data.length > 0) {
          setCategoryName(data[0].idCategory?.name || "Categoría");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id]);

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

  if (loading) return (
    <div className="cd-loading">
      <Loader size={36} className="cd-spinner" />
      <p>Cargando productos...</p>
    </div>
  );

  if (error) return (
    <div className="cd-error">
      <AlertCircle size={48} color="#ef4444" />
      <h2>{error}</h2>
      <button className="cd-btn" onClick={() => navigate("/categories")}>
        Ver categorías
      </button>
    </div>
  );

  return (
    <div className="cd-page">
      {/* Header */}
      <div className="cd-header">
        <div className="cd-header-inner">
          <button className="cd-back-btn" onClick={() => navigate("/categories")}>
            <ArrowLeft size={16} /> Categorías
          </button>
          <div className="cd-header-info">
            <div className="cd-header-icon">
              <Tag size={22} />
            </div>
            <div>
              <h1 className="cd-title">{categoryName}</h1>
              <p className="cd-count">
                {products.length} producto{products.length !== 1 ? "s" : ""} disponible{products.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="cd-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/categories">Categorías</Link>
            <span>/</span>
            <span>{categoryName}</span>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="cd-container">
        {products.length === 0 ? (
          <div className="cd-empty">
            <Tag size={56} color="#e2e8f0" />
            <h3>Sin productos disponibles</h3>
            <p>Esta categoría no tiene productos activos por el momento.</p>
            <button className="cd-btn" onClick={() => navigate("/products")}>
              Ver todos los productos
            </button>
          </div>
        ) : (
          <div className="cd-grid">
            {products.map((product) => (
              <CardProduct
                key={product._id}
                product={product}
                isFavorite={isFavorite(product._id)}
                onToggleFavorite={handleToggleFavorite}
                onAddToCart={(p, qty) => addItem(p, qty)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;