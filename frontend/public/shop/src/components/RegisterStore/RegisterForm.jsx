import { useState } from "react";
import ImageUploadField from "./ImageUploadField";
import TermsModal from "./TermsModal";

const BANKS = [
    "Banco Agricola", "Banco Davivienda", "Banco Cuscatlan",
    "Banco de America Central", "Banco Hipotecario",
    "Banco Promerica", "Banco Azul", "Otro",
];

const TERM_ITEMS = [
    { key: "acceptedTerms", label: "Terminos y Condiciones" },
    { key: "acceptedPrivacyPolicy", label: "Politica de Privacidad" },
    { key: "acceptedSellerPolicy", label: "Politica del Vendedor" },
    { key: "acceptedProhibitedProducts", label: "Politica de Productos Prohibidos" },
];

const DOCUMENT_TYPES = ["DUI", "Pasaporte", "Residencia"];

const DOCUMENT_CONFIG = {
    DUI:       { maxLength: 9,  onlyNumbers: true,  placeholder: "000000000",  label: "9 digitos" },
    Pasaporte: { maxLength: 9,  onlyNumbers: false, placeholder: "A00000000",  label: "9 caracteres" },
    Residencia:{ maxLength: 10, onlyNumbers: true,  placeholder: "0000000000", label: "10 digitos" },
};

