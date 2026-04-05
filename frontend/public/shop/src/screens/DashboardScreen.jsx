import StoreLayout from "../components/layout/StoreLayout";

const DashboardScreen = () => {
    return (
        <StoreLayout>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Resumen de tu tienda</p>
                </div>
            </div>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "60vh",
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                fontFamily: "'DM Sans', sans-serif",
            }}>
                Las estadisticas del dashboard estaran disponibles proximamente.
            </div>
        </StoreLayout>
    );
};

export default DashboardScreen;