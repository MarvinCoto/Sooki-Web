import { API_URL } from "../utils/api";

export const getProductsService = async () => {
    const res = await fetch(`${API_URL}/products/store`, { credentials: "include" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error fetching products");
    return data;
};

export const getProductByIdService = async (id) => {
    const res = await fetch(`${API_URL}/products/${id}`, { credentials: "include" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error fetching product");
    return data;
};

export const createProductService = async (formData) => {
    const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error creating product");
    return data;
};

export const updateProductService = async (id, formData) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error updating product");
    return data;
};

export const deleteProductService = async (id) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error deleting product");
    return data;
};

export const toggleProductStatusService = async (id) => {
    const res = await fetch(`${API_URL}/products/${id}/toggle`, {
        method: "PATCH",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error toggling status");
    return data;
};