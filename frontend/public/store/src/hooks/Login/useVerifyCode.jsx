import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRecovery } from "../context/RecoveryContext";
import { API_BASE_URL } from "../utils/api";

const useVerifyCode = () => {
  const { setIsVerified } = useRecovery();
  const [loading, setLoading] = useState(false);
  const ApiRecoveryPassword = `${API_BASE_URL}/recoveryPassword`;

  const verifyCode = async (code) => {
    try {
      setLoading(true);

      if (!code) throw new Error("El código es requerido");

      const res = await fetch(`${ApiRecoveryPassword}/verifyCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: String(code) }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Código inválido o expirado");

      toast.success(data.message || "Código verificado correctamente");
      setIsVerified(true);
      return { success: true, data };
    } catch (error) {
      toast.error(error.message || "Error al verificar el código");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return { verifyCode, loading };
};

export default useVerifyCode;