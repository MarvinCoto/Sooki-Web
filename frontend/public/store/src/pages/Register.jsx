import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useDataClients from '../hooks/Clients/useDataClients';
import Title from '../components/Form/Title';
import Subtitle from '../components/Form/SubTitle';
import Button from '../components/Form/Button';
import InputText from '../components/Form/InputText';
import InputEmail from '../components/Form/InputEmail';
import InputPassword from '../components/Form/InputPassword';
import InputBirthdate from '../components/Form/InputBirthdate';
import InputImage from '../components/Form/InputImage';
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const { createClient, loading } = useDataClients();
  const [imagePreviews, setImagePreviews] = useState([]);

  const { register, handleSubmit, setValue, trigger, formState: { errors } } = useForm();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreviews([imageUrl]);
      setValue("photo", e.target.files);
    }
  };

  const removeImageAtIndex = () => {
    setImagePreviews([]);
    setValue("photo", null);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("lastname", data.lastname);
    formData.append("birthdate", data.birthdate);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.photo && data.photo[0]) {
      formData.append("photo", data.photo[0]);
    }

    try {
      await createClient(formData);
      localStorage.setItem("temporalEmail", data.email);
      navigate("/verifyemail", { state: { email: data.email } });
    } catch (error) {
      console.error("Error registrando cliente:", error);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        {/* Panel izquierdo - imagen */}
        <div className="register-left">
          <img
            src="https://res.cloudinary.com/deakzascp/image/upload/v1773532472/landscape1_fkvspy.png"
            alt="Sooki"
            className="register-bg-img"
          />
          <div className="register-left-overlay">
            <h2>Únete a Sooki</h2>
            <p>Miles de productos importados al alcance de tu mano.</p>
          </div>
        </div>

        {/* Panel derecho - formulario */}
        <div className="register-right">
          <div className="register-logo">
            <img
              src="https://res.cloudinary.com/deakzascp/image/upload/v1773512477/LogoSooki_es8i5j.png"
              alt="Sooki"
              className="register-logo-img"
            />
          </div>

          <Title title="Crear cuenta" />
          <p className="register-tagline">Completa tus datos para registrarte</p>

          <form onSubmit={handleSubmit(onSubmit)} className="form-container">
            <InputText name="name" placeholder="Nombre" register={register} setValue={setValue} error={errors.name?.message} />
            <InputText name="lastname" placeholder="Apellido" register={register} setValue={setValue} error={errors.lastname?.message} />
            <InputBirthdate name="birthdate" register={register} setValue={setValue} trigger={trigger} error={errors.birthdate?.message} />
            <InputEmail name="email" placeholder="Correo electrónico" register={register} setValue={setValue} error={errors.email?.message} />
            <InputPassword name="password" placeholder="Contraseña" register={register} setValue={setValue} error={errors.password?.message} />

            <div>
              <Subtitle subtitle="Foto de perfil (opcional)" />
              <InputImage name="photo" register={register} setValue={setValue} onChange={handleImageChange} imagePreviews={imagePreviews} removeImageAtIndex={removeImageAtIndex} />
            </div>

            <Button type="submit" text={loading ? "Registrando..." : "Registrarme"} disabled={loading} />

            <div className="register-login-text">
              <span>¿Ya tienes cuenta? </span>
              <Link to="/login" className="register-login-link">Iniciar sesión</Link>
            </div>

            <p className="register-terms">
              Al registrarte aceptas nuestros{" "}
              <Link to="/terms" className="register-login-link">términos y condiciones</Link>{" "}
              y política de privacidad.
            </p>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Register;