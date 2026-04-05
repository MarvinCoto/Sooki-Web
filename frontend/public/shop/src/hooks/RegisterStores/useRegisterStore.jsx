import { useState } from "react";
import { registerStoreService } from "../../services/registerStoreService";

export const useRegisterStore = () => {
    const [stage, setStage] = useState("form");   // "form" | "verify" | "pending"
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [registeredEmail, setRegisteredEmail] = useState("");

    const [formData, setFormData] = useState({
        // Info personal
        ownerName: "",
        phoneNumber: "",
        email: "",
        nit: "",

        // Documento
        documentType: "DUI",

        // DUI
        duiNumber: "",
        duiFront: null,
        duiFrontPreview: null,
        duiBack: null,
        duiBackPreview: null,

        // Pasaporte
        passportNumber: "",
        passportPhoto: null,
        passportPhotoPreview: null,

        // Residencia
        residenceNumber: "",
        residenceFront: null,
        residenceFrontPreview: null,
        residenceBack: null,
        residenceBackPreview: null,

        // Selfie (todos los tipos)
        selfieWithDocument: null,
        selfieWithDocumentPreview: null,

        // Datos bancarios
        accountHolderName: "",
        accountNumber: "",
        bankName: "",
        accountType: "",

        // Terminos
        acceptedTerms: false,
        acceptedPrivacyPolicy: false,
        acceptedSellerPolicy: false,
        acceptedProhibitedProducts: false,
    });

    const updateField = (field, value) =>
        setFormData((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = new FormData();

            // Info personal
            data.append("ownerName", formData.ownerName);
            data.append("phoneNumber", formData.phoneNumber);
            data.append("email", formData.email);
            if (formData.nit) data.append("nit", formData.nit);

            // Documento
            data.append("documentType", formData.documentType);

            if (formData.documentType === "DUI") {
                data.append("duiNumber", formData.duiNumber);
                data.append("duiFront", formData.duiFront);
                data.append("duiBack", formData.duiBack);
            } else if (formData.documentType === "Pasaporte") {
                data.append("passportNumber", formData.passportNumber);
                data.append("passportPhoto", formData.passportPhoto);
            } else if (formData.documentType === "Residencia") {
                data.append("residenceNumber", formData.residenceNumber);
                data.append("residenceFront", formData.residenceFront);
                data.append("residenceBack", formData.residenceBack);
            }

            data.append("selfieWithDocument", formData.selfieWithDocument);

            // Datos bancarios
            data.append("accountHolderName", formData.accountHolderName);
            data.append("accountNumber", formData.accountNumber);
            data.append("bankName", formData.bankName);
            data.append("accountType", formData.accountType);

            // Terminos
            data.append("acceptedTerms", formData.acceptedTerms);
            data.append("acceptedPrivacyPolicy", formData.acceptedPrivacyPolicy);
            data.append("acceptedSellerPolicy", formData.acceptedSellerPolicy);
            data.append("acceptedProhibitedProducts", formData.acceptedProhibitedProducts);

            await registerStoreService(data);

            setRegisteredEmail(formData.email);
            setStage("verify");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifySuccess = () => setStage("pending");

    return {
        stage,
        loading,
        error,
        registeredEmail,
        formData,
        updateField,
        handleSubmit,
        handleVerifySuccess,
        setError,
    };
};