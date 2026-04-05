import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const useRecovery = () => {
    const [step, setStep] = useState(1); // 1: email, 2: codigo, 3: nueva password
    const [email, setEmail] = useState("");
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    const navigate = useNavigate();

    // Paso 1 — solicitar codigo
    const handleRequestCode = async () => {
        setFieldErrors({});
        if (!email.trim()) {
            setFieldErrors({ email: "El correo es requerido" });
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
            setFieldErrors({ email: "Correo invalido" });
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/recoveryPassword/requestCode`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email: email.trim() }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Error al enviar codigo");
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Paso 2 — verificar codigo
    const handleVerifyCode = async () => {
        const fullCode = code.join("");
        if (fullCode.length < 6) {
            setError("Ingresa los 6 digitos del codigo");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/recoveryPassword/verifyCode`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ code: fullCode }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Codigo incorrecto");
            setStep(3);
        } catch (err) {
            setError(err.message);
            setCode(["", "", "", "", "", ""]);
        } finally {
            setLoading(false);
        }
    };

    // Paso 3 — nueva contraseña
    const handleNewPassword = async () => {
        setFieldErrors({});
        const errs = {};
        if (!newPassword) errs.newPassword = "La contrasena es requerida";
        else if (newPassword.length < 8) errs.newPassword = "Minimo 8 caracteres";
        if (!confirmPassword) errs.confirmPassword = "Confirme su contrasena";
        else if (newPassword !== confirmPassword) errs.confirmPassword = "Las contrasenas no coinciden";

        if (Object.keys(errs).length > 0) {
            setFieldErrors(errs);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/recoveryPassword/newPassword`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ password: newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Error al actualizar contrasena");
            navigate("/login");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Manejo del input de codigo
    const inputsRef = { current: [] };

    const handleCodeChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        if (value && index < 5) inputsRef.current[index + 1]?.focus();
    };

    const handleCodeKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleCodePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const newCode = [...code];
        pasted.split("").forEach((char, i) => { newCode[i] = char; });
        setCode(newCode);
    };

    return {
        step,
        email, setEmail,
        code,
        newPassword, setNewPassword,
        confirmPassword, setConfirmPassword,
        showPassword, setShowPassword,
        loading,
        error,
        fieldErrors,
        inputsRef,
        handleRequestCode,
        handleVerifyCode,
        handleNewPassword,
        handleCodeChange,
        handleCodeKeyDown,
        handleCodePaste,
    };
};