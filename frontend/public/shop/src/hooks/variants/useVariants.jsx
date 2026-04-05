import { useState, useEffect, useCallback } from "react";
import {
    getAttributesService, createAttributeService, updateAttributeService, deleteAttributeService,
    createValueService, deleteValueService,
    getVariantsService, createVariantService, updateVariantService, deleteVariantService,
} from "../../services/variantsService";

export const useVariants = (productId) => {
    const [attributes, setAttributes] = useState([]);
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // UI state
    const [activeTab, setActiveTab] = useState("variants"); // "variants" | "attributes"

    // Attribute form
    const [attrForm, setAttrForm] = useState({ open: false, name: "", editId: null, error: null, saving: false });

    // Value form
    const [valueForm, setValueForm] = useState({ open: false, attributeId: null, value: "", error: null, saving: false });

    // Variant form
    const [variantForm, setVariantForm] = useState({
        open: false,
        editId: null,
        price: "",
        stock: "",
        status: true,
        selectedAttrs: {}, // { attributeId: valueId }
        error: null,
        saving: false,
    });

    // Delete confirm
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: null, id: null, name: "" });

    const fetchAll = useCallback(async () => {
        if (!productId) return;
        try {
            setLoading(true);
            const [attrs, vars] = await Promise.all([
                getAttributesService(),
                getVariantsService(productId),
            ]);
            setAttributes(attrs);
            setVariants(vars);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ─── ATTRIBUTES ───────────────────────────────────────

    const openAttrForm = (attr = null) => {
        setAttrForm({ open: true, name: attr ? attr.name : "", editId: attr ? attr._id : null, error: null, saving: false });
    };

    const closeAttrForm = () => setAttrForm({ open: false, name: "", editId: null, error: null, saving: false });

    const saveAttribute = async () => {
        if (!attrForm.name.trim() || attrForm.name.trim().length < 2) {
            setAttrForm((p) => ({ ...p, error: "El nombre debe tener al menos 2 caracteres" }));
            return;
        }
        setAttrForm((p) => ({ ...p, saving: true, error: null }));
        try {
            if (attrForm.editId) {
                await updateAttributeService(attrForm.editId, attrForm.name.trim());
            } else {
                await createAttributeService(attrForm.name.trim());
            }
            await fetchAll();
            closeAttrForm();
        } catch (err) {
            setAttrForm((p) => ({ ...p, error: err.message, saving: false }));
        }
    };

    // ─── VALUES ───────────────────────────────────────────

    const openValueForm = (attributeId) => {
        setValueForm({ open: true, attributeId, value: "", error: null, saving: false });
    };

    const closeValueForm = () => setValueForm({ open: false, attributeId: null, value: "", error: null, saving: false });

    const saveValue = async () => {
        if (!valueForm.value.trim()) {
            setValueForm((p) => ({ ...p, error: "El valor es requerido" }));
            return;
        }
        setValueForm((p) => ({ ...p, saving: true, error: null }));
        try {
            await createValueService(valueForm.attributeId, valueForm.value.trim());
            await fetchAll();
            closeValueForm();
        } catch (err) {
            setValueForm((p) => ({ ...p, error: err.message, saving: false }));
        }
    };

    // ─── VARIANTS ─────────────────────────────────────────

    const openVariantForm = (variant = null) => {
        if (variant) {
            const selectedAttrs = {};
            variant.attributes?.forEach((a) => {
                selectedAttrs[a.idAttribute._id] = a.idValue._id;
            });
            setVariantForm({
                open: true, editId: variant._id,
                price: variant.price, stock: variant.stock, status: variant.status,
                selectedAttrs, error: null, saving: false,
            });
        } else {
            setVariantForm({ open: true, editId: null, price: "", stock: "", status: true, selectedAttrs: {}, error: null, saving: false });
        }
    };

    const closeVariantForm = () => setVariantForm({ open: false, editId: null, price: "", stock: "", status: true, selectedAttrs: {}, error: null, saving: false });

    const updateVariantField = (field, value) => setVariantForm((p) => ({ ...p, [field]: value }));

    const selectAttrValue = (attributeId, valueId) => {
        setVariantForm((p) => ({ ...p, selectedAttrs: { ...p.selectedAttrs, [attributeId]: valueId } }));
    };

    const saveVariant = async () => {
        if (!variantForm.price || parseFloat(variantForm.price) < 0) {
            setVariantForm((p) => ({ ...p, error: "El precio es requerido" }));
            return;
        }
        setVariantForm((p) => ({ ...p, saving: true, error: null }));
        try {
            const attrs = Object.entries(variantForm.selectedAttrs).map(([idAttribute, idValue]) => ({ idAttribute, idValue }));
            const payload = {
                price: parseFloat(variantForm.price),
                stock: parseInt(variantForm.stock) || 0,
                status: variantForm.status,
                attributes: attrs,
            };
            if (variantForm.editId) {
                await updateVariantService(variantForm.editId, payload);
            } else {
                await createVariantService(productId, payload);
            }
            await fetchAll();
            closeVariantForm();
        } catch (err) {
            setVariantForm((p) => ({ ...p, error: err.message, saving: false }));
        }
    };

    // ─── DELETE ───────────────────────────────────────────

    const openDeleteConfirm = (type, id, name) => setDeleteConfirm({ open: true, type, id, name });
    const closeDeleteConfirm = () => setDeleteConfirm({ open: false, type: null, id: null, name: "" });

    const confirmDelete = async () => {
        try {
            if (deleteConfirm.type === "attribute") await deleteAttributeService(deleteConfirm.id);
            if (deleteConfirm.type === "value") await deleteValueService(deleteConfirm.id);
            if (deleteConfirm.type === "variant") await deleteVariantService(deleteConfirm.id);
            await fetchAll();
            closeDeleteConfirm();
        } catch (err) {
            setError(err.message);
            closeDeleteConfirm();
        }
    };

    return {
        attributes, variants, loading, error,
        activeTab, setActiveTab,
        attrForm, setAttrForm, openAttrForm, closeAttrForm, saveAttribute,
        valueForm, setValueForm, openValueForm, closeValueForm, saveValue,
        variantForm, openVariantForm, closeVariantForm, updateVariantField, selectAttrValue, saveVariant,
        deleteConfirm, openDeleteConfirm, closeDeleteConfirm, confirmDelete,
    };
};