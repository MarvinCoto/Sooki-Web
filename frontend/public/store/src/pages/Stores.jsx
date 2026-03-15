import React, { useState } from 'react';
import CardStore from '../components/Stores/CardStore';
import useDataStores from '../hooks/Stores/useDataStores';
import './Stores.css';

const STORES_PER_PAGE = 6;

const Stores = () => {
  const { stores, loading, error } = useDataStores();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(stores.length / STORES_PER_PAGE);
  const paginatedStores = stores.slice(
    (currentPage - 1) * STORES_PER_PAGE,
    currentPage * STORES_PER_PAGE
  );

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
    <div className="stores-page">
      <div className="stores-container">
        <h1 className="stores-title">Nuestras tiendas</h1>

        {loading && <p className="stores-loading">Cargando tiendas...</p>}
        {error && <p className="stores-error">Error al cargar tiendas: {error}</p>}

        {!loading && !error && (
          <>
            {stores.length === 0 ? (
              <p className="stores-empty">No hay tiendas disponibles.</p>
            ) : (
              <>
                <div className="stores-grid">
                  {paginatedStores.map(store => (
                    <CardStore key={store._id} store={store} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button className="pagination-btn" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>Primero</button>
                    <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Anterior</button>

                    {getPageNumbers().map((page, i) =>
                      page === '...' ? (
                        <span key={`dots-${i}`} className="pagination-dots">...</span>
                      ) : (
                        <button key={page} className={`pagination-num ${currentPage === page ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>
                          {page}
                        </button>
                      )
                    )}

                    <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Siguiente</button>
                    <button className="pagination-btn" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>Último</button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Stores;