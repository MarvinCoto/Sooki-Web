import { useState } from "react";
import { registerStoreService } from "../../services/registerStoreService";

const TEMPLATES = [
    { id: "minimalista", label: "Minimalista", desc: "Diseño limpio y simple" },
    { id: "moderna", label: "Moderna", desc: "Estilo contemporáneo" },
    { id: "gaming", label: "Gaming / Tech", desc: "Para tecnología" },
    { id: "moda", label: "Moda", desc: "Elegante y sofisticado" },
    { id: "comida", label: "Comida", desc: "Para restaurantes" },
];

const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
    return color;
};

export const useRegisterStore = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState("");

    const [step1, setStep1] = useState({
        storeName: "",
        logo: null,
        logoPreview: null,
        ownerName: "",
        phoneNumber: "",
        hasPhysicalStore: false,
        location: "",
    });

    const [step2, setStep2] = useState({
        design: "minimalista",
        colors: [getRandomColor(), getRandomColor(), getRandomColor()],
    });

    const [step3, setStep3] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });

    const nextStep = () => setStep((s) => Math.min(s + 1, 4));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    const updateStep1 = (field, value) =>
        setStep1((prev) => ({ ...prev, [field]: value }));
    const updateStep2 = (field, value) =>
        setStep2((prev) => ({ ...prev, [field]: value }));
    const updateStep3 = (field, value) =>
        setStep3((prev) => ({ ...prev, [field]: value }));

    const updateColor = (index, color) => {
        const newColors = [...step2.colors];
        newColors[index] = color;
        setStep2((prev) => ({ ...prev, colors: newColors }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("storeName", step1.storeName);
            formData.append("logo", step1.logo);
            formData.append("ownerName", step1.ownerName);
            formData.append("phoneNumber", step1.phoneNumber);
            if (step1.hasPhysicalStore && step1.location) {
                formData.append("location", step1.location);
            }
            formData.append("design", step2.design);
            formData.append("colors", JSON.stringify(step2.colors));
            formData.append("email", step3.email);
            formData.append("username", step3.username);
            formData.append("password", step3.password);

            await registerStoreService(formData);

            setRegisteredEmail(step3.email);
            setStep(4);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifySuccess = () => {
        setSuccess(true);
    };

    return {
        step,
        loading,
        error,
        success,
        registeredEmail,
        step1,
        step2,
        step3,
        TEMPLATES,
        nextStep,
        prevStep,
        updateStep1,
        updateStep2,
        updateStep3,
        updateColor,
        handleSubmit,
        handleVerifySuccess,
    };
};