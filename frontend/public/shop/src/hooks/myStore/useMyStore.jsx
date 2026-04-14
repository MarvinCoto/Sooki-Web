import { useState, useEffect } from "react";
import { getMyStoreService, updateStoreInfoService, updateAboutService } from "../../services/myStoreService";
import { useAlert } from "../../context/AlertContext";

const TEMPLATES = [
    { id: "minimalista", label: "Minimalista", desc: "Diseño limpio y simple" },
    { id: "moderna", label: "Moderna", desc: "Estilo contemporaneo" },
    { id: "gaming", label: "Gaming / Tech", desc: "Para tecnologia" },
    { id: "moda", label: "Moda", desc: "Elegante y sofisticado" },
    { id: "comida", label: "Comida", desc: "Para restaurantes" },
];

export const useMyStore = () => {
    const { showAlert } = useAlert();

    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("info");

    const [infoForm, setInfoForm] = useState({
        storeName: "", location: "", logo: null, logoPreview: null,
    });

    const [designForm, setDesignForm] = useState({
        design: "minimalista",
        colors: ["#FF8C42", "#FFD54A", "#1B2B44"],
    });

    const [aboutForm, setAboutForm] = useState({
        description: "", descriptionImage: null, descriptionPreview: null,
        mission: "", missionImage: null, missionPreview: null,
        vision: "", visionImage: null, visionPreview: null,
    });

    const [savingInfo, setSavingInfo] = useState(false);
    const [savingAbout, setSavingAbout] = useState(false);

    useEffect(() => {
        const fetchStore = async () => {
            try {
                const data = await getMyStoreService();
                setStore(data);
                setInfoForm({
                    storeName: data.storeName || "",
                    location: data.location || "",
                    logo: null,
                    logoPreview: data.logo || null,
                });
                setDesignForm({
                    design: data.design || "minimalista",
                    colors: data.colors?.length === 3 ? data.colors : ["#FF8C42", "#FFD54A", "#1B2B44"],
                });
                setAboutForm({
                    description: data.about?.description || "",
                    descriptionImage: null,
                    descriptionPreview: data.about?.images?.[0] || null,
                    mission: data.about?.mission || "",
                    missionImage: null,
                    missionPreview: data.about?.images?.[1] || null,
                    vision: data.about?.vision || "",
                    visionImage: null,
                    visionPreview: data.about?.images?.[2] || null,
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStore();
    }, []);

    const updateInfoField = (field, value) => setInfoForm((p) => ({ ...p, [field]: value }));
    const updateDesignField = (field, value) => setDesignForm((p) => ({ ...p, [field]: value }));
    const updateColor = (index, color) => {
        const newColors = [...designForm.colors];
        newColors[index] = color;
        setDesignForm((p) => ({ ...p, colors: newColors }));
    };
    const updateAboutField = (field, value) => setAboutForm((p) => ({ ...p, [field]: value }));

    const handleImageChange = (fieldName, previewField, file) => {
        const preview = URL.createObjectURL(file);
        setAboutForm((p) => ({ ...p, [fieldName]: file, [previewField]: preview }));
    };

    const handleLogoChange = (file) => {
        const preview = URL.createObjectURL(file);
        setInfoForm((p) => ({ ...p, logo: file, logoPreview: preview }));
    };

    const saveInfo = async () => {
        if (!infoForm.storeName.trim() || infoForm.storeName.trim().length < 2) {
            showAlert("error", "El nombre de la tienda debe tener al menos 2 caracteres");
            return;
        }
        setSavingInfo(true);
        try {
            const fd = new FormData();
            fd.append("storeName", infoForm.storeName.trim());
            fd.append("location", infoForm.location.trim());
            fd.append("design", designForm.design);
            fd.append("colors", JSON.stringify(designForm.colors));
            if (infoForm.logo) fd.append("logo", infoForm.logo);

            const updated = await updateStoreInfoService(fd);
            setStore(updated.data);
            showAlert("success", "Informacion de la tienda actualizada correctamente");
        } catch (err) {
            showAlert("error", err.message);
        } finally {
            setSavingInfo(false);
        }
    };

    const saveAbout = async () => {
        setSavingAbout(true);
        try {
            const fd = new FormData();
            fd.append("description", aboutForm.description.trim());
            fd.append("mission", aboutForm.mission.trim());
            fd.append("vision", aboutForm.vision.trim());
            if (aboutForm.descriptionImage) fd.append("descriptionImage", aboutForm.descriptionImage);
            if (aboutForm.missionImage) fd.append("missionImage", aboutForm.missionImage);
            if (aboutForm.visionImage) fd.append("visionImage", aboutForm.visionImage);

            await updateAboutService(fd);
            showAlert("success", "Seccion About actualizada correctamente");
        } catch (err) {
            showAlert("error", err.message);
        } finally {
            setSavingAbout(false);
        }
    };

    return {
        store, loading, error,
        activeTab, setActiveTab,
        infoForm, updateInfoField, handleLogoChange,
        designForm, updateDesignField, updateColor,
        aboutForm, updateAboutField, handleImageChange,
        savingInfo, savingAbout,
        saveInfo, saveAbout,
        TEMPLATES,
    };
};