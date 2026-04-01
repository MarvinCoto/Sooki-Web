import { useLogin } from "../hooks/login/useLogin";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import "../styles/login.css";


const LoginScreen = () => {
    const { isAuthenticated, authLoading } = useAuth();
 
    const {
        email, setEmail,
        password, setPassword,
        rememberMe, setRememberMe,
        showPassword, setShowPassword,
        loading, error, errors,
        handleSubmit, handleKeyDown,
    } = useLogin();

    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, authLoading]);

    return (
        <div className="login-page">
            <div className="login-left">
                <div className="login-left-content">
                    <h1 className="login-brand">
                        Bienvenido a tu <span className="login-brand-accent">Panel de Tienda</span>
                    </h1>
                    <p className="login-brand-sub">Administra tu negocio de manera facil y eficiente</p>
                    <p className="login-brand-sub" style={{ marginTop: "4px" }}>Gestiona productos, pedidos y clientes desde un solo lugar</p>
                    <div className="login-features">
                        <div className="login-feature-item">
                            <div className="login-feature-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                                    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                                </svg>
                            </div>
                            <div>
                                <p className="login-feature-title">Dashboard Completo</p>
                                <p className="login-feature-desc">Visualiza todas tus metricas</p>
                            </div>
                        </div>
                        <div className="login-feature-item">
                            <div className="login-feature-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                                </svg>
                            </div>
                            <div>
                                <p className="login-feature-title">Gestion de Productos</p>
                                <p className="login-feature-desc">Controla tu inventario facilmente</p>
                            </div>
                        </div>
                        <div className="login-feature-item">
                            <div className="login-feature-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 11l3 3L22 4"/>
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                                </svg>
                            </div>
                            <div>
                                <p className="login-feature-title">Seguimiento de Pedidos</p>
                                <p className="login-feature-desc">Monitorea ventas en tiempo real</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="login-blob login-blob-1" />
                <div className="login-blob login-blob-2" />
            </div>

            <div className="login-right">
                <div className="login-form-card">
                    <h2 className="login-title">Iniciar Sesion</h2>
                    <p className="login-subtitle">Ingresa tus credenciales para continuar</p>

                    {error && <div className="login-error-banner">{error}</div>}

                    <div className="login-field">
                        <label className="login-label">CORREO</label>
                        <div className={`login-input-wrapper ${errors.email ? "input-error" : ""}`}>
                            <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                            </svg>
                            <input type="email" placeholder="Ingresa tu correo" value={email}
                                onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyDown} className="login-input" />
                        </div>
                        {errors.email && <span className="login-field-error">{errors.email}</span>}
                    </div>

                    <div className="login-field">
                        <label className="login-label">CONTRASENA</label>
                        <div className={`login-input-wrapper ${errors.password ? "input-error" : ""}`}>
                            <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            <input type={showPassword ? "text" : "password"} placeholder="Ingresa tu contrasena"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleKeyDown} className="login-input" />
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
                        {errors.password && <span className="login-field-error">{errors.password}</span>}
                    </div>

                    <div className="login-row">
                        <label className="login-remember">
                            <input type="checkbox" checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                style={{ accentColor: "#1B2B44" }} />
                            <span>Recordarme</span>
                        </label>
                        <button type="button" className="login-forgot" onClick={() => navigate("/recovery")}>
                            ¿Olvidaste tu contrasena?
                        </button>
                    </div>

                    <button className="login-btn" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Iniciando sesion..." : "INICIAR SESION"}
                    </button>

                    <div className="login-divider"><span>o</span></div>

                    <p className="login-register-text">
                        ¿No tienes una cuenta?{" "}
                        <button type="button" className="login-register-link" onClick={() => navigate("/")}>
                            Registrar Tienda
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;