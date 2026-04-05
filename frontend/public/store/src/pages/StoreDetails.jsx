import React from "react";
import { useParams, Link } from "react-router-dom";
import { Loader, AlertCircle } from "lucide-react";
import useStoreDetail from "../hooks/Stores/useStoreDetails";
import TemplateMinimalist from "../components/StoreTemplates/Minimalist/TemplateMinimalist";
import TemplateModern from "../components/StoreTemplates/Modern/TemplateModern";
import TemplateGaming from "../components/StoreTemplates/Gaming/TemplateGaming";
import TemplateFashion from "../components/StoreTemplates/Fashion/TemplateFashion";
import TemplateFood from "../components/StoreTemplates/Food/TemplateFood";
import "./StoreDetails.css";

const TEMPLATES = {
  minimalist: TemplateMinimalist,
  modern: TemplateModern,
  gaming: TemplateGaming,
  fashion: TemplateFashion,
  food: TemplateFood,
};

const StoreDetails = () => {
  const { id } = useParams();
  const { store, products, loading, error } = useStoreDetail(id);

  if (loading) {
    return (
      <div className="store-detail-loading">
        <Loader size={36} className="store-detail-spinner" />
        <p>Cargando tienda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="store-detail-error">
        <AlertCircle size={48} color="#ef4444" />
        <h2>{error}</h2>
        <Link to="/stores" className="store-detail-back-btn">
          ← Ver todas las tiendas
        </Link>
      </div>
    );
  }

  if (!store) return null;

  const design = store.design?.toLowerCase() || "minimalista";
  const Template = TEMPLATES[design] || TemplateMinimalist;

  return <Template store={store} products={products} />;
};

export default StoreDetails;