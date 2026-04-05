import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-page">
      <div className="about-container">

        {/* Misión */}
        <div className="about-block about-block--right">
          <div className="about-text">
            <h2 className="about-subtitle">Misión</h2>
            <p>
              Conectar a compradores con los mejores productos importados de Asia,
              ofreciendo una experiencia de compra accesible, confiable y divertida.
              En Sooki creemos que todos merecen acceder a productos de calidad a
              precios justos, sin complicaciones y desde la comodidad de su hogar.
            </p>
          </div>
          <div className="about-image">
            <img
              src="https://res.cloudinary.com/deakzascp/image/upload/v1773532472/landscape1_fkvspy.png"
              alt="Misión Sooki"
            />
          </div>
        </div>

        {/* Visión */}
        <div className="about-block about-block--left">
          <div className="about-image">
            <img
              src="https://res.cloudinary.com/deakzascp/image/upload/v1773532472/landscape1_fkvspy.png"
              alt="Visión Sooki"
            />
          </div>
          <div className="about-text about-text--right">
            <h2 className="about-subtitle">Visión</h2>
            <p>
              Convertirnos en el marketplace líder de El Salvador, donde cualquier
              emprendedor pueda crear su propia tienda en línea, personalizar su
              espacio y llegar a miles de clientes. Sooki no es solo una tienda —
              es una plataforma que impulsa el comercio local con tecnología moderna.
            </p>
          </div>
        </div>

        {/* Nuestra historia */}
        <div className="about-history">
          <h2 className="about-subtitle about-subtitle--center">Nuestra historia</h2>
          <p className="about-history-text">
            Sooki nació de una idea simple: hacer que los productos importados de Asia
            estuvieran al alcance de todos en El Salvador. Lo que comenzó como una
            pequeña tienda en línea pronto se convirtió en algo mucho más grande —
            una comunidad de vendedores y compradores unidos por el gusto de encontrar
            ese producto único que no encuentras en ningún otro lugar. Hoy, Sooki
            abre sus puertas a otras tiendas para que también puedan crecer,
            personalizar su espacio y conectar con sus clientes de una forma diferente.
          </p>
        </div>

        {/* Por qué unirte */}
        <div className="about-join">
          <h2 className="about-subtitle about-subtitle--center">¿Por qué unirte a Sooki?</h2>
          <div className="about-cards">
            <div className="about-card">
              <span className="about-card-icon">🏪</span>
              <h3>Tu tienda, tu estilo</h3>
              <p>Personaliza tu espacio con tu logo, colores y productos. Tu tienda refleja tu marca.</p>
            </div>
            <div className="about-card">
              <span className="about-card-icon">📦</span>
              <h3>Catálogo sin límites</h3>
              <p>Agrega todos los productos que quieras, organízalos por categorías y destácalos fácilmente.</p>
            </div>
            <div className="about-card">
              <span className="about-card-icon">🌐</span>
              <h3>Miles de clientes</h3>
              <p>Aprovecha la audiencia de Sooki para que más personas descubran lo que vendes.</p>
            </div>
            <div className="about-card">
              <span className="about-card-icon">⚡</span>
              <h3>Fácil y rápido</h3>
              <p>Regístrate, verifica tu correo y empieza a vender. Sin complicaciones técnicas.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;