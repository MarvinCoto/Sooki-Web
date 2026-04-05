import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginService } from "../../services/loginService";

export const useLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    const { login } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!email.trim())
            newErrors.email = "El correo es requerido";
        else if (!/^\S+@\S+\.\S+$/.test(email.trim()))
            newErrors.email = "Correo invalido";
        if (!password)
            newErrors.password = "La contrasena es requerida";
        else if (password.length < 8)
            newErrors.password = "Minimo 8 caracteres";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        setError(null);
        if (!validate()) return;

        setLoading(true);
        try {
            const data = await loginService(email.trim(), password, rememberMe);
            login(data.user);

            if (data.user.userType === "admin") {
                navigate("/admin/dashboard");
            } else if (data.user.userType === "store") {
                navigate("/dashboard");
            } else {
                navigate("/");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSubmit();
    };

    return {
        email, setEmail,
        password, setPassword,
        rememberMe, setRememberMe,
        showPassword, setShowPassword,
        loading,
        error,
        errors,
        handleSubmit,
        handleKeyDown,
    };
};