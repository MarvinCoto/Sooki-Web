import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useRecovery } from "../context/RecoveryContext";
import useVerifyCode from '../hooks/Login/useVerifyCode';
import Title from '../components/Form/Title';
import InputCode from '../components/Form/InputCode';
import Button from '../components/Form/Button';
import "./AuthPages.css";

const VerifyCode = () => {
  const navigate = useNavigate();
  const { setIsVerified } = useRecovery();
  const { verifyCode, loading } = useVerifyCode();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await verifyCode(data.code);
    if (result.success) {
      setIsVerified(true);
      navigate("/resetpassword");
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
            <h2>Casi listo</h2>
            <p>Verifica el código que enviamos a tu correo.</p>
          </div>
        </div>

        <div className="auth-right">
          <img
            src="https://res.cloudinary.com/deakzascp/image/upload/v1773512477/LogoSooki_es8i5j.png"
            alt="Sooki"
            className="auth-logo"
          />
          <Title title="Verificar código" />
          <p className="auth-description">
            Ingresa el código de 6 dígitos que enviamos a tu correo electrónico.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="form-container">
            <InputCode name="code" register={register} error={errors.code?.message} />
            <Button type="submit" text={loading ? "Verificando..." : "Verificar"} disabled={loading} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;