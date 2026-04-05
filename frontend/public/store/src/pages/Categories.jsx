import React from 'react';
import CardCategory from '../components/Categories/CardCategory';
import useDataCategories from '../hooks/Categories/useDataCategories';
import './Categories.css';

const Categories = () => {
  const { categories, loading, error } = useDataCategories();

  return (
    <div className="categories-page">
      <div className="categories-container">
        <h1 className="categories-title">Nuestras categorías</h1>

        {loading && <p className="categories-loading">Cargando categorías...</p>}
        {error && <p className="categories-error">Error al cargar categorías: {error}</p>}

        {!loading && !error && (
          <>
            {categories.length === 0 ? (
              <p className="categories-empty">No hay categorías disponibles.</p>
            ) : (
              <div className="categories-grid">
                {categories.map(category => (
                  <CardCategory key={category._id} category={category} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Categories;