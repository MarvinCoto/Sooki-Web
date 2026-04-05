const Step2Design = ({ data, templates, onSelectTemplate, onColorChange }) => {
    return (
        <div>
            <h2 className="section-title">Diseño y Plantilla</h2>

            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "14px" }}>
                Seleccione una Plantilla
            </p>

            {/* Templates */}
            <div className="templates-grid">
                {templates.map((t) => (
                    <div
                        key={t.id}
                        className={`template-card ${data.design === t.id ? "selected" : ""}`}
                        onClick={() => onSelectTemplate(t.id)}
                    >
                        <div className="t-name">{t.label}</div>
                        <div className="t-desc">{t.desc}</div>
                    </div>
                ))}
            </div>

            {/* Colors */}
            <p className="colors-label">
                Colores Personalizados <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(opcional)</span>
            </p>
            <div className="colors-row">
                {data.colors.map((color, index) => (
                    <div key={index} className="color-swatch-wrapper">
                        <div
                            className="color-swatch"
                            style={{ backgroundColor: color }}
                        />
                        <input
                            type="color"
                            className="color-picker-input"
                            value={color}
                            onChange={(e) => onColorChange(index, e.target.value)}
                            title={`Color ${index + 1}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Step2Design;