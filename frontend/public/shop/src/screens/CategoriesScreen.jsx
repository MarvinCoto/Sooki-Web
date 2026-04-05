import { useState } from "react";
import StoreLayout from "../components/layout/StoreLayout";
import { useCategories } from "../hooks/categories/useCategories";
import "../styles/sidebar.css";

const CategoriesScreen = () => {
    const {
        categories, loading, error,
        modal, formName, setFormName, formError, saving,
        openModal, closeModal, handleSave, handleDelete,
    } = useCategories();

    const [expanded, setExpanded] = useState({});

    const toggleExpand = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

    return (
        <StoreLayout>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Categorias</h1>
                    <p className="page-subtitle">Organiza tus productos por categorias</p>
                </div>
                <button className="btn-add" onClick={() => openModal("create-parent")}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Nueva Categoria
                </button>
            </div>

            {loading && <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Cargando categorias...</p>}
            {error && <p style={{ color: "var(--error)", fontSize: "0.9rem" }}>{error}</p>}

            {!loading && categories.length === 0 && (
                <div className="card empty-state">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    <p>No tienes categorias aun. Crea tu primera categoria.</p>
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {categories.map((cat) => (
                    <div key={cat._id} className="card" style={{ padding: "0" }}>
                        {/* Categoria padre */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "16px 20px",
                            cursor: cat.children?.length > 0 ? "pointer" : "default",
                        }}
                            onClick={() => cat.children?.length > 0 && toggleExpand(cat._id)}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                {cat.children?.length > 0 && (
                                    <svg
                                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                        style={{ transform: expanded[cat._id] ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.2s" }}
                                    >
                                        <polyline points="9 18 15 12 9 6"/>
                                    </svg>
                                )}
                                {cat.children?.length === 0 && <div style={{ width: "16px" }} />}
                                <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: "600", fontSize: "0.9rem", color: "var(--navy)" }}>
                                    {cat.name}
                                </span>
                                {cat.children?.length > 0 && (
                                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", background: "var(--bg)", padding: "2px 8px", borderRadius: "20px" }}>
                                        {cat.children.length} {cat.children.length === 1 ? "subcategoria" : "subcategorias"}
                                    </span>
                                )}
                            </div>
                            <div style={{ display: "flex", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => openModal("create-child", null, cat._id)}
                                    style={{ background: "none", border: "1px solid var(--border)", borderRadius: "6px", padding: "5px 10px", cursor: "pointer", fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}
                                >
                                    + Subcategoria
                                </button>
                                <button
                                    onClick={() => openModal("edit", cat)}
                                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "4px" }}
                                    title="Editar"
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                    </svg>
                                </button>
                                <button
                                    onClick={() => openModal("delete", cat)}
                                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--error)", padding: "4px" }}
                                    title="Eliminar"
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                        <path d="M10 11v6"/><path d="M14 11v6"/>
                                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Subcategorias expandibles */}
                        {expanded[cat._id] && cat.children?.length > 0 && (
                            <div style={{ borderTop: "1px solid var(--border)" }}>
                                {cat.children.map((child, idx) => (
                                    <div key={child._id} style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "12px 20px 12px 48px",
                                        borderBottom: idx < cat.children.length - 1 ? "1px solid var(--bg)" : "none",
                                        background: "var(--bg)",
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--orange)" }} />
                                            <span style={{ fontSize: "0.875rem", color: "var(--navy)" }}>{child.name}</span>
                                        </div>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <button
                                                onClick={() => openModal("edit", child)}
                                                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "4px" }}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => openModal("delete", child)}
                                                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--error)", padding: "4px" }}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                                    <path d="M10 11v6"/><path d="M14 11v6"/>
                                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal */}
            {modal.open && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">
                                {modal.type === "create-parent" && "Nueva Categoria"}
                                {modal.type === "create-child" && "Nueva Subcategoria"}
                                {modal.type === "edit" && "Editar Categoria"}
                                {modal.type === "delete" && "Eliminar Categoria"}
                            </h3>
                            <button className="modal-close" onClick={closeModal}>✕</button>
                        </div>

                        <div className="modal-body">
                            {modal.type === "delete" ? (
                                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                                    ¿Estas seguro de eliminar <strong style={{ color: "var(--navy)" }}>{modal.data?.name}</strong>?
                                    {modal.data?.children?.length > 0 && (
                                        <span style={{ display: "block", marginTop: "8px", color: "var(--warning)" }}>
                                            Esto tambien eliminara sus {modal.data.children.length} subcategoria(s).
                                        </span>
                                    )}
                                </p>
                            ) : (
                                <div className="field">
                                    <label>Nombre</label>
                                    <input
                                        type="text"
                                        placeholder="Nombre de la categoria"
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        className={formError ? "error" : ""}
                                        autoFocus
                                        onKeyDown={(e) => e.key === "Enter" && handleSave()}
                                    />
                                    {formError && <span className="field-error">{formError}</span>}
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={closeModal}>Cancelar</button>
                            {modal.type === "delete" ? (
                                <button className="btn-danger" onClick={handleDelete} disabled={saving}>
                                    {saving ? "Eliminando..." : "Eliminar"}
                                </button>
                            ) : (
                                <button className="btn-save" onClick={handleSave} disabled={saving}>
                                    {saving ? "Guardando..." : "Guardar"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </StoreLayout>
    );
};

export default CategoriesScreen;