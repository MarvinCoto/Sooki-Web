import { useEffect } from "react";
import { useAlert } from "../../context/AlertContext";

const ICONS = {
    success: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
    ),
    error: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
    ),
    delete: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
    ),
};

const STYLES = {
    success: {
        iconBg: "#e6f7ee",
        iconColor: "#38a169",
        btnBg: "#38a169",
        btnHover: "#2f855a",
        title: "Operacion exitosa",
    },
    error: {
        iconBg: "#fee2e2",
        iconColor: "#e53e3e",
        btnBg: "#e53e3e",
        btnHover: "#c53030",
        title: "Ocurrio un error",
    },
    delete: {
        iconBg: "#fff3cd",
        iconColor: "#d97706",
        btnBg: "#e53e3e",
        btnHover: "#c53030",
        title: "Confirmar eliminacion",
    },
};

const AlertModal = () => {
    const { alert, closeAlert, confirmAlert } = useAlert();

    // Auto cerrar success y error despues de 3 segundos
    useEffect(() => {
        if (alert && alert.type !== "delete") {
            const timer = setTimeout(() => closeAlert(), 3000);
            return () => clearTimeout(timer);
        }
    }, [alert, closeAlert]);

    if (!alert) return null;

    const style = STYLES[alert.type];

    return (
        <div
            style={{
                position: "fixed", inset: 0,
                background: "rgba(27,43,68,0.5)",
                zIndex: 2000,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "20px",
                animation: "fadeIn 0.2s ease",
            }}
            onClick={alert.type !== "delete" ? closeAlert : undefined}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: "14px",
                    width: "100%",
                    maxWidth: "360px",
                    padding: "32px 28px",
                    textAlign: "center",
                    boxShadow: "0 8px 40px rgba(27,43,68,0.18)",
                    animation: "slideUp 0.25s ease",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icono */}
                <div style={{
                    width: "64px", height: "64px",
                    borderRadius: "50%",
                    background: style.iconBg,
                    color: style.iconColor,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px",
                }}>
                    {ICONS[alert.type]}
                </div>

                {/* Titulo */}
                <h3 style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: "1rem", fontWeight: "700",
                    color: "#1B2B44", marginBottom: "8px",
                }}>
                    {style.title}
                </h3>

                {/* Mensaje */}
                <p style={{
                    fontSize: "0.875rem", color: "#6b7a99",
                    lineHeight: "1.5", marginBottom: "24px",
                }}>
                    {alert.message}
                </p>

                {/* Botones */}
                {alert.type === "delete" ? (
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                            onClick={closeAlert}
                            style={{
                                flex: 1, background: "transparent",
                                border: "1.5px solid #d1dae6",
                                borderRadius: "10px", padding: "10px",
                                fontFamily: "'Sora', sans-serif",
                                fontSize: "0.875rem", fontWeight: "600",
                                color: "#1B2B44", cursor: "pointer",
                                transition: "background 0.2s",
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={confirmAlert}
                            style={{
                                flex: 1, background: style.btnBg,
                                border: "none", borderRadius: "10px",
                                padding: "10px",
                                fontFamily: "'Sora', sans-serif",
                                fontSize: "0.875rem", fontWeight: "600",
                                color: "#fff", cursor: "pointer",
                                transition: "background 0.2s",
                            }}
                        >
                            Eliminar
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={closeAlert}
                        style={{
                            width: "100%", background: style.btnBg,
                            border: "none", borderRadius: "10px",
                            padding: "10px",
                            fontFamily: "'Sora', sans-serif",
                            fontSize: "0.875rem", fontWeight: "600",
                            color: "#fff", cursor: "pointer",
                            transition: "background 0.2s",
                        }}
                    >
                        Entendido
                    </button>
                )}
            </div>
        </div>
    );
};

export default AlertModal;