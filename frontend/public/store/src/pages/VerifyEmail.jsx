import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import useDataClients from '../hooks/Clients/useDataClients';
import Title from '../components/Form/Title';
import InputCode from '../components/Form/InputCode';
import Button from '../components/Form/Button';
import "./AuthPages.css";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyToken } = useAuth();
  const { verifyEmailCode, resendVerificationCode, loading } = useDataClients();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const emailFromState = location.state?.email;
    const emailFromStorage = localStorage.getItem("temporalEmail");

    if (emailFromState) setUserEmail(emailFromState);
    else if (emailFromStorage) setUserEmail(emailFromStorage);
    else navigate("/register");
  }, [location.state, navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await verifyEmailCode(data.code);
      await verifyToken();
      localStorage.removeItem("temporalEmail");
      navigate("/login");
    } catch (error) {
      console.error("Error verificando código:", error);
    }
  };

  const handleResend = async () => {
    if (!userEmail) return;
    try {
      await resendVerificationCode(userEmail);
    } catch (error) {
      console.error("Error reenviando código:", error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <img
            src="https://res.cloudinary.com/deakzascp/image/upload/v1773532472/landscape1_fkvspy.png"
            alt="Sooki"
            className="auth-bg-img"
          />
          <div className="auth-left-overlay">
            <h2>Verifica tu cuenta</h2>
            <p>Un paso más para disfrutar de Sooki.</p>
          </div>
        </div>

        <div className="auth-right">
          <img
            src="https://res.cloudinary.com/deakzascp/image/upload/v1773512477/LogoSooki_es8i5j.png"
            alt="Sooki"
            className="auth-logo"
          />
          <Title title="Verificar correo" />
          <p className="auth-description">
            Hemos enviado un código de 6 dígitos a tu correo electrónico. Ingrésalo aquí para verificar tu cuenta.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="form-container">
            <InputCode name="code" register={register} error={errors.code?.message} />
            <Button type="submit" text={loading ? "Verificando..." : "Verificar"} disabled={loading} />
          </form>

          <button className="auth-resend-btn" onClick={handleResend} disabled={loading} type="button">
            ¿No recibiste el código? Reenviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;