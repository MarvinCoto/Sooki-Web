import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useRecovery } from "../context/RecoveryContext";
import useResetPassword from "../loginhooks/useResetPassword";
import { Title, InputPassword, Button } from "../components/Form/index";
import "./AuthPages.css";

const ResetPassword = () => {
  const { setIsVerified, setEmail } = useRecovery();
  const navigate = useNavigate();
  const { resetPassword, loading } = useResetPassword();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    const result = await resetPassword(data.password);
    if (result.success) {
      setIsVerified(false);
      setEmail("");
      setTimeout(() => navigate("/login", { replace: true }), 100);
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
            <h2>Nueva contraseña</h2>
            <p>Crea una contraseña segura para tu cuenta.</p>
          </div>
        </div>

        <div className="auth-right">
          <img
            src="https://res.cloudinary.com/deakzascp/image/upload/v1773512477/LogoSooki_es8i5j.png"
            alt="Sooki"
            className="auth-logo"
          />
          <Title title="Restablecer contraseña" />
          <p className="auth-description">
            Ingresa tu nueva contraseña. Debe tener al menos 8 caracteres.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="form-container">
            <InputPassword name="password" placeholder="Nueva contraseña" register={register} error={errors.password?.message} />
            <InputPassword
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              register={register}
              error={errors.confirmPassword?.message}
              validateMatch={(value) => value === password || "Las contraseñas no coinciden"}
            />
            <Button type="submit" text={loading ? "Guardando..." : "Confirmar"} disabled={loading} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;