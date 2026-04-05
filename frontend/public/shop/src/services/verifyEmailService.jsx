import { API_URL } from "../utils/api";

export const verifyEmailService = async (email, code) => {
    const response = await fetch(`${API_URL}/stores/verifyEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error verifying email");
    return data;
};

export const resendCodeService = async (email) => {
    const response = await fetch(`${API_URL}/stores/resendCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error resending code");
    return data;
};