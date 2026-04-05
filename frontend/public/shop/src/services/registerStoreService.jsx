import { API_URL } from "../utils/api";

export const registerStoreService = async (formData) => {
    const response = await fetch(`${API_URL}/stores/insertStore`, {
        method: "POST",
        body: formData, // FormData (multipart for logo upload)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error registering store");
    }

    return data;
};