import { useState, useEffect } from "react";
import { setupCredentialsService, getSetupDataService } from "../../services/setupCredentialsService";

const TEMPLATES = [
    { id: "minimalista", label: "Minimalista", desc: "Diseño limpio y simple" },
    { id: "moderna", label: "Moderna", desc: "Estilo contemporaneo" },
    { id: "gaming", label: "Gaming / Tech", desc: "Para tecnologia" },
    { id: "moda", label: "Moda", desc: "Elegante y sofisticado" },
    { id: "comida", label: "Comida", desc: "Para restaurantes" },
];

const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
    return color;
};

export const useSetupCredentials = (token) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [tokenError, setTokenError] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [ownerName, setOwnerName] = useState("");

    // Burbuja 1 - Info tienda
    const [storeInfo, setStoreInfo] = useState({
        storeName: "",
        logo: null,
        logoPreview: null,
        location: "",
    });

    // Burbuja 2 - Diseño
    const [design, setDesign] = useState({
        template: "minimalista",
        colors: [getRandomColor(), getRandomColor(), getRandomColor()],
    });

    // Burbuja 3 - Credenciales
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    });

    const [formErrors, setFormErrors] = useState({});

    // Verificar token al cargar
    useEffect(() => {
        if (!token) {
            setTokenError("Token no encontrado. Verifica el link de tu correo.");
            return;
        }
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getSetupDataService(token);
                setOwnerName(data.ownerName);
            } catch (err) {
                setTokenError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const updateStoreInfo = (field, value) =>
        setStoreInfo((prev) => ({ ...prev, [field]: value }));

    const updateDesign = (field, value) =>
        setDesign((prev) => ({ ...prev, [field]: value }));

    const updateColor = (index, color) => {
        const newColors = [...design.colors];
        newColors[index] = color;
        setDesign((prev) => ({ ...prev, colors: newColors }));
    };

    const updateCredentials = (field, value) =>
        setCredentials((prev) => ({ ...prev, [field]: value }));

    const validateStep1 = () => {
        const errs = {};
        if (!storeInfo.storeName.trim())
            errs.storeName = "El nombre de la tienda es requerido";
        else if (storeInfo.storeName.trim().length < 2)
            errs.storeName = "Minimo 2 caracteres";
        if (!storeInfo.logo)
            errs.logo = "El logo es requerido";
        setFormErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const validateStep3 = () => {
        const errs = {};
        if (!credentials.username.trim())
            errs.username = "El usuario es requerido";
        else if (credentials.username.trim().length < 3)
            errs.username = "Minimo 3 caracteres";
        if (!credentials.password)
            errs.password = "La contraseña es requerida";
        else if (credentials.password.length < 8)
            errs.password = "Minimo 8 caracteres";
        if (!credentials.confirmPassword)
            errs.confirmPassword = "Confirme su contraseña";
        else if (credentials.password !== credentials.confirmPassword)
            errs.confirmPassword = "Las contraseñas no coinciden";
        setFormErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const nextStep = () => {
        setFormErrors({});
        if (step === 1 && !validateStep1()) return;
        if (step === 2) { setStep(3); return; }
        setStep((s) => s + 1);
    };

    const prevStep = () => {
        setFormErrors({});
        setStep((s) => Math.max(s - 1, 1));
    };

    const handleSubmit = async () => {
        if (!validateStep3()) return;

        setSubmitLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("token", token);
            formData.append("storeName", storeInfo.storeName);
            if (storeInfo.location) formData.append("location", storeInfo.location);
            formData.append("logo", storeInfo.logo);
            formData.append("design", design.template);
            formData.append("colors", JSON.stringify(design.colors));
            formData.append("username", credentials.username);
            formData.append("password", credentials.password);

            await setupCredentialsService(formData);
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    return {
        step,
        loading,
        submitLoading,
        tokenError,
        error,
        success,
        ownerName,
        storeInfo,
        design,
        credentials,
        formErrors,
        TEMPLATES,
        nextStep,
        prevStep,
        updateStoreInfo,
        updateDesign,
        updateColor,
        updateCredentials,
        handleSubmit,
    };
};