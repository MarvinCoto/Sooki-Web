import { useState } from "react";

export const useRegisterStoreForm = () => {
    const [errors, setErrors] = useState({});

    const clearErrors = () => setErrors({});

    const validateForm = (data) => {
        const newErrors = {};

        const str = (val) => (val ?? "").toString().trim();

        // Info personal
        if (!str(data.ownerName))
            newErrors.ownerName = "El nombre del propietario es requerido";
        else if (str(data.ownerName).length < 2)
            newErrors.ownerName = "Minimo 2 caracteres";

        if (!str(data.phoneNumber))
            newErrors.phoneNumber = "El telefono es requerido";
        else if (!/^\+?[\d\s\-]{7,20}$/.test(str(data.phoneNumber)))
            newErrors.phoneNumber = "Formato invalido. Ej: +503 0000-0000";

        if (!str(data.email))
            newErrors.email = "El correo es requerido";
        else if (!/^\S+@\S+\.\S+$/.test(str(data.email)))
            newErrors.email = "Correo electronico invalido";

        // Documento
        if (data.documentType === "DUI") {
            if (!str(data.duiNumber))
                newErrors.duiNumber = "El numero de DUI es requerido";
            if (!data.duiFront)
                newErrors.duiFront = "La foto frontal del DUI es requerida";
            if (!data.duiBack)
                newErrors.duiBack = "La foto trasera del DUI es requerida";
        } else if (data.documentType === "Pasaporte") {
            if (!str(data.passportNumber))
                newErrors.passportNumber = "El numero de pasaporte es requerido";
            if (!data.passportPhoto)
                newErrors.passportPhoto = "La foto del pasaporte es requerida";
        } else if (data.documentType === "Residencia") {
            if (!str(data.residenceNumber))
                newErrors.residenceNumber = "El numero de carnet es requerido";
            if (!data.residenceFront)
                newErrors.residenceFront = "La foto frontal del carnet es requerida";
            if (!data.residenceBack)
                newErrors.residenceBack = "La foto trasera del carnet es requerida";
        }

        if (!data.selfieWithDocument)
            newErrors.selfieWithDocument = "La selfie con documento es requerida";

        // Datos bancarios
        if (!str(data.accountHolderName))
            newErrors.accountHolderName = "El nombre del titular es requerido";
        if (!str(data.accountNumber))
            newErrors.accountNumber = "El numero de cuenta es requerido";
        if (!str(data.bankName))
            newErrors.bankName = "El banco es requerido";
        if (!data.accountType)
            newErrors.accountType = "El tipo de cuenta es requerido";

        // Terminos
        if (!data.acceptedTerms)
            newErrors.acceptedTerms = "Debe aceptar los terminos y condiciones";
        if (!data.acceptedPrivacyPolicy)
            newErrors.acceptedPrivacyPolicy = "Debe aceptar la politica de privacidad";
        if (!data.acceptedSellerPolicy)
            newErrors.acceptedSellerPolicy = "Debe aceptar la politica del vendedor";
        if (!data.acceptedProhibitedProducts)
            newErrors.acceptedProhibitedProducts = "Debe aceptar la politica de productos prohibidos";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return { errors, clearErrors, validateForm };
};