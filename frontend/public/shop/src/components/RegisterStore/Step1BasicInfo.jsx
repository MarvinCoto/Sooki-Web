import { useRef } from "react";

const Step1BasicInfo = ({ data, errors, onChange }) => {
    const fileInputRef = useRef();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const preview = URL.createObjectURL(file);
        onChange("logo", file);
        onChange("logoPreview", preview);
    };

    return (
        <div>
            <h2 className="section-title">Información Básica</h2>

            {/* Store Name */}
            <div className="form-group">
                <label>Nombre de la Tienda</label>
                <input
                    type="text"
                    placeholder="Ingrese el nombre de su tienda"
                    value={data.storeName}
                    onChange={(e) => onChange("storeName", e.target.value)}
                    className={errors.storeName ? "input-error" : ""}
                />
                {errors.storeName && <span className="error-msg">{errors.storeName}</span>}
            </div>

            {/* Logo */}
            <div className="form-group">
                <label>Logo de la Tienda</label>
                <div
                    className={`file-input-wrapper ${errors.logo ? "input-error" : ""}`}
                    onClick={() => fileInputRef.current.click()}
                >
                    <span className="file-btn">Seleccionar archivo</span>
                    <span className="file-name">
                        {data.logo ? data.logo.name : "Ningún archivo seleccionado"}
                    </span>
                    {data.logoPreview && (
                        <img src={data.logoPreview} alt="preview" className="logo-preview" />
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpg,image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                    />
                </div>
                {errors.logo && <span className="error-msg">{errors.logo}</span>}
            </div>

            {/* Owner Name */}
            <div className="form-group">
                <label>Nombre del Propietario</label>
                <input
                    type="text"
                    placeholder="Ingrese su nombre completo"
                    value={data.ownerName}
                    onChange={(e) => onChange("ownerName", e.target.value)}
                    className={errors.ownerName ? "input-error" : ""}
                />
                {errors.ownerName && <span className="error-msg">{errors.ownerName}</span>}
            </div>

            {/* Phone */}
            <div className="form-group">
                <label>Teléfono</label>
                <input
                    type="tel"
                    placeholder="+503 0000-0000"
                    value={data.phoneNumber}
                    onChange={(e) => {
                        const val = e.target.value.replace(/[^\d\-]/g, "");
                        onChange("phoneNumber", val);
                    }}
                    className={errors.phoneNumber ? "input-error" : ""}
                />
                {errors.phoneNumber && <span className="error-msg">{errors.phoneNumber}</span>}
            </div>

            {/* Physical Store Checkbox */}
            <div className="checkbox-group">
                <input
                    type="checkbox"
                    id="hasPhysical"
                    checked={data.hasPhysicalStore}
                    onChange={(e) => onChange("hasPhysicalStore", e.target.checked)}
                />
                <label htmlFor="hasPhysical">Tiene tienda física</label>
            </div>

            {/* Location - conditional */}
            {data.hasPhysicalStore && (
                <div className="form-group" style={{ animation: "cardIn 0.25s ease" }}>
                    <label>Dirección de la Tienda <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(opcional)</span></label>
                    <input
                        type="text"
                        placeholder="Ingrese la dirección"
                        value={data.location}
                        onChange={(e) => onChange("location", e.target.value)}
                        className={errors.location ? "input-error" : ""}
                    />
                    {errors.location && <span className="error-msg">{errors.location}</span>}
                </div>
            )}
        </div>
    );
};

export default Step1BasicInfo;