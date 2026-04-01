import { API_URL } from "../utils/api";

export const getSetupDataService = async (token) => {
    const response = await fetch(`${API_URL}/stores/setup-credentials?token=${token}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error validating token");
    return data;
};

export const setupCredentialsService = async (formData) => {
    const response = await fetch(`${API_URL}/stores/setup-credentials`, {
        method: "POST",
        body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error setting up credentials");
    return data;
};