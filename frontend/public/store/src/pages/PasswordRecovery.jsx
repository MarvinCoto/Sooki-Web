import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useRecovery } from "../context/RecoveryContext";
import usePasswordRecovery from '../hooks/Login/usePasswordRecovery';
import Title from '../components/Form/Title';
import InputEmail from '../components/Form/InputEmail';
import Button from '../components/Form/Button';
import "./AuthPages.css";

const PasswordRecovery = () => {
  const { setEmail } = useRecovery();
  const navigate = useNavigate();
  const { requestCode, loading } = usePasswordRecovery();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await requestCode(data.email);
    if (result.success) {
      setEmail(data.email);
      localStorage.setItem("recoveryEmail", data.email);
      navigate("/verifycode");
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
            <h2>Recupera tu acceso</h2>
            <p>Te ayudamos a recuperar tu contraseña.</p>
          </div>
        </div>

        <div className="auth-right">
          <img
            src="https://res.cloudinary.com/deakzascp/image/upload/v1773512477/LogoSooki_es8i5j.png"
            alt="Sooki"
            className="auth-logo"
          />
          <Title title="Recuperar contraseña" />
          <p className="auth-description">
            Ingresa tu correo electrónico y te enviaremos un código para restablecer tu contraseña.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="form-container">
            <InputEmail name="email" placeholder="Correo electrónico" register={register} setValue={setValue} error={errors.email?.message} />
            <Button type="submit" text={loading ? "Enviando..." : "Enviar código"} disabled={loading} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecovery;