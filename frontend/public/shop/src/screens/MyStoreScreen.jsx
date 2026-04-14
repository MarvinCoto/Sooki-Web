import { useRef } from "react";
import StoreLayout from "../components/layout/StoreLayout";
import { useMyStore } from "../hooks/myStore/useMyStore";
import "../styles/sidebar.css";

const TABS = [
    { key: "info", label: "Informacion General" },
    { key: "design", label: "Diseño y Plantilla" },
    { key: "about", label: "Acerca de" },
];

const ImageField = ({ label, hint, preview, onChange }) => {
    const inputRef = useRef();
    return (
        <div className="field">
            <label>{label}</label>
            {hint && <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>{hint}</span>}
            <div
                style={{ display: "flex", alignItems: "center", gap: "10px", background: "var(--bg)", border: "1.5px solid var(--border)", borderRadius: "var(--radius)", padding: "8px 12px", cursor: "pointer" }}
                onClick={() => inputRef.current.click()}
            >
                <span style={{ background: "var(--navy)", color: "var(--white)", padding: "5px 12px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: "500", whiteSpace: "nowrap" }}>
                    Seleccionar
                </span>
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    {preview ? "Imagen seleccionada" : "Ningún archivo seleccionado"}
                </span>
                <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
                    onChange={(e) => { if (e.target.files[0]) onChange(e.target.files[0]); }} />
            </div>
            {preview && (
                <img src={preview} alt="" style={{ marginTop: "10px", width: "100%", maxHeight: "180px", objectFit: "cover", borderRadius: "8px", border: "1.5px solid var(--border)" }} />
            )}
        </div>
    );
};

const MyStoreScreen = () => {
    const {
        store, loading, error,
        activeTab, setActiveTab,
        infoForm, updateInfoField, handleLogoChange,
        designForm, updateDesignField, updateColor,
        aboutForm, updateAboutField, handleImageChange,
        savingInfo, savingAbout,
        successMsg, errorMsg,
        saveInfo, saveAbout,
        TEMPLATES,
    } = useMyStore();

    const logoInputRef = useRef();

    if (loading) return (
        <StoreLayout>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Cargando...</p>
        </StoreLayout>
    );

    if (error) return (
        <StoreLayout>
            <p style={{ color: "var(--error)", fontSize: "0.9rem" }}>{error}</p>
        </StoreLayout>
    );

    return (
        <StoreLayout>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Mi Tienda</h1>
                    <p className="page-subtitle">Configura la informacion y apariencia de tu tienda</p>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: "28px" }}>
                {TABS.map((tab) => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        style={{
                            background: "none", border: "none", cursor: "pointer",
                            padding: "12px 20px", fontSize: "0.875rem", fontWeight: "600",
                            fontFamily: "'Sora', sans-serif",
                            color: activeTab === tab.key ? "var(--orange)" : "var(--text-muted)",
                            borderBottom: activeTab === tab.key ? "2px solid var(--orange)" : "2px solid transparent",
                            marginBottom: "-1px",
                        }}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Mensajes */}
            {successMsg && (
                <div style={{ background: "#e6f7ee", border: "1px solid #38a169", borderRadius: "var(--radius)", padding: "10px 16px", color: "#38a169", fontSize: "0.875rem", marginBottom: "20px" }}>
                    {successMsg}
                </div>
            )}
            {errorMsg && (
                <div style={{ background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: "var(--radius)", padding: "10px 16px", color: "var(--error)", fontSize: "0.875rem", marginBottom: "20px" }}>
                    {errorMsg}
                </div>
            )}

            {/* ── TAB: INFORMACION GENERAL ── */}
            {activeTab === "info" && (
                <div className="card" style={{ maxWidth: "560px", margin: "0 auto" }}>
                    <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: "700", color: "var(--navy)", borderLeft: "4px solid var(--orange)", paddingLeft: "12px", marginBottom: "20px" }}>
                        Informacion General
                    </h3>

                    {/* Logo actual */}
                    <div className="field">
                        <label>Logo de la Tienda</label>
                        {infoForm.logoPreview && (
                            <img src={infoForm.logoPreview} alt="logo"
                                style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "10px", border: "1.5px solid var(--border)", marginBottom: "8px" }} />
                        )}
                        <div
                            style={{ display: "flex", alignItems: "center", gap: "10px", background: "var(--bg)", border: "1.5px solid var(--border)", borderRadius: "var(--radius)", padding: "8px 12px", cursor: "pointer" }}
                            onClick={() => logoInputRef.current.click()}
                        >
                            <span style={{ background: "var(--navy)", color: "var(--white)", padding: "5px 12px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: "500" }}>
                                Cambiar logo
                            </span>
                            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                                {infoForm.logo ? infoForm.logo.name : "Selecciona un nuevo logo"}
                            </span>
                            <input ref={logoInputRef} type="file" accept="image/*" style={{ display: "none" }}
                                onChange={(e) => { if (e.target.files[0]) handleLogoChange(e.target.files[0]); }} />
                        </div>
                    </div>

                    <div className="field">
                        <label>Nombre de la Tienda</label>
                        <input type="text" value={infoForm.storeName}
                            onChange={(e) => updateInfoField("storeName", e.target.value)} />
                    </div>

                    <div className="field">
                        <label>Ubicacion <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(opcional)</span></label>
                        <input type="text" placeholder="Ciudad, departamento" value={infoForm.location}
                            onChange={(e) => updateInfoField("location", e.target.value)} />
                    </div>

                    <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                        <button className="btn-save" onClick={saveInfo} disabled={savingInfo}>
                            {savingInfo ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>
                </div>
            )}

            {/* ── TAB: DISEÑO Y PLANTILLA ── */}
            {activeTab === "design" && (
                <div className="card" style={{ maxWidth: "560px", margin: "0 auto" }}>
                    <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: "700", color: "var(--navy)", borderLeft: "4px solid var(--orange)", paddingLeft: "12px", marginBottom: "20px" }}>
                        Diseño y Plantilla
                    </h3>

                    <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "14px" }}>
                        Selecciona una plantilla para tu tienda
                    </p>

                    {/* Templates */}
                    <div className="templates-grid" style={{ marginBottom: "24px" }}>
                        {TEMPLATES.map((t) => (
                            <div key={t.id}
                                className={`template-card ${designForm.design === t.id ? "selected" : ""}`}
                                onClick={() => updateDesignField("design", t.id)}
                            >
                                <div className="t-name">{t.label}</div>
                                <div className="t-desc">{t.desc}</div>
                            </div>
                        ))}
                    </div>

                    {/* Colors */}
                    <p className="colors-label">
                        Colores Personalizados
                    </p>
                    <div className="colors-row" style={{ marginBottom: "24px" }}>
                        {designForm.colors.map((color, index) => (
                            <div key={index} className="color-swatch-wrapper">
                                <div className="color-swatch" style={{ backgroundColor: color }} />
                                <input type="color" className="color-picker-input" value={color}
                                    onChange={(e) => updateColor(index, e.target.value)} />
                            </div>
                        ))}
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button className="btn-save" onClick={saveInfo} disabled={savingInfo}>
                            {savingInfo ? "Guardando..." : "Guardar Diseño"}
                        </button>
                    </div>
                </div>
            )}

            {/* ── TAB: ABOUT ── */}
            {activeTab === "about" && (
                <div style={{ maxWidth: "560px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Descripcion */}
                    <div className="card">
                        <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.95rem", fontWeight: "700", color: "var(--navy)", borderLeft: "4px solid var(--orange)", paddingLeft: "12px", marginBottom: "16px" }}>
                            Descripcion
                        </h3>
                        <div className="field">
                            <label>Texto</label>
                            <textarea placeholder="Describe tu tienda..." value={aboutForm.description}
                                onChange={(e) => updateAboutField("description", e.target.value)}
                                style={{ minHeight: "100px" }} />
                        </div>
                        <ImageField label="Imagen de Descripcion" hint="Imagen representativa de tu tienda"
                            preview={aboutForm.descriptionPreview}
                            onChange={(file) => handleImageChange("descriptionImage", "descriptionPreview", file)} />
                    </div>

                    {/* Mision */}
                    <div className="card">
                        <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.95rem", fontWeight: "700", color: "var(--navy)", borderLeft: "4px solid var(--orange)", paddingLeft: "12px", marginBottom: "16px" }}>
                            Mision
                        </h3>
                        <div className="field">
                            <label>Texto</label>
                            <textarea placeholder="¿Cual es la mision de tu tienda?" value={aboutForm.mission}
                                onChange={(e) => updateAboutField("mission", e.target.value)}
                                style={{ minHeight: "100px" }} />
                        </div>
                        <ImageField label="Imagen de Mision" hint="Imagen que represente tu mision"
                            preview={aboutForm.missionPreview}
                            onChange={(file) => handleImageChange("missionImage", "missionPreview", file)} />
                    </div>

                    {/* Vision */}
                    <div className="card">
                        <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.95rem", fontWeight: "700", color: "var(--navy)", borderLeft: "4px solid var(--orange)", paddingLeft: "12px", marginBottom: "16px" }}>
                            Vision
                        </h3>
                        <div className="field">
                            <label>Texto</label>
                            <textarea placeholder="¿Cual es la vision de tu tienda?" value={aboutForm.vision}
                                onChange={(e) => updateAboutField("vision", e.target.value)}
                                style={{ minHeight: "100px" }} />
                        </div>
                        <ImageField label="Imagen de Vision" hint="Imagen que represente tu vision"
                            preview={aboutForm.visionPreview}
                            onChange={(file) => handleImageChange("visionImage", "visionPreview", file)} />
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button className="btn-save" onClick={saveAbout} disabled={savingAbout}>
                            {savingAbout ? "Guardando..." : "Guardar About"}
                        </button>
                    </div>
                </div>
            )}
        </StoreLayout>
    );
};

export default MyStoreScreen;