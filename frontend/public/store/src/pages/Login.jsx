import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useLoginLimit } from "../context/LoginLimitContext";
import Title from '../components/Form/Title';
import InputEmail from '../components/Form/InputEmail';
import InputPassword from '../components/Form/InputPassword';
import Button from '../components/Form/Button';
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { Login } = useAuth();
  const { getAccountLockInfo } = useLoginLimit();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockInfo, setLockInfo] = useState(null);
  const [countdown, setCountdown] = useState(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const emailValue = watch("email");

  useEffect(() => {
    if (emailValue && emailValue.includes("@")) {
      const info = getAccountLockInfo(emailValue);
      setLockInfo(info);
      if (info?.isLocked) setCountdown(info.remainingTime);
      else setCountdown(null);
    } else {
      setLockInfo(null);
      setCountdown(null);
    }
  }, [emailValue, getAccountLockInfo]);

  useEffect(() => {
    let interval = null;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1000) {
            if (emailValue) setLockInfo(getAccountLockInfo(emailValue));
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [countdown, emailValue, getAccountLockInfo]);

  const formatCountdown = (ms) => {
    if (ms <= 0) return "0m 0s";
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  };

  const isFormDisabled = isSubmitting || (lockInfo?.isLocked && countdown > 0);

  const onSubmit = async (data) => {
    if (lockInfo?.isLocked) {
      toast.error("Tu cuenta está bloqueada temporalmente");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await Login(data.email, data.password);
      if (result.success) {
        navigate("/");
      } else {
        if (result.isLocked) {
          const info = getAccountLockInfo(data.email);
          setLockInfo(info);
          if (info?.remainingTime) setCountdown(info.remainingTime);
        } else if (result.needsVerification) {
          toast.error("Debes verificar tu correo electrónico antes de iniciar sesión.");
        }
      }
    } catch (error) {
      toast.error("Error inesperado al iniciar sesión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Panel izquierdo */}
        <div className="login-left">
          <div className="login-logo">
            <img
              src="https://res.cloudinary.com/deakzascp/image/upload/v1773512477/LogoSooki_es8i5j.png"
              alt="Sooki"
              className="login-logo-img"
            />
          </div>

          <Title title="Iniciar sesión" />
          <p className="login-tagline">Bienvenido de vuelta 👋</p>

          {lockInfo?.isLocked && countdown > 0 && (
            <div className="login-lock-alert">
              <strong>Cuenta bloqueada.</strong> Regresa en: {formatCountdown(countdown)}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="form-container">
            <InputEmail
              name="email"
              placeholder="Correo electrónico"
              register={register}
              setValue={setValue}
              error={errors.email?.message}
              disabled={isFormDisabled}
            />

            <InputPassword
              name="password"
              placeholder="Contraseña"
              register={register}
              setValue={setValue}
              error={errors.password?.message}
              disabled={isFormDisabled}
            />

            <div className="login-forgot">
              <Link to="/passwordrecovery" className={isFormDisabled ? "disabled-link" : ""}>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              text={lockInfo?.isLocked && countdown > 0 ? "Bloqueado" : isSubmitting ? "Iniciando..." : "Iniciar sesión"}
              disabled={isFormDisabled}
            />

            <div className="login-register-text">
              <span>¿No tienes cuenta? </span>
              <Link to="/register" className="login-register-link">Regístrate</Link>
            </div>

            <p className="login-security-note">
              Por seguridad, después de 8 intentos fallidos la cuenta se bloqueará temporalmente.
            </p>
          </form>
        </div>

        {/* Panel derecho */}
        <div className="login-right">
          <img
            src="https://res.cloudinary.com/deakzascp/image/upload/v1773532472/landscape1_fkvspy.png"
            alt="Sooki"
            className="login-bg-img"
          />
          <div className="login-right-overlay">
            <h2>Tu tienda favorita,<br />siempre contigo</h2>
            <p>Descubre miles de productos importados a los mejores precios.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;