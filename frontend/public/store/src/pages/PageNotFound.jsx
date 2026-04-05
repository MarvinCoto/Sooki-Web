import React from "react";
import { useNavigate } from "react-router-dom";
import "./PageNotFound.css";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <img
          src="https://res.cloudinary.com/deakzascp/image/upload/v1773512477/LogoSooki_es8i5j.png"
          alt="Sooki"
          className="notfound-logo"
        />
        <h1 className="notfound-code">404</h1>
        <p className="notfound-msg">¡Vaya! La página que buscas no existe o no está disponible.</p>
        <button className="notfound-btn" onClick={() => navigate(-1)}>
          Regresar
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;