import { useRef } from "react";

const ImageUploadField = ({ label, fieldName, preview, error, onChange, hint }) => {
    const inputRef = useRef();

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        onChange(fieldName, file);
        onChange(`${fieldName}Preview`, previewUrl);
    };

    return (
        <div className="form-group">
            <label>{label}</label>
            {hint && (
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>
                    {hint}
                </span>
            )}

            <div
                className={`file-input-wrapper ${error ? "input-error" : ""}`}
                onClick={() => inputRef.current.click()}
            >
                <span className="file-btn">Seleccionar</span>
                <span className="file-name">
                    {preview ? "Imagen seleccionada" : "Ningun archivo seleccionado"}
                </span>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpg,image/jpeg,image/png,image/webp"
                    onChange={handleChange}
                />
            </div>

            {preview && (
                <div style={{ marginTop: "10px" }}>
                    <img
                        src={preview}
                        alt={`preview ${label}`}
                        style={{
                            width: "100%",
                            maxHeight: "200px",
                            objectFit: "contain",
                            borderRadius: "8px",
                            border: "1.5px solid var(--border)",
                            background: "var(--bg)",
                            padding: "4px",
                        }}
                    />
                </div>
            )}

            {error && <span className="error-msg">{error}</span>}
        </div>
    );
};

export default ImageUploadField;