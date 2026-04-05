import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../utils/api";

const useProfile = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const { user, setUser, logOut } = useAuth();

  // ===== CARGAR PERFIL =====
  const loadUserProfile = async () => {
    if (!user?.id) return;
    setIsLoadingProfile(true);
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${user.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser((prev) => ({
          ...prev,
          ...data.client,
          photo: data.client?.photo || prev?.photo,
        }));
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (user?.id) loadUserProfile();
  }, [user?.id]);

  // ===== ACTUALIZAR PERFIL =====
  const updateProfile = async (profileData, profileImage = null) => {
    if (!user?.id) {
      toast.error("No hay una sesión activa");
      return { success: false };
    }

    setIsUpdating(true);
    try {
      const formData = new FormData();

      Object.keys(profileData).forEach((key) => {
        if (profileData[key] !== null && profileData[key] !== undefined && profileData[key] !== "") {
          formData.append(key, profileData[key]);
        }
      });

      if (profileImage) formData.append("photo", profileImage);

      const response = await fetch(`${API_BASE_URL}/clients/${user.id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 401 || response.status === 403) {
          toast.error("Tu sesión ha expirado. Inicia sesión nuevamente");
          logOut();
        } else if (response.status === 409) {
          toast.error("El email ya está en uso por otra cuenta");
        } else {
          toast.error(data.message || "Error al actualizar el perfil");
        }
        return { success: false };
      }

      setUser((prev) => ({
        ...prev,
        ...data.client,
        photo: data.client?.photo || prev?.photo,
      }));

      toast.success("Perfil actualizado exitosamente");
      await loadUserProfile();
      return { success: true };
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      toast.error("Error al actualizar el perfil");
      return { success: false };
    } finally {
      setIsUpdating(false);
    }
  };

  // ===== CAMBIAR CONTRASEÑA =====
  const changePassword = async (currentPassword, newPassword) => {
    if (!user?.id) {
      toast.error("No hay una sesión activa");
      return { success: false };
    }

    if (!currentPassword || !newPassword) {
      toast.error("Debes completar todos los campos");
      return { success: false };
    }

    if (newPassword.length < 8) {
      toast.error("La nueva contraseña debe tener al menos 8 caracteres");
      return { success: false };
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/clients/changePassword/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 401) toast.error("Contraseña actual incorrecta");
        else if (response.status === 403) { toast.error("Sesión expirada"); logOut(); }
        else toast.error(data.message || "Error al cambiar la contraseña");
        return { success: false };
      }

      toast.success("Contraseña cambiada exitosamente");
      return { success: true };
    } catch (error) {
      console.error("Error cambiando contraseña:", error);
      toast.error("Error al cambiar la contraseña");
      return { success: false };
    } finally {
      setIsUpdating(false);
    }
  };

  // ===== UTILIDADES =====
  const validateImage = (file) => {
    if (!file) return { valid: false, error: "No se seleccionó ningún archivo" };
    if (file.size > 5 * 1024 * 1024) return { valid: false, error: "La imagen debe ser menor a 5MB" };
    if (!file.type.startsWith("image/")) return { valid: false, error: "Solo se permiten archivos de imagen" };
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) return { valid: false, error: "Solo se permiten imágenes JPG, PNG o WebP" };
    return { valid: true };
  };

  const createImagePreview = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  };

  const getUserPhotoUrl = () => {
    if (user?.photo?.startsWith("http")) return user.photo;
    return null;
  };

  return {
    isUpdating,
    isLoadingProfile,
    user,
    updateProfile,
    changePassword,
    loadUserProfile,
    validateImage,
    createImagePreview,
    getUserPhotoUrl,
  };
};

export default useProfile;