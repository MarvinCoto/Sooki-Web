import { API_URL } from "../utils/api";

export const loginService = async (email, password, rememberMe = false) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, rememberMe }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al iniciar sesion");
    return data;
};