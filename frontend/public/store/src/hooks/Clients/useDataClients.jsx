import { useState } from "react";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../../utils/api";

const useDataClients = () => {
  const ApiClients = `${API_BASE_URL}/registerClients`;
  const [loading, setLoading] = useState(false);
  const [errorClients, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const createFormData = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return formData;
  };

  const createClient = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch(ApiClients, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        let errorMessage = "Hubo un error al registrar el cliente";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.errors?.join(", ") || errorMessage;
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      toast.success("Registro exitoso. Revisa tu correo para verificar tu cuenta.");
      setSuccess("Registro exitoso");
      return data;
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailCode = async (verificationCode) => {
    setLoading(true);
    try {
      const formData = createFormData({ verificationCode });

      const response = await fetch(`${ApiClients}/verifyCodeEmail`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Código de verificación inválido");
      }

      const data = await response.json();
      toast.success("Email verificado correctamente");
      setSuccess("Email verificado");
      return data;
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationCode = async (email) => {
    setLoading(true);
    try {
      const formData = createFormData({ email });

      const response = await fetch(`${ApiClients}/resendCode`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al reenviar el código");
      }

      const data = await response.json();
      toast.success("Código reenviado a tu correo");
      return data;
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    errorClients,
    success,
    createClient,
    verifyEmailCode,
    resendVerificationCode,
  };
};

export default useDataClients;