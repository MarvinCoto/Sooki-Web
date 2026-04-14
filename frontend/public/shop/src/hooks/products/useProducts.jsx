import { useState, useEffect, useCallback } from "react";
import {
    getProductsService,
    createProductService,
    updateProductService,
    deleteProductService,
    toggleProductStatusService,
} from "../../services/productsService";
import { getCategoriesService } from "../../services/categoriesService";
import { useAlert } from "../../context/AlertContext";

const STOCK_LOW = 5;

export const getStockStatus = (stock) => {
    if (stock === 0) return "out";
    if (stock < STOCK_LOW) return "low";
    return "ok";
};

export const formatPrice = (product) => {
    if (!product.minPrice) return "Sin precio";
    const price = product.hasMultiplePrices
        ? `Desde $${parseFloat(product.minPrice).toFixed(2)}`
        : `$${parseFloat(product.minPrice).toFixed(2)}`;

    if (product.discount?.active && product.discount?.percentage) {
        const final = product.minPrice - (product.minPrice * product.discount.percentage / 100);
        return { original: price, discounted: `$${final.toFixed(2)}`, percentage: product.discount.percentage };
    }
    return { original: price, discounted: null };
};

const emptyForm = {
    name: "",
    description: "",
    idCategory: "",
    status: false,
    images: [],
    previews: [],
    discountPercentage: "",
    discountActive: false,
    // Variante inicial — solo en create
    variantPrice: "",
    variantStock: "",
};

export const useProducts = () => {
    const { showAlert } = useAlert();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [modal, setModal] = useState({ open: false, type: null, product: null });
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
                status: product.status,
                images: [],
                previews: product.images || [],
                discountPercentage: product.discount?.percentage || "",
                discountActive: product.discount?.active || false,
                variantPrice: "",
                variantStock: "",
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

        // Variante inicial solo requerida en create
        if (modal.type === "create") {
            if (!form.variantPrice) errs.variantPrice = "El precio es requerido";
            else if (isNaN(form.variantPrice) || parseFloat(form.variantPrice) < 0) errs.variantPrice = "Precio invalido";
            if (form.variantStock !== "" && (isNaN(form.variantStock) || parseInt(form.variantStock) < 0)) {
                errs.variantStock = "Stock invalido";
            }
        }

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
            fd.append("status", form.status);
            fd.append("discount", JSON.stringify({
                percentage: form.discountPercentage || 0,
                active: form.discountActive,
            }));
            form.images.forEach((img) => fd.append("images", img));

            if (modal.type === "create") {
                fd.append("variantPrice", form.variantPrice);
                fd.append("variantStock", form.variantStock || "0");
                await createProductService(fd);
                showAlert("success", `Producto "${form.name.trim()}" creado. Recuerda activarlo cuando este listo.`);
            } else {
                fd.append("keepImages", "true");
                await updateProductService(modal.product._id, fd);
                showAlert("success", `Producto "${form.name.trim()}" actualizado correctamente`);
            }

            await fetchAll();
            closeModal();
        } catch (err) {
            setFormErrors((prev) => ({ ...prev, general: err.message }));
            showAlert("error", err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        const productName = modal.product?.name;
        const productId = modal.product?._id;
        closeModal();
        showAlert(
            "delete",
            `¿Eliminar "${productName}"? Esta accion tambien eliminara todas sus variantes y no se puede deshacer.`,
            async () => {
                try {
                    await deleteProductService(productId);
                    await fetchAll();
                    showAlert("success", "Producto eliminado correctamente");
                } catch (err) {
                    showAlert("error", err.message);
                }
            }
        );
    };

    const handleToggleStatus = async (productId, productName) => {
        try {
            await toggleProductStatusService(productId);
            setProducts((prev) =>
                prev.map((p) => p._id === productId ? { ...p, status: !p.status } : p)
            );
            showAlert("success", `Estado de "${productName}" actualizado`);
        } catch (err) {
            showAlert("error", err.message);
        }
    };

    return {
        products, categories, loading, error,
        modal, form, formErrors, saving,
        openModal, closeModal, updateForm,
        handleImageChange, removePreview,
        handleSave, handleDelete, handleToggleStatus,
        getStockStatus, formatPrice, STOCK_LOW,
        fetchAll,
    };
};