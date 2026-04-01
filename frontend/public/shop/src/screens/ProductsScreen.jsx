import StoreLayout from "../components/layout/StoreLayout";
import { useProducts, getStockStatus } from "../hooks/products/useProducts";
import "../styles/sidebar.css";

const StockBadge = ({ stock }) => {
    const status = getStockStatus(stock);
    const labels = { ok: `${stock} en stock`, low: `${stock} — bajo`, out: "Sin stock" };
    return <span className={`stock-badge stock-${status}`}>{labels[status]}</span>;
};

const ProductsScreen = () => {
    const {
        products, categories, loading, error,
        modal, form, formErrors, saving,
        openModal, closeModal, updateForm,
        handleImageChange, removePreview,
        handleSave, handleDelete, handleToggleStatus,
    } = useProducts();

    return (
        <StoreLayout>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Productos</h1>
                    <p className="page-subtitle">{products.length} producto{products.length !== 1 ? "s" : ""} en tu tienda</p>
                </div>
                <button className="btn-add" onClick={() => openModal("create")}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Nuevo Producto
                </button>
            </div>

            {loading && <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Cargando productos...</p>}
            {error && <p style={{ color: "var(--error)", fontSize: "0.9rem" }}>{error}</p>}

            {!loading && products.length === 0 && (
                <div className="card empty-state">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    </svg>
                    <p>No tienes productos aun. Crea tu primer producto.</p>
                </div>
            )}

            {/* Grid de productos */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
                {products.map((product) => (
                    <div key={product._id} className="card" style={{ padding: "0", overflow: "hidden" }}>
                        {/* Imagen */}
                        <div style={{ position: "relative", height: "180px", background: "var(--bg)" }}>
                            {product.images?.length > 0 ? (
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                                        <polyline points="21 15 16 10 5 21"/>
                                    </svg>
                                </div>
                            )}
                            {/* Toggle status */}
                            <button
                                onClick={() => handleToggleStatus(product._id)}
                                style={{
                                    position: "absolute", top: "8px", right: "8px",
                                    background: product.status ? "rgba(56,161,105,0.9)" : "rgba(229,62,62,0.9)",
                                    border: "none", borderRadius: "20px", padding: "3px 10px",
                                    fontSize: "0.72rem", fontWeight: "600", color: "white", cursor: "pointer"
                                }}
                            >
                                {product.status ? "Activo" : "Inactivo"}
                            </button>
                        </div>

                        {/* Info */}
                        <div style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "6px" }}>
                                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.9rem", fontWeight: "600", color: "var(--navy)", lineHeight: "1.3" }}>
                                    {product.name}
                                </h3>
                                <span style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.9rem", fontWeight: "700", color: "var(--orange)", whiteSpace: "nowrap" }}>
                                    ${parseFloat(product.basePrice).toFixed(2)}
                                </span>
                            </div>

                            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "10px" }}>
                                {product.idCategory?.name || "Sin categoria"}
                            </p>

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <StockBadge stock={product.totalStock ?? 0} />
                                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                    {product.variantCount} variante{product.variantCount !== 1 ? "s" : ""}
                                </span>
                            </div>

                            {/* Acciones */}
                            <div style={{ display: "flex", gap: "8px", marginTop: "12px", borderTop: "1px solid var(--bg)", paddingTop: "12px" }}>
                                <button
                                    onClick={() => openModal("edit", product)}
                                    style={{ flex: 1, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", padding: "7px", cursor: "pointer", fontSize: "0.8rem", color: "var(--navy)", fontFamily: "'DM Sans', sans-serif", fontWeight: "500" }}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => openModal("delete", product)}
                                    style={{ background: "none", border: "1px solid #fed7d7", borderRadius: "6px", padding: "7px 10px", cursor: "pointer", color: "var(--error)" }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                        <path d="M10 11v6"/><path d="M14 11v6"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal crear/editar */}
            {modal.open && (modal.type === "create" || modal.type === "edit") && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" style={{ maxWidth: "580px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{modal.type === "create" ? "Nuevo Producto" : "Editar Producto"}</h3>
                            <button className="modal-close" onClick={closeModal}>✕</button>
                        </div>

                        <div className="modal-body">
                            {formErrors.general && (
                                <div style={{ background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: "8px", padding: "10px 14px", color: "var(--error)", fontSize: "0.85rem", marginBottom: "16px" }}>
                                    {formErrors.general}
                                </div>
                            )}

                            <div className="field">
                                <label>Nombre del producto</label>
                                <input type="text" placeholder="Ej: Camisa de lino" value={form.name}
                                    onChange={(e) => updateForm("name", e.target.value)}
                                    className={formErrors.name ? "error" : ""} />
                                {formErrors.name && <span className="field-error">{formErrors.name}</span>}
                            </div>

                            <div className="field">
                                <label>Descripcion <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(opcional)</span></label>
                                <textarea placeholder="Describe tu producto..." value={form.description}
                                    onChange={(e) => updateForm("description", e.target.value)} />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                <div className="field">
                                    <label>Categoria</label>
                                    <select value={form.idCategory} onChange={(e) => updateForm("idCategory", e.target.value)}
                                        className={formErrors.idCategory ? "error" : ""}>
                                        <option value="">Seleccionar...</option>
                                        {categories.map((c) => (
                                            <option key={c._id} value={c._id}>
                                                {c.parent ? `  — ${c.name}` : c.name}
                                            </option>
                                        ))}
                                    </select>
                                    {formErrors.idCategory && <span className="field-error">{formErrors.idCategory}</span>}
                                </div>

                                <div className="field">
                                    <label>Precio base ($)</label>
                                    <input type="number" placeholder="0.00" min="0" step="0.01"
                                        value={form.basePrice} onChange={(e) => updateForm("basePrice", e.target.value)}
                                        className={formErrors.basePrice ? "error" : ""} />
                                    {formErrors.basePrice && <span className="field-error">{formErrors.basePrice}</span>}
                                </div>
                            </div>

                            {/* Descuento */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                <div className="field">
                                    <label>Descuento (%) <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(opcional)</span></label>
                                    <input type="number" placeholder="0" min="0" max="100"
                                        value={form.discountPercentage}
                                        onChange={(e) => updateForm("discountPercentage", e.target.value)} />
                                </div>
                                <div className="field" style={{ justifyContent: "flex-end" }}>
                                    <label>Estado</label>
                                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", paddingTop: "10px" }}>
                                        <input type="checkbox" checked={form.status}
                                            onChange={(e) => updateForm("status", e.target.checked)}
                                            style={{ accentColor: "var(--navy)", width: "16px", height: "16px" }} />
                                        <span style={{ fontSize: "0.875rem", color: "var(--navy)" }}>Activo</span>
                                    </label>
                                </div>
                            </div>

                            {/* Imagenes */}
                            <div className="field">
                                <label>Imagenes <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>({form.previews.length}/5)</span></label>
                                {form.previews.length < 5 && (
                                    <label style={{
                                        display: "flex", alignItems: "center", gap: "10px",
                                        background: "var(--bg)", border: "1.5px dashed var(--border)",
                                        borderRadius: "var(--radius)", padding: "10px 14px", cursor: "pointer"
                                    }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                                            <polyline points="21 15 16 10 5 21"/>
                                        </svg>
                                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Seleccionar imagenes</span>
                                        <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                                    </label>
                                )}
                                {formErrors.images && <span className="field-error">{formErrors.images}</span>}

                                {form.previews.length > 0 && (
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                                        {form.previews.map((src, i) => (
                                            <div key={i} style={{ position: "relative" }}>
                                                <img src={src} alt="" style={{ width: "72px", height: "72px", objectFit: "cover", borderRadius: "8px", border: "1.5px solid var(--border)" }} />
                                                <button
                                                    onClick={() => removePreview(i)}
                                                    style={{ position: "absolute", top: "-6px", right: "-6px", width: "18px", height: "18px", borderRadius: "50%", background: "var(--error)", border: "none", color: "white", cursor: "pointer", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={closeModal}>Cancelar</button>
                            <button className="btn-save" onClick={handleSave} disabled={saving}>
                                {saving ? "Guardando..." : modal.type === "create" ? "Crear Producto" : "Guardar Cambios"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal eliminar */}
            {modal.open && modal.type === "delete" && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Eliminar Producto</h3>
                            <button className="modal-close" onClick={closeModal}>✕</button>
                        </div>
                        <div className="modal-body">
                            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                                ¿Estas seguro de eliminar <strong style={{ color: "var(--navy)" }}>{modal.product?.name}</strong>?
                                Esta accion tambien eliminara todas sus variantes y no se puede deshacer.
                            </p>
                            {formErrors.general && (
                                <p style={{ color: "var(--error)", fontSize: "0.85rem", marginTop: "12px" }}>{formErrors.general}</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={closeModal}>Cancelar</button>
                            <button className="btn-danger" onClick={handleDelete} disabled={saving}>
                                {saving ? "Eliminando..." : "Eliminar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </StoreLayout>
    );
};

export default ProductsScreen;