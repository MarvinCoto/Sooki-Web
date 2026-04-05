import { API_URL } from "../utils/api";

export const getCategoriesService = async () => {
    const res = await fetch(`${API_URL}/categories/store`, { credentials: "include" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error fetching categories");
    return data;
};

export const createCategoryService = async (payload) => {
    const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error creating category");
    return data;
};

export const updateCategoryService = async (id, payload) => {
    const res = await fetch(`${API_URL}/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error updating category");
    return data;
};

export const deleteCategoryService = async (id) => {
    const res = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error deleting category");
    return data;
};