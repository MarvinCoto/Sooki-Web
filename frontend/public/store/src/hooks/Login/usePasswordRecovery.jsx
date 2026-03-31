import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRecovery } from "../context/RecoveryContext";
import { API_BASE_URL } from "../utils/api";

const usePasswordRecovery = () => {
  const { setEmail } = useRecovery();
  const [loading, setLoading] = useState(false);
  const ApiRecoveryPassword = `${API_BASE_URL}/recoveryPassword`;

  const requestCode = async (email) => {
    try {
      setLoading(true);
      const res = await fetch(`${ApiRecoveryPassword}/requestCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al enviar el código");

      setEmail(email);
      toast.success("Código enviado al correo");
      return { success: true, data };
    } catch (error) {
      toast.error(error.message || "Ocurrió un error");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { requestCode, loading };
};

export default usePasswordRecovery;