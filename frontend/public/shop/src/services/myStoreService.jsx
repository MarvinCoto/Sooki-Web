import { API_URL } from "../utils/api";

export const getMyStoreService = async () => {
    const res = await fetch(`${API_URL}/mystore`, { credentials: "include" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error fetching store");
    return data;
};

export const updateStoreInfoService = async (formData) => {
    const res = await fetch(`${API_URL}/mystore/info`, {
        method: "PUT",
        credentials: "include",
        body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error updating store");
    return data;
};

export const updateAboutService = async (formData) => {
    const res = await fetch(`${API_URL}/mystore/about`, {
        method: "PUT",
        credentials: "include",
        body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error updating about");
    return data;
};