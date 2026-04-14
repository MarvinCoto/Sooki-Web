import { useVariants } from "../../hooks/variants/useVariants";

const VariantsModal = ({ product, onClose }) => {
    const {
        attributes, variants, loading, error,
        activeTab, setActiveTab,
        attrForm, setAttrForm, openAttrForm, closeAttrForm, saveAttribute,
        valueForm, setValueForm, openValueForm, closeValueForm, saveValue,
        variantForm, openVariantForm, closeVariantForm, updateVariantField, selectAttrValue, saveVariant,
        openDeleteConfirm,
    } = useVariants(product._id);

    const stockColor = (stock) => {
        if (stock === 0) return "#fee2e2";
        if (stock < 5) return "#fef3c7";
        return "#e6f7ee";
    };

    const stockTextColor = (stock) => {
        if (stock === 0) return "#e53e3e";
        if (stock < 5) return "#d97706";
        return "#38a169";
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal"
                style={{ maxWidth: "680px", maxHeight: "88vh" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="modal-header">
                    <div>
                        <h3 className="modal-title">Variantes — {product.name}</h3>
                        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                            Precio base: ${parseFloat(product.basePrice).toFixed(2)}
                        </p>
                    </div>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", borderBottom: "1px solid var(--border)", padding: "0 24px" }}>
                    {[
                        { key: "variants", label: `Variantes (${variants.length})` },
                        { key: "attributes", label: `Atributos (${attributes.length})` },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                background: "none", border: "none", cursor: "pointer",
                                padding: "12px 16px", fontSize: "0.875rem", fontWeight: "600",
                                fontFamily: "'Sora', sans-serif",
                                color: activeTab === tab.key ? "var(--orange)" : "var(--text-muted)",
                                borderBottom: activeTab === tab.key ? "2px solid var(--orange)" : "2px solid transparent",
                                marginBottom: "-1px",
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="modal-body" style={{ padding: "20px 24px" }}>
                    {loading && <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Cargando...</p>}
                    {error && <p style={{ color: "var(--error)", fontSize: "0.85rem" }}>{error}</p>}

                    {/* TAB: VARIANTES */}
                    {!loading && activeTab === "variants" && (
                        <div>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
                                <button className="btn-add" onClick={() => openVariantForm()}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    Nueva Variante
                                </button>
                            </div>

                            {variants.length === 0 && (
                                <div className="empty-state">
                                    <p>No hay variantes. Crea la primera.</p>
                                </div>
                            )}

                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {variants.map((variant) => (
                                    <div key={variant._id} style={{
                                        border: "1.5px solid var(--border)", borderRadius: "10px",
                                        padding: "14px 16px", background: variant.status ? "var(--white)" : "#f9fafb"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                                            {/* Atributos */}
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", flex: 1 }}>
                                                {variant.attributes?.length > 0 ? (
                                                    variant.attributes.map((a, i) => (
                                                        <span key={i} style={{
                                                            background: "var(--bg)", border: "1px solid var(--border)",
                                                            borderRadius: "20px", padding: "3px 10px",
                                                            fontSize: "0.78rem", color: "var(--navy)", fontWeight: "500"
                                                        }}>
                                                            {a.idAttribute?.name}: {a.idValue?.value}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Sin atributos</span>
                                                )}
                                            </div>

                                            {/* Precio y stock */}
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                                                <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: "700", fontSize: "0.9rem", color: "var(--orange)" }}>
                                                    ${parseFloat(variant.price).toFixed(2)}
                                                </span>
                                                <span style={{
                                                    background: stockColor(variant.stock),
                                                    color: stockTextColor(variant.stock),
                                                    padding: "3px 8px", borderRadius: "20px",
                                                    fontSize: "0.75rem", fontWeight: "600"
                                                }}>
                                                    {variant.stock === 0 ? "Sin stock" : variant.stock < 5 ? `${variant.stock} — bajo` : `${variant.stock} uds`}
                                                </span>
                                                <span style={{
                                                    fontSize: "0.72rem", color: variant.status ? "var(--success)" : "var(--text-muted)",
                                                    fontWeight: "500"
                                                }}>
                                                    {variant.status ? "Activa" : "Inactiva"}
                                                </span>
                                            </div>

                                            {/* Acciones */}
                                            <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                                                <button onClick={() => openVariantForm(variant)}
                                                    style={{ background: "none", border: "1px solid var(--border)", borderRadius: "6px", padding: "5px 8px", cursor: "pointer", color: "var(--text-muted)" }}>
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => openDeleteConfirm("variant", variant._id, `Variante $${variant.price}`)}
                                                    style={{ background: "none", border: "1px solid #fed7d7", borderRadius: "6px", padding: "5px 8px", cursor: "pointer", color: "var(--error)" }}>
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                        <path d="M10 11v6" /><path d="M14 11v6" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB: ATRIBUTOS */}
                    {!loading && activeTab === "attributes" && (
                        <div>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
                                <button className="btn-add" onClick={() => openAttrForm()}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    Nuevo Atributo
                                </button>
                            </div>

                            {attributes.length === 0 && (
                                <div className="empty-state">
                                    <p>No hay atributos. Crea uno para usarlo en tus variantes.</p>
                                </div>
                            )}

                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {attributes.map((attr) => (
                                    <div key={attr._id} style={{ border: "1.5px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
                                        {/* Atributo padre */}
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "var(--bg)" }}>
                                            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: "600", fontSize: "0.875rem", color: "var(--navy)" }}>
                                                {attr.name}
                                            </span>
                                            <div style={{ display: "flex", gap: "6px" }}>
                                                <button onClick={() => openAttrForm(attr)}
                                                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "3px" }}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => openDeleteConfirm("attribute", attr._id, attr.name)}
                                                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--error)", padding: "3px" }}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                        <path d="M10 11v6" /><path d="M14 11v6" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Valores */}
                                        <div style={{ padding: "10px 16px", display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                                            {attr.values?.map((val) => (
                                                <div key={val._id} style={{ display: "flex", alignItems: "center", gap: "4px", background: "var(--white)", border: "1px solid var(--border)", borderRadius: "20px", padding: "4px 10px" }}>
                                                    <span style={{ fontSize: "0.8rem", color: "var(--navy)" }}>{val.value}</span>
                                                    <button onClick={() => openDeleteConfirm("value", val._id, val.value)}
                                                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "10px", padding: "0 0 0 4px", lineHeight: 1 }}>
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                            <button onClick={() => openValueForm(attr._id)}
                                                style={{ background: "none", border: "1px dashed var(--border)", borderRadius: "20px", padding: "4px 10px", cursor: "pointer", fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>
                                                + Valor
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── SUBMODAL: VARIANTE FORM ─── */}
                {variantForm.open && (
                    <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={closeVariantForm}>
                        <div className="modal" style={{ maxWidth: "460px" }} onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3 className="modal-title">{variantForm.editId ? "Editar Variante" : "Nueva Variante"}</h3>
                                <button className="modal-close" onClick={closeVariantForm}>✕</button>
                            </div>
                            <div className="modal-body">
                                {variantForm.error && (
                                    <div style={{ background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: "8px", padding: "10px 14px", color: "var(--error)", fontSize: "0.85rem", marginBottom: "16px" }}>
                                        {variantForm.error}
                                    </div>
                                )}

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                    <div className="field">
                                        <label>Precio ($)</label>
                                        <input type="number" placeholder="0.00" min="0" step="0.01"
                                            value={variantForm.price} onChange={(e) => updateVariantField("price", e.target.value)} />
                                    </div>
                                    <div className="field">
                                        <label>Stock</label>
                                        <input type="number" placeholder="0" min="0"
                                            value={variantForm.stock} onChange={(e) => updateVariantField("stock", e.target.value)} />
                                    </div>
                                </div>

                                <div className="field">
                                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                        <input type="checkbox" checked={variantForm.status}
                                            onChange={(e) => updateVariantField("status", e.target.checked)}
                                            style={{ accentColor: "var(--navy)", width: "15px", height: "15px" }} />
                                        Variante activa
                                    </label>
                                </div>

                                {/* Seleccion de atributos */}
                                {attributes.length > 0 && (
                                    <div>
                                        <p style={{ fontSize: "0.82rem", fontWeight: "500", color: "var(--navy)", marginBottom: "10px" }}>
                                            Atributos <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(opcional)</span>
                                        </p>
                                        {attributes.map((attr) => (
                                            <div key={attr._id} className="field">
                                                <label>{attr.name}</label>
                                                <select
                                                    value={variantForm.selectedAttrs[attr._id] || ""}
                                                    onChange={(e) => selectAttrValue(attr._id, e.target.value)}
                                                >
                                                    <option value="">Sin seleccionar</option>
                                                    {attr.values?.map((val) => (
                                                        <option key={val._id} value={val._id}>{val.value}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn-secondary" onClick={closeVariantForm}>Cancelar</button>
                                <button className="btn-save" onClick={saveVariant} disabled={variantForm.saving}>
                                    {variantForm.saving ? "Guardando..." : variantForm.editId ? "Guardar Cambios" : "Crear Variante"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── SUBMODAL: ATRIBUTO FORM ─── */}
                {attrForm.open && (
                    <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={closeAttrForm}>
                        <div className="modal" style={{ maxWidth: "380px" }} onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3 className="modal-title">{attrForm.editId ? "Editar Atributo" : "Nuevo Atributo"}</h3>
                                <button className="modal-close" onClick={closeAttrForm}>✕</button>
                            </div>
                            <div className="modal-body">
                                <div className="field">
                                    <label>Nombre del atributo</label>
                                    <input type="text" placeholder="Ej: Talla, Color, Material"
                                        value={attrForm.name}
                                        onChange={(e) => setAttrForm((p) => ({ ...p, name: e.target.value }))}
                                        className={attrForm.error ? "error" : ""}
                                        autoFocus
                                        onKeyDown={(e) => e.key === "Enter" && saveAttribute()} />
                                    {attrForm.error && <span className="field-error">{attrForm.error}</span>}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn-secondary" onClick={closeAttrForm}>Cancelar</button>
                                <button className="btn-save" onClick={saveAttribute} disabled={attrForm.saving}>
                                    {attrForm.saving ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── SUBMODAL: VALOR FORM ─── */}
                {valueForm.open && (
                    <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={closeValueForm}>
                        <div className="modal" style={{ maxWidth: "380px" }} onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3 className="modal-title">Nuevo Valor</h3>
                                <button className="modal-close" onClick={closeValueForm}>✕</button>
                            </div>
                            <div className="modal-body">
                                <div className="field">
                                    <label>Valor</label>
                                    <input type="text" placeholder="Ej: S, M, L / Rojo, Azul"
                                        value={valueForm.value}
                                        onChange={(e) => setValueForm((p) => ({ ...p, value: e.target.value }))}
                                        className={valueForm.error ? "error" : ""}
                                        autoFocus
                                        onKeyDown={(e) => e.key === "Enter" && saveValue()} />
                                    {valueForm.error && <span className="field-error">{valueForm.error}</span>}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn-secondary" onClick={closeValueForm}>Cancelar</button>
                                <button className="btn-save" onClick={saveValue} disabled={valueForm.saving}>
                                    {valueForm.saving ? "Guardando..." : "Agregar"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VariantsModal;