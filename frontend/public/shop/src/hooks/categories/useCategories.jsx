import { useState, useEffect, useCallback } from "react";
import {
    getCategoriesService,
    createCategoryService,
    updateCategoryService,
    deleteCategoryService,
} from "../../services/categoriesService";

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [modal, setModal] = useState({ open: false, type: null, data: null, parentId: null });
    // type: "create-parent" | "create-child" | "edit" | "delete"

    const [formName, setFormName] = useState("");
    const [formError, setFormError] = useState(null);
    const [saving, setSaving] = useState(false);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getCategoriesService();
            setCategories(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    const openModal = (type, data = null, parentId = null) => {
        setFormName(type === "edit" ? data.name : "");
        setFormError(null);
        setModal({ open: true, type, data, parentId });
    };

    const closeModal = () => {
        setModal({ open: false, type: null, data: null, parentId: null });
        setFormName("");
        setFormError(null);
    };

    const handleSave = async () => {
        if (!formName.trim() || formName.trim().length < 2) {
            setFormError("El nombre debe tener al menos 2 caracteres");
            return;
        }

        setSaving(true);
        setFormError(null);
        try {
            if (modal.type === "edit") {
                await updateCategoryService(modal.data._id, { name: formName.trim() });
            } else {
                await createCategoryService({
                    name: formName.trim(),
                    parent: modal.parentId || null,
                });
            }
            await fetchCategories();
            closeModal();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setSaving(true);
        try {
            await deleteCategoryService(modal.data._id);
            await fetchCategories();
            closeModal();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return {
        categories,
        loading,
        error,
        modal,
        formName, setFormName,
        formError,
        saving,
        openModal,
        closeModal,
        handleSave,
        handleDelete,
    };
};