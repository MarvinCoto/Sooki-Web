import { useState, useRef } from "react";
import { verifyEmailService, resendCodeService } from "../services/verifyEmailService";

export const useVerifyEmail = (email, onSuccess) => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState(null);
    const [resendMsg, setResendMsg] = useState(null);
    const [resendCooldown, setResendCooldown] = useState(0);
    const inputsRef = useRef([]);

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return; // solo dígitos
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // auto-focus siguiente
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const newCode = [...code];
        pasted.split("").forEach((char, i) => { newCode[i] = char; });
        setCode(newCode);
        inputsRef.current[Math.min(pasted.length, 5)]?.focus();
    };

    const handleVerify = async () => {
        const fullCode = code.join("");
        if (fullCode.length < 6) {
            setError("Ingresa los 6 dígitos del código");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await verifyEmailService(email, fullCode);
            onSuccess(data);
        } catch (err) {
            setError(err.message);
            setCode(["", "", "", "", "", ""]);
            inputsRef.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;
        setResendLoading(true);
        setResendMsg(null);
        setError(null);

        try {
            await resendCodeService(email);
            setResendMsg("Nuevo código enviado. Revisa tu correo.");
            // cooldown de 60 segundos
            setResendCooldown(60);
            const interval = setInterval(() => {
                setResendCooldown((prev) => {
                    if (prev <= 1) { clearInterval(interval); return 0; }
                    return prev - 1;
                });
            }, 1000);
        } catch (err) {
            setError(err.message);
        } finally {
            setResendLoading(false);
        }
    };

    return {
        code,
        loading,
        resendLoading,
        error,
        resendMsg,
        resendCooldown,
        inputsRef,
        handleChange,
        handleKeyDown,
        handlePaste,
        handleVerify,
        handleResend,
    };
};