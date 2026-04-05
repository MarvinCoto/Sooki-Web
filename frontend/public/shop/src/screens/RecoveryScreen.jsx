import { useNavigate } from "react-router-dom";
import { useRecovery } from "../hooks/recovery/useRecovery";
import "../styles/login.css";

const RecoveryScreen = () => {
    const navigate = useNavigate();
    const {
        step,
        email, setEmail,
        code,
        newPassword, setNewPassword,
        confirmPassword, setConfirmPassword,
        showPassword, setShowPassword,
        loading, error, fieldErrors,
        inputsRef,
        handleRequestCode,
        handleVerifyCode,
        handleNewPassword,
        handleCodeChange,
        handleCodeKeyDown,
        handleCodePaste,
    } = useRecovery();

    const STEP_TITLES = {
        1: { title: "Recuperar Contrasena", sub: "Ingresa tu correo para recibir un codigo de verificacion" },
        2: { title: "Verifica tu Correo", sub: `Ingresa el codigo de 6 digitos enviado a ${email}` },
        3: { title: "Nueva Contrasena", sub: "Crea una nueva contrasena para tu cuenta" },
    };

    return (
        <div className="login-page">

            {/* Panel izquierdo */}
            <div className="login-left">
                <div className="login-left-content">
                    <h1 className="login-brand">
                        Recupera el acceso a tu <span className="login-brand-accent">Panel de Tienda</span>
                    </h1>
                    <p className="login-brand-sub">
                        Sigue los pasos para restablecer tu contrasena de forma segura.
                    </p>

                    {/* Indicador de pasos */}
                    <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "16px" }}>
                        {[
                            { n: 1, label: "Ingresa tu correo" },
                            { n: 2, label: "Verifica el codigo" },
                            { n: 3, label: "Crea nueva contrasena" },
                        ].map(({ n, label }) => (
                            <div key={n} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{
                                    width: "32px", height: "32px", borderRadius: "50%",
                                    background: step >= n ? "var(--orange)" : "rgba(255,255,255,0.1)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "0.85rem", fontWeight: "700",
                                    color: step >= n ? "white" : "#a0b0c8",
                                    flexShrink: 0,
                                    transition: "all 0.3s"
                                }}>
                                    {n}
                                </div>
                                <span style={{
                                    fontSize: "0.875rem",
                                    color: step >= n ? "white" : "#a0b0c8",
                                    fontWeight: step === n ? "600" : "400",
                                    transition: "all 0.3s"
                                }}>
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="login-blob login-blob-1" />
                <div className="login-blob login-blob-2" />
            </div>

            {/* Panel derecho */}
            <div className="login-right">
                <div className="login-form-card">

                    <h2 className="login-title">{STEP_TITLES[step].title}</h2>
                    <p className="login-subtitle">{STEP_TITLES[step].sub}</p>

                    {error && <div className="login-error-banner">{error}</div>}

                    {/* Paso 1 — Email */}
                    {step === 1 && (
                        <>
                            <div className="login-field">
                                <label className="login-label">CORREO ELECTRONICO</label>
                                <div className={`login-input-wrapper ${fieldErrors.email ? "input-error" : ""}`}>
                                    <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                    <input type="email" placeholder="correo@ejemplo.com"
                                        value={email} onChange={(e) => setEmail(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleRequestCode()}
                                        className="login-input" />
                                </div>
                                {fieldErrors.email && <span className="login-field-error">{fieldErrors.email}</span>}
                            </div>

                            <button className="login-btn" onClick={handleRequestCode} disabled={loading}>
                                {loading ? "Enviando codigo..." : "ENVIAR CODIGO"}
                            </button>
                        </>
                    )}

                    {/* Paso 2 — Codigo */}
                    {step === 2 && (
                        <>
                            <div
                                style={{ display: "flex", gap: "10px", justifyContent: "center", margin: "24px 0" }}
                                onPaste={handleCodePaste}
                            >
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputsRef.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                                        style={{
                                            width: "48px", height: "56px", textAlign: "center",
                                            fontSize: "1.4rem", fontWeight: "700",
                                            fontFamily: "'Sora', sans-serif",
                                            border: `2px solid ${digit ? "#1B2B44" : "#d1dae6"}`,
                                            borderRadius: "10px",
                                            background: digit ? "white" : "#F2F5F8",
                                            color: "#1B2B44", outline: "none",
                                            transition: "border-color 0.2s, background 0.2s",
                                        }}
                                    />
                                ))}
                            </div>

                            <button className="login-btn" onClick={handleVerifyCode} disabled={loading || code.join("").length < 6}>
                                {loading ? "Verificando..." : "VERIFICAR CODIGO"}
                            </button>
                        </>
                    )}

                    {/* Paso 3 — Nueva contraseña */}
                    {step === 3 && (
                        <>
                            <div className="login-field">
                                <label className="login-label">NUEVA CONTRASENA</label>
                                <div className={`login-input-wrapper ${fieldErrors.newPassword ? "input-error" : ""}`}>
                                    <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                    <input type={showPassword ? "text" : "password"} placeholder="Minimo 8 caracteres"
                                        value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                        className="login-input" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="login-eye-btn">
                                        {showPassword ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                                <line x1="1" y1="1" x2="23" y2="23"/>
                                            </svg>
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {fieldErrors.newPassword && <span className="login-field-error">{fieldErrors.newPassword}</span>}
                            </div>

                            <div className="login-field">
                                <label className="login-label">CONFIRMAR CONTRASENA</label>
                                <div className={`login-input-wrapper ${fieldErrors.confirmPassword ? "input-error" : ""}`}>
                                    <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                    <input type={showPassword ? "text" : "password"} placeholder="Repite tu contrasena"
                                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="login-input" />
                                </div>
                                {fieldErrors.confirmPassword && <span className="login-field-error">{fieldErrors.confirmPassword}</span>}
                            </div>

                            <button className="login-btn" onClick={handleNewPassword} disabled={loading}>
                                {loading ? "Guardando..." : "GUARDAR CONTRASENA"}
                            </button>
                        </>
                    )}

                    <div className="login-divider"><span>o</span></div>

                    <p className="login-register-text">
                        ¿Recordaste tu contrasena?{" "}
                        <button type="button" className="login-register-link" onClick={() => navigate("/login")}>
                            Iniciar Sesion
                        </button>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default RecoveryScreen;