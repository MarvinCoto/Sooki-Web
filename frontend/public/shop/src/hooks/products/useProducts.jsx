import { useState, useEffect, useCallback } from "react";
import {
    getProductsService,
    createProductService,
    updateProductService,
    deleteProductService,
    toggleProductStatusService,
} from "../../services/productsService";
import { getCategoriesService } from "../../services/categoriesService";

const STOCK_LOW = 5;

export const getStockStatus = (stock) => {
    if (stock === 0) return "out";
    if (stock < STOCK_LOW) return "low";
    return "ok";
};

const emptyForm = {
    name: "",
    description: "",
    idCategory: "",
    basePrice: "",
    status: true,
    images: [],
    previews: [],
    discountPercentage: "",
    discountActive: false,
};

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal
    const [modal, setModal] = useState({ open: false, type: null, product: null });
    // type: "create" | "edit" | "delete" | "detail"

    const [form, setForm] = useState(emptyForm);
    const [formErrors, setFormErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const fetchAll = useCallback(async () => {
        try {
            setLoading(true);
            const [prods, cats] = await Promise.all([
                getProductsService(),
                getCategoriesService(),
            ]);
            setProducts(prods);
            // Aplanar categorias (padre + hijos) para el select
            const flat = [];
            cats.forEach((cat) => {
                flat.push(cat);
                if (cat.children) cat.children.forEach((child) => flat.push(child));
            });
            setCategories(flat);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

    const openModal = (type, product = null) => {
        setFormErrors({});
        if (type === "edit" && product) {
            setForm({
                name: product.name,
                description: product.description || "",
                idCategory: product.idCategory?._id || product.idCategory || "",
                basePrice: product.basePrice,
                status: product.status,
                images: [],
                previews: product.images || [],
                discountPercentage: product.discount?.percentage || "",
                discountActive: product.discount?.active || false,
            });
        } else {
            setForm(emptyForm);
        }
        setModal({ open: true, type, product });
    };

    const closeModal = () => {
        setModal({ open: false, type: null, product: null });
        setForm(emptyForm);
        setFormErrors({});
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const total = form.previews.length + files.length;
        if (total > 5) {
            setFormErrors((prev) => ({ ...prev, images: "Maximo 5 imagenes permitidas" }));
            return;
        }
        const newPreviews = files.map((f) => URL.createObjectURL(f));
        setForm((prev) => ({
            ...prev,
            images: [...prev.images, ...files],
            previews: [...prev.previews, ...newPreviews],
        }));
        setFormErrors((prev) => ({ ...prev, images: null }));
    };

    const removePreview = (index) => {
        setForm((prev) => ({
            ...prev,
            previews: prev.previews.filter((_, i) => i !== index),
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = "El nombre es requerido";
        else if (form.name.trim().length < 2) errs.name = "Minimo 2 caracteres";
        if (!form.idCategory) errs.idCategory = "La categoria es requerida";
        if (!form.basePrice) errs.basePrice = "El precio es requerido";
        else if (isNaN(form.basePrice) || parseFloat(form.basePrice) < 0) errs.basePrice = "Precio invalido";
        setFormErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append("name", form.name.trim());
            fd.append("description", form.description.trim());
            fd.append("idCategory", form.idCategory);
            fd.append("basePrice", form.basePrice);
            fd.append("status", form.status);
            fd.append("discount", JSON.stringify({
                percentage: form.discountPercentage || 0,
                active: form.discountActive,
            }));
            form.images.forEach((img) => fd.append("images", img));

            if (modal.type === "edit") {
                fd.append("keepImages", "true");
                await updateProductService(modal.product._id, fd);
            } else {
                await createProductService(fd);
            }
            await fetchAll();
            closeModal();
        } catch (err) {
            setFormErrors((prev) => ({ ...prev, general: err.message }));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setSaving(true);
        try {
            await deleteProductService(modal.product._id);
            await fetchAll();
            closeModal();
        } catch (err) {
            setFormErrors({ general: err.message });
        } finally {
            setSaving(false);
        }
    };

    const handleToggleStatus = async (productId) => {
        try {
            await toggleProductStatusService(productId);
            setProducts((prev) =>
                prev.map((p) => p._id === productId ? { ...p, status: !p.status } : p)
            );
        } catch (err) {
            setError(err.message);
        }
    };

    return {
        products,
        categories,
        loading,
        error,
        modal,
        form,
        formErrors,
        saving,
        openModal,
        closeModal,
        updateForm,
        handleImageChange,
        removePreview,
        handleSave,
        handleDelete,
        handleToggleStatus,
        getStockStatus,
        STOCK_LOW,
    };
};