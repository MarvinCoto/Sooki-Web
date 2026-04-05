const PendingApprovalScreen = () => {
    return (
        <div className="register-page">
            <div className="register-card">
                <div className="success-screen">
                    <div style={{
                        width: "64px",
                        height: "64px",
                        background: "#eef2ff",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                        fontSize: "1.8rem",
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1B2B44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                            <path d="M12 8v4l3 3"/>
                        </svg>
                    </div>

                    <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.3rem", color: "var(--navy)", marginBottom: "12px" }}>
                        Solicitud enviada
                    </h2>

                    <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "16px" }}>
                        Gracias por tu tiempo y por registrarte en Sooki. Hemos recibido tu solicitud correctamente.
                    </p>

                    <div style={{
                        background: "var(--bg)",
                        border: "1.5px solid var(--border)",
                        borderRadius: "var(--radius)",
                        padding: "16px 20px",
                        textAlign: "left",
                        marginBottom: "20px",
                    }}>
                        <p style={{ fontSize: "0.85rem", color: "var(--navy)", margin: 0, lineHeight: "1.6" }}>
                            Nuestro equipo revisara la informacion proporcionada. Este proceso puede tomar entre
                            <strong> 1 a 3 dias habiles</strong>. Recibiras un correo electronico cuando tu solicitud
                            haya sido procesada.
                        </p>
                    </div>

                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        Puedes cerrar esta ventana.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PendingApprovalScreen;