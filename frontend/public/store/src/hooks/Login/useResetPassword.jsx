import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRecovery } from "../../context/RecoveryContext";
import { API_BASE_URL } from "../../utils/api";

const useResetPassword = () => {
  const { clearRecoveryState } = useRecovery();
  const [loading, setLoading] = useState(false);
  const ApiRecoveryPassword = `${API_BASE_URL}/recoveryPassword`;

  const resetPassword = async (newPassword) => {
    try {
      setLoading(true);
      const res = await fetch(`${ApiRecoveryPassword}/newPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al cambiar la contraseña");

      toast.success(data.message || "Contraseña actualizada con éxito");
      clearRecoveryState();
      return { success: true, data };
    } catch (error) {
      toast.error(error.message || "Error al cambiar la contraseña");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading };
};

export default useResetPassword;