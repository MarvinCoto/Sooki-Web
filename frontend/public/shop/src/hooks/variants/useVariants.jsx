import { useState, useEffect, useCallback } from "react";
import {
    getAttributesService, createAttributeService, updateAttributeService, deleteAttributeService,
    createValueService, deleteValueService,
    getVariantsService, createVariantService, updateVariantService, deleteVariantService,
} from "../../services/variantsService";
import { useAlert } from "../../context/AlertContext";

export const useVariants = (productId) => {
    const { showAlert } = useAlert();

    const [attributes, setAttributes] = useState([]);
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeTab, setActiveTab] = useState("variants");

    const [attrForm, setAttrForm] = useState({ open: false, name: "", editId: null, error: null, saving: false });
    const [valueForm, setValueForm] = useState({ open: false, attributeId: null, value: "", error: null, saving: false });
    const [variantForm, setVariantForm] = useState({
        open: false, editId: null, price: "", stock: "",
        status: true, selectedAttrs: {}, error: null, saving: false,
    });

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

    const openAttrForm = (attr = null) =>
        setAttrForm({ open: true, name: attr ? attr.name : "", editId: attr ? attr._id : null, error: null, saving: false });

    const closeAttrForm = () =>
        setAttrForm({ open: false, name: "", editId: null, error: null, saving: false });

    const saveAttribute = async () => {
        if (!attrForm.name.trim() || attrForm.name.trim().length < 2) {
            setAttrForm((p) => ({ ...p, error: "El nombre debe tener al menos 2 caracteres" }));
            return;
        }
        setAttrForm((p) => ({ ...p, saving: true, error: null }));
        try {
            if (attrForm.editId) {
                await updateAttributeService(attrForm.editId, attrForm.name.trim());
                showAlert("success", `Atributo "${attrForm.name.trim()}" actualizado`);
            } else {
                await createAttributeService(attrForm.name.trim());
                showAlert("success", `Atributo "${attrForm.name.trim()}" creado`);
            }
            await fetchAll();
            closeAttrForm();
        } catch (err) {
            setAttrForm((p) => ({ ...p, error: err.message, saving: false }));
            showAlert("error", err.message);
        }
    };

    // ─── VALUES ───────────────────────────────────────────

    const openValueForm = (attributeId) =>
        setValueForm({ open: true, attributeId, value: "", error: null, saving: false });

    const closeValueForm = () =>
        setValueForm({ open: false, attributeId: null, value: "", error: null, saving: false });

    const saveValue = async () => {
        if (!valueForm.value.trim()) {
            setValueForm((p) => ({ ...p, error: "El valor es requerido" }));
            return;
        }
        setValueForm((p) => ({ ...p, saving: true, error: null }));
        try {
            await createValueService(valueForm.attributeId, valueForm.value.trim());
            showAlert("success", `Valor "${valueForm.value.trim()}" agregado`);
            await fetchAll();
            closeValueForm();
        } catch (err) {
            setValueForm((p) => ({ ...p, error: err.message, saving: false }));
            showAlert("error", err.message);
        }
    };

    // ─── VARIANTS ─────────────────────────────────────────

    const openVariantForm = (variant = null) => {
        if (variant) {
            const selectedAttrs = {};
            variant.attributes?.forEach((a) => {
                selectedAttrs[a.idAttribute._id] = a.idValue._id;
            });
            setVariantForm({ open: true, editId: variant._id, price: variant.price, stock: variant.stock, status: variant.status, selectedAttrs, error: null, saving: false });
        } else {
            setVariantForm({ open: true, editId: null, price: "", stock: "", status: true, selectedAttrs: {}, error: null, saving: false });
        }
    };

    const closeVariantForm = () =>
        setVariantForm({ open: false, editId: null, price: "", stock: "", status: true, selectedAttrs: {}, error: null, saving: false });

    const updateVariantField = (field, value) => setVariantForm((p) => ({ ...p, [field]: value }));

    const selectAttrValue = (attributeId, valueId) =>
        setVariantForm((p) => ({ ...p, selectedAttrs: { ...p.selectedAttrs, [attributeId]: valueId } }));

    const saveVariant = async () => {
        if (!variantForm.price || parseFloat(variantForm.price) < 0) {
            setVariantForm((p) => ({ ...p, error: "El precio es requerido" }));
            return;
        }
        setVariantForm((p) => ({ ...p, saving: true, error: null }));
        try {
            const attrs = Object.entries(variantForm.selectedAttrs)
                .filter(([, v]) => v)
                .map(([idAttribute, idValue]) => ({ idAttribute, idValue }));
            const payload = {
                price: parseFloat(variantForm.price),
                stock: parseInt(variantForm.stock) || 0,
                status: variantForm.status,
                attributes: attrs,
            };
            if (variantForm.editId) {
                await updateVariantService(variantForm.editId, payload);
                showAlert("success", "Variante actualizada correctamente");
            } else {
                await createVariantService(productId, payload);
                showAlert("success", "Variante creada correctamente");
            }
            await fetchAll();
            closeVariantForm();
        } catch (err) {
            setVariantForm((p) => ({ ...p, error: err.message, saving: false }));
            showAlert("error", err.message);
        }
    };

    // ─── DELETE ───────────────────────────────────────────

    const openDeleteConfirm = (type, id, name) => {
        const messages = {
            attribute: `¿Eliminar el atributo "${name}"? Esto tambien eliminara sus valores.`,
            value: `¿Eliminar el valor "${name}"?`,
            variant: `¿Eliminar la variante "$${name}"?`,
        };
        showAlert("delete", messages[type], async () => {
            try {
                if (type === "attribute") await deleteAttributeService(id);
                if (type === "value") await deleteValueService(id);
                if (type === "variant") await deleteVariantService(id);
                await fetchAll();
                showAlert("success", "Eliminado correctamente");
            } catch (err) {
                showAlert("error", err.message);
            }
        });
    };

    return {
        attributes, variants, loading, error,
        activeTab, setActiveTab,
        attrForm, setAttrForm, openAttrForm, closeAttrForm, saveAttribute,
        valueForm, setValueForm, openValueForm, closeValueForm, saveValue,
        variantForm, openVariantForm, closeVariantForm, updateVariantField, selectAttrValue, saveVariant,
        openDeleteConfirm,
    };
};