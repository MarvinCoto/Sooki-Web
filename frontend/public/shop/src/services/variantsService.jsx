import { API_URL } from "../utils/api";

// ─── ATTRIBUTES ───────────────────────────────────────────

export const getAttributesService = async () => {
    const res = await fetch(`${API_URL}/variants/attributes`, { credentials: "include" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error fetching attributes");
    return data;
};

export const createAttributeService = async (name) => {
    const res = await fetch(`${API_URL}/variants/attributes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error creating attribute");
    return data;
};

export const updateAttributeService = async (id, name) => {
    const res = await fetch(`${API_URL}/variants/attributes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error updating attribute");
    return data;
};

export const deleteAttributeService = async (id) => {
    const res = await fetch(`${API_URL}/variants/attributes/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error deleting attribute");
    return data;
};

// ─── ATTRIBUTE VALUES ─────────────────────────────────────

export const createValueService = async (attributeId, value) => {
    const res = await fetch(`${API_URL}/variants/attributes/${attributeId}/values`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ value }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error creating value");
    return data;
};

export const deleteValueService = async (valueId) => {
    const res = await fetch(`${API_URL}/variants/values/${valueId}`, {
        method: "DELETE",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error deleting value");
    return data;
};

// ─── VARIANTS ─────────────────────────────────────────────

export const getVariantsService = async (productId) => {
    const res = await fetch(`${API_URL}/variants/product/${productId}`, { credentials: "include" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error fetching variants");
    return data;
};

export const createVariantService = async (productId, payload) => {
    const res = await fetch(`${API_URL}/variants/product/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error creating variant");
    return data;
};

export const updateVariantService = async (variantId, payload) => {
    const res = await fetch(`${API_URL}/variants/${variantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error updating variant");
    return data;
};

export const deleteVariantService = async (variantId) => {
    const res = await fetch(`${API_URL}/variants/${variantId}`, {
        method: "DELETE",
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error deleting variant");
    return data;
};