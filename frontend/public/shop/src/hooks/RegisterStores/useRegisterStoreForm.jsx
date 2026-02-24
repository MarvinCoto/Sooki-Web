import { useState } from "react";

export const useRegisterStoreForm = () => {
    const [errors, setErrors] = useState({});

    const clearErrors = () => setErrors({});

    const validateStep1 = (data) => {
        const newErrors = {};

        if (!data.storeName.trim())
            newErrors.storeName = "El nombre de la tienda es requerido";
        else if (data.storeName.trim().length < 2)
            newErrors.storeName = "Mínimo 2 caracteres";

        if (!data.logo)
            newErrors.logo = "El logo es requerido";

        if (!data.ownerName.trim())
            newErrors.ownerName = "El nombre del propietario es requerido";
        else if (data.ownerName.trim().length < 2)
            newErrors.ownerName = "Mínimo 2 caracteres";

        if (!data.phoneNumber.trim())
            newErrors.phoneNumber = "El teléfono es requerido";
        else if (!/^\+?[\d\s\-]{7,20}$/.test(data.phoneNumber))
            newErrors.phoneNumber = "Formato inválido. Ej: +503 0000-0000";

        if (data.hasPhysicalStore && data.location && data.location.trim().length < 3)
            newErrors.location = "Ingrese una dirección válida";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep3 = (data) => {
        const newErrors = {};

        if (!data.email.trim())
            newErrors.email = "El correo es requerido";
        else if (!/^\S+@\S+\.\S+$/.test(data.email))
            newErrors.email = "Correo electrónico inválido";

        if (!data.username.trim())
            newErrors.username = "El usuario es requerido";
        else if (data.username.trim().length < 3)
            newErrors.username = "Mínimo 3 caracteres";
        else if (data.username.trim().length > 30)
            newErrors.username = "Máximo 30 caracteres";

        if (!data.password)
            newErrors.password = "La contraseña es requerida";
        else if (data.password.length < 8)
            newErrors.password = "Mínimo 8 caracteres";

        if (!data.confirmPassword)
            newErrors.confirmPassword = "Confirme su contraseña";
        else if (data.password !== data.confirmPassword)
            newErrors.confirmPassword = "Las contraseñas no coinciden";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return {
        errors,
        clearErrors,
        validateStep1,
        validateStep3,
    };
};