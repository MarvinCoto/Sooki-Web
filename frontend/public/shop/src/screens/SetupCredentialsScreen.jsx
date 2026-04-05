import { useSearchParams } from "react-router-dom";
import { useSetupCredentials } from "../hooks/setupCredentials/useSetupCredentials";
import { Fragment } from "react";
import ImageUploadField from "../components/registerStore/ImageUploadField";
import "../styles/registerStore.css";

const STEPS = [
    { number: 1, label: "Informacion de la Tienda" },
    { number: 2, label: "Diseño y Plantilla" },
    { number: 3, label: "Credenciales" },
];

const SetupStepper = ({ currentStep }) => (
    <div className="stepper">
        {STEPS.map((s, i) => (
            <Fragment key={s.number}>
                <div className={`stepper-item ${currentStep === s.number ? "active" : currentStep > s.number ? "completed" : ""}`}>
                    <div className="stepper-circle">{s.number}</div>
                    <span className="stepper-label">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                    <div className={`stepper-line ${currentStep > s.number ? "completed" : ""}`} />
                )}
            </Fragment>
        ))}
    </div>
);

const SetupCredentialsScreen = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const {
        step,
        loading,
        submitLoading,
        tokenError,
        error,
        success,
        ownerName,
        storeInfo,
        design,
        credentials,
        formErrors,
        TEMPLATES,
        nextStep,
        prevStep,
        updateStoreInfo,
        updateDesign,
        updateColor,
        updateCredentials,
        handleSubmit,
    } = useSetupCredentials(token);

    // Token invalido o expirado
    if (tokenError) {
        return (
            <div className="register-page">
                <div className="register-card" style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>—</div>
                    <h2 style={{ fontFamily: "'Sora', sans-serif", color: "var(--navy)", marginBottom: "12px" }}>
                        Link invalido
                    </h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{tokenError}</p>
                </div>
            </div>
        );
    }

    // Cargando verificacion de token
    if (loading) {
        return (
            <div className="register-page">
                <div className="register-card" style={{ textAlign: "center" }}>
                    <p style={{ color: "var(--text-muted)" }}>Verificando enlace...</p>
                </div>
            </div>
        );
    }

    // Setup completado
    if (success) {
        return (
            <div className="register-page">
                <div className="register-card">
                    <div className="success-screen">
                        <div className="success-icon">✓</div>
                        <h2>Configuracion completada</h2>
                        <p>Tu tienda esta lista. Ya puedes iniciar sesion con tus credenciales.</p>
                        <button
                            className="btn-primary"
                            onClick={() => window.location.href = "/login"}
                        >
                            Ir al Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="register-page">
            <div className="register-card" style={{ maxWidth: "560px" }}>

                <div className="register-header">
                    <h1>Configura tu Tienda</h1>
                    {ownerName && (
                        <p>Bienvenido, <strong>{ownerName}</strong>. Completa los siguientes pasos.</p>
                    )}
                </div>

                <SetupStepper currentStep={step} />

                {error && <div className="error-banner">{error}</div>}

                {/* ── Burbuja 1: Info tienda ── */}
                {step === 1 && (
                    <div>
                        <h3 className="section-title">Informacion de la Tienda</h3>

                        <div className="form-group">
                            <label>Nombre de la Tienda</label>
                            <input
                                type="text"
                                placeholder="Ingrese el nombre de su tienda"
                                value={storeInfo.storeName}
                                onChange={(e) => updateStoreInfo("storeName", e.target.value)}
                                className={formErrors.storeName ? "input-error" : ""}
                            />
                            {formErrors.storeName && <span className="error-msg">{formErrors.storeName}</span>}
                        </div>

                        <ImageUploadField
                            label="Logo de la Tienda"
                            fieldName="logo"
                            preview={storeInfo.logoPreview}
                            error={formErrors.logo}
                            onChange={(field, value) => updateStoreInfo(field === "logo" ? "logo" : "logoPreview", value)}
                            hint="Imagen cuadrada recomendada (png, jpg, webp)"
                        />

                        <div className="form-group">
                            <label>
                                Ubicacion <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(opcional)</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ciudad, departamento"
                                value={storeInfo.location}
                                onChange={(e) => updateStoreInfo("location", e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* ── Burbuja 2: Diseño ── */}
                {step === 2 && (
                    <div>
                        <h3 className="section-title">Diseño y Plantilla</h3>

                        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "14px" }}>
                            Seleccione una plantilla para su tienda
                        </p>

                        <div className="templates-grid">
                            {TEMPLATES.map((t) => (
                                <div
                                    key={t.id}
                                    className={`template-card ${design.template === t.id ? "selected" : ""}`}
                                    onClick={() => updateDesign("template", t.id)}
                                >
                                    <div className="t-name">{t.label}</div>
                                    <div className="t-desc">{t.desc}</div>
                                </div>
                            ))}
                        </div>

                        <p className="colors-label">
                            Colores Personalizados <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(opcional)</span>
                        </p>
                        <div className="colors-row">
                            {design.colors.map((color, index) => (
                                <div key={index} className="color-swatch-wrapper">
                                    <div className="color-swatch" style={{ backgroundColor: color }} />
                                    <input
                                        type="color"
                                        className="color-picker-input"
                                        value={color}
                                        onChange={(e) => updateColor(index, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Burbuja 3: Credenciales ── */}
                {step === 3 && (
                    <div>
                        <h3 className="section-title">Credenciales de Acceso</h3>

                        <div className="form-group">
                            <label>Usuario</label>
                            <input
                                type="text"
                                placeholder="Ingrese su nombre de usuario"
                                value={credentials.username}
                                onChange={(e) => updateCredentials("username", e.target.value)}
                                className={formErrors.username ? "input-error" : ""}
                            />
                            {formErrors.username && <span className="error-msg">{formErrors.username}</span>}
                        </div>

                        <div className="form-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                placeholder="Ingrese su contraseña"
                                value={credentials.password}
                                onChange={(e) => updateCredentials("password", e.target.value)}
                                className={formErrors.password ? "input-error" : ""}
                            />
                            {formErrors.password && <span className="error-msg">{formErrors.password}</span>}
                        </div>

                        <div className="form-group">
                            <label>Confirmar Contraseña</label>
                            <input
                                type="password"
                                placeholder="Confirme su contraseña"
                                value={credentials.confirmPassword}
                                onChange={(e) => updateCredentials("confirmPassword", e.target.value)}
                                className={formErrors.confirmPassword ? "input-error" : ""}
                            />
                            {formErrors.confirmPassword && <span className="error-msg">{formErrors.confirmPassword}</span>}
                        </div>
                    </div>
                )}

                {/* Botones */}
                <div className="btn-row">
                    {step > 1 && (
                        <button className="btn-secondary" onClick={prevStep}>
                            Anterior
                        </button>
                    )}
                    {step < 3 ? (
                        <button className="btn-primary" onClick={nextStep}>
                            Continuar
                        </button>
                    ) : (
                        <button
                            className="btn-primary"
                            onClick={handleSubmit}
                            disabled={submitLoading}
                        >
                            {submitLoading ? "Guardando..." : "Finalizar Configuracion"}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default SetupCredentialsScreen;