const RegisterForm = ({ data, errors, onChange }) => {
    const [openModal, setOpenModal] = useState(null);

    const handleDocumentTypeChange = (type) => {
        onChange("documentType", type);
        onChange("duiNumber", "");       onChange("duiFront", null);      onChange("duiFrontPreview", null);
        onChange("duiBack", null);       onChange("duiBackPreview", null);
        onChange("passportNumber", "");  onChange("passportPhoto", null);  onChange("passportPhotoPreview", null);
        onChange("residenceNumber", ""); onChange("residenceFront", null); onChange("residenceFrontPreview", null);
        onChange("residenceBack", null); onChange("residenceBackPreview", null);
    };

    const handleDocumentNumber = (field, value, onlyNumbers, maxLength) => {
        let v = onlyNumbers ? value.replace(/\D/g, "") : value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
        if (v.length > maxLength) v = v.slice(0, maxLength);
        onChange(field, v);
    };

    const cfg = DOCUMENT_CONFIG[data.documentType];

    return (
        <div>
            {/* ── Informacion Personal ── */}
            <div className="form-section">
                <h3 className="section-title">Informacion Personal</h3>

                <div className="form-group">
                    <label>Nombre completo</label>
                    <input type="text" placeholder="Ingrese su nombre completo"
                        value={data.ownerName} onChange={(e) => onChange("ownerName", e.target.value)}
                        className={errors.ownerName ? "input-error" : ""} />
                    {errors.ownerName && <span className="error-msg">{errors.ownerName}</span>}
                </div>

                <div className="form-group">
                    <label>Telefono</label>
                    <input type="tel" placeholder="+503 0000-0000"
                        value={data.phoneNumber}
                        onChange={(e) => onChange("phoneNumber", e.target.value.replace(/[^\d\-+\s]/g, ""))}
                        className={errors.phoneNumber ? "input-error" : ""} />
                    {errors.phoneNumber && <span className="error-msg">{errors.phoneNumber}</span>}
                </div>

                <div className="form-group">
                    <label>Correo Electronico</label>
                    <input type="email" placeholder="correo@ejemplo.com"
                        value={data.email} onChange={(e) => onChange("email", e.target.value)}
                        className={errors.email ? "input-error" : ""} />
                    {errors.email && <span className="error-msg">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label>NIT <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(opcional)</span></label>
                    <input type="text" placeholder="0000-000000-000-0"
                        value={data.nit} onChange={(e) => onChange("nit", e.target.value)} />
                </div>
            </div>

            <div className="form-divider" />

            {/* ── Documento de Identidad ── */}
            <div className="form-section">
                <h3 className="section-title">Documento de Identidad</h3>

                <div className="form-group">
                    <label>Tipo de documento</label>
                    <select value={data.documentType} onChange={(e) => handleDocumentTypeChange(e.target.value)}
                        style={{ width:"100%", padding:"10px 14px", border:"1.5px solid var(--border)",
                            borderRadius:"var(--radius)", fontSize:"0.9rem", fontFamily:"'DM Sans', sans-serif",
                            color:"var(--navy)", background:"var(--bg)", outline:"none", cursor:"pointer" }}>
                        {DOCUMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                {/* DUI */}
                {data.documentType === "DUI" && (
                    <>
                        <div className="form-group">
                            <label>
                                Numero de DUI
                                <span style={{ fontSize:"0.75rem", color:"var(--text-muted)", marginLeft:"6px", fontWeight:400 }}>
                                    ({data.duiNumber.length}/{cfg.maxLength} {cfg.label})
                                </span>
                            </label>
                            <input type="text" inputMode="numeric" placeholder={cfg.placeholder}
                                value={data.duiNumber} maxLength={cfg.maxLength}
                                onChange={(e) => handleDocumentNumber("duiNumber", e.target.value, true, 9)}
                                className={errors.duiNumber ? "input-error" : ""} />
                            {errors.duiNumber && <span className="error-msg">{errors.duiNumber}</span>}
                        </div>
                        <ImageUploadField label="DUI - Parte frontal" fieldName="duiFront"
                            preview={data.duiFrontPreview} error={errors.duiFront} onChange={onChange}
                            hint="Foto clara de la parte delantera de tu DUI" />
                        <ImageUploadField label="DUI - Parte trasera" fieldName="duiBack"
                            preview={data.duiBackPreview} error={errors.duiBack} onChange={onChange}
                            hint="Foto clara de la parte trasera de tu DUI" />
                    </>
                )}

                {/* Pasaporte */}
                {data.documentType === "Pasaporte" && (
                    <>
                        <div className="form-group">
                            <label>
                                Numero de Pasaporte
                                <span style={{ fontSize:"0.75rem", color:"var(--text-muted)", marginLeft:"6px", fontWeight:400 }}>
                                    ({data.passportNumber.length}/{cfg.maxLength} {cfg.label})
                                </span>
                            </label>
                            <input type="text" placeholder={cfg.placeholder}
                                value={data.passportNumber} maxLength={cfg.maxLength}
                                onChange={(e) => handleDocumentNumber("passportNumber", e.target.value, false, 9)}
                                className={errors.passportNumber ? "input-error" : ""}
                                style={{ textTransform:"uppercase" }} />
                            {errors.passportNumber && <span className="error-msg">{errors.passportNumber}</span>}
                        </div>
                        <ImageUploadField label="Foto del Pasaporte" fieldName="passportPhoto"
                            preview={data.passportPhotoPreview} error={errors.passportPhoto} onChange={onChange}
                            hint="Foto de la doble pagina de tu pasaporte en una sola imagen" />
                    </>
                )}

                {/* Residencia */}
                {data.documentType === "Residencia" && (
                    <>
                        <div className="form-group">
                            <label>
                                Numero de Carnet de Residencia
                                <span style={{ fontSize:"0.75rem", color:"var(--text-muted)", marginLeft:"6px", fontWeight:400 }}>
                                    ({data.residenceNumber.length}/{cfg.maxLength} {cfg.label})
                                </span>
                            </label>
                            <input type="text" inputMode="numeric" placeholder={cfg.placeholder}
                                value={data.residenceNumber} maxLength={cfg.maxLength}
                                onChange={(e) => handleDocumentNumber("residenceNumber", e.target.value, true, 10)}
                                className={errors.residenceNumber ? "input-error" : ""} />
                            {errors.residenceNumber && <span className="error-msg">{errors.residenceNumber}</span>}
                        </div>
                        <ImageUploadField label="Carnet - Parte frontal" fieldName="residenceFront"
                            preview={data.residenceFrontPreview} error={errors.residenceFront} onChange={onChange}
                            hint="Foto clara de la parte delantera de tu carnet" />
                        <ImageUploadField label="Carnet - Parte trasera" fieldName="residenceBack"
                            preview={data.residenceBackPreview} error={errors.residenceBack} onChange={onChange}
                            hint="Foto clara de la parte trasera de tu carnet" />
                    </>
                )}

                <ImageUploadField label="Selfie sosteniendo tu documento" fieldName="selfieWithDocument"
                    preview={data.selfieWithDocumentPreview} error={errors.selfieWithDocument} onChange={onChange}
                    hint="Foto tuya sosteniendo tu documento junto a tu rostro" />
            </div>

            <div className="form-divider" />

            {/* ── Datos Bancarios ── */}
            <div className="form-section">
                <h3 className="section-title">Datos Bancarios</h3>
                <p style={{ fontSize:"0.82rem", color:"var(--text-muted)", marginBottom:"16px" }}>
                    Esta informacion se usara para transferirte los pagos de tus ventas.
                </p>

                <div className="form-group">
                    <label>Nombre del titular de la cuenta</label>
                    <input type="text" placeholder="Nombre exacto como aparece en la cuenta"
                        value={data.accountHolderName} onChange={(e) => onChange("accountHolderName", e.target.value)}
                        className={errors.accountHolderName ? "input-error" : ""} />
                    {errors.accountHolderName && <span className="error-msg">{errors.accountHolderName}</span>}
                </div>

                <div className="form-group">
                    <label>Numero de cuenta</label>
                    <input type="text" inputMode="numeric" placeholder="Ingrese el numero de cuenta"
                        value={data.accountNumber}
                        onChange={(e) => onChange("accountNumber", e.target.value.replace(/\D/g, ""))}
                        className={errors.accountNumber ? "input-error" : ""} />
                    {errors.accountNumber && <span className="error-msg">{errors.accountNumber}</span>}
                </div>

                <div className="form-group">
                    <label>Banco</label>
                    <select value={data.bankName} onChange={(e) => onChange("bankName", e.target.value)}
                        style={{ width:"100%", padding:"10px 14px",
                            border:`1.5px solid ${errors.bankName ? "var(--error)" : "var(--border)"}`,
                            borderRadius:"var(--radius)", fontSize:"0.9rem", fontFamily:"'DM Sans', sans-serif",
                            color: data.bankName ? "var(--navy)" : "var(--text-muted)",
                            background:"var(--bg)", outline:"none", cursor:"pointer" }}>
                        <option value="">Seleccione su banco</option>
                        {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                    {errors.bankName && <span className="error-msg">{errors.bankName}</span>}
                </div>

                <div className="form-group">
                    <label>Tipo de cuenta</label>
                    <div style={{ display:"flex", gap:"12px" }}>
                        {["Ahorros", "Corriente"].map((type) => (
                            <label key={type} style={{
                                flex:1, display:"flex", alignItems:"center", justifyContent:"center",
                                gap:"8px", padding:"10px",
                                border:`1.5px solid ${data.accountType === type ? "var(--navy)" : "var(--border)"}`,
                                borderRadius:"var(--radius)", cursor:"pointer",
                                background: data.accountType === type ? "var(--navy)" : "var(--bg)",
                                color: data.accountType === type ? "var(--white)" : "var(--navy)",
                                fontSize:"0.875rem", fontWeight:"500", transition:"all 0.2s",
                            }}>
                                <input type="radio" name="accountType" value={type}
                                    checked={data.accountType === type}
                                    onChange={() => onChange("accountType", type)}
                                    style={{ display:"none" }} />
                                {type}
                            </label>
                        ))}
                    </div>
                    {errors.accountType && <span className="error-msg">{errors.accountType}</span>}
                </div>
            </div>

            <div className="form-divider" />

            {/* ── Terminos y Condiciones ── */}
            <div className="form-section">
                <h3 className="section-title">Terminos y Condiciones</h3>
                <p style={{ fontSize:"0.82rem", color:"var(--text-muted)", marginBottom:"16px" }}>
                    Lee y acepta cada uno de los siguientes documentos para continuar.
                </p>

                {TERM_ITEMS.map(({ key, label }) => (
                    <div key={key} style={{ marginBottom:"12px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                            <input type="checkbox" id={key} checked={data[key]}
                                onChange={(e) => onChange(key, e.target.checked)}
                                style={{ width:"16px", height:"16px", accentColor:"var(--navy)", cursor:"pointer", flexShrink:0 }} />
                            <label htmlFor={key} style={{ fontSize:"0.85rem", color:"var(--navy)", cursor:"pointer" }}>
                                Acepto los{" "}
                                <button type="button" onClick={() => setOpenModal(key)}
                                    style={{ background:"none", border:"none", color:"#2563eb", cursor:"pointer",
                                        fontSize:"0.85rem", fontWeight:"600", padding:0, textDecoration:"underline" }}>
                                    {label}
                                </button>
                            </label>
                        </div>
                        {errors[key] && <span className="error-msg" style={{ marginLeft:"26px" }}>{errors[key]}</span>}
                    </div>
                ))}
            </div>

            {openModal && <TermsModal termKey={openModal} onClose={() => setOpenModal(null)} />}
        </div>
    );
};

export default RegisterForm;