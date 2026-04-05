import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Columna 1: Logo + "Encuéntranos en:" + redes en fila */}
        <div className="footer-col footer-col-brand">
          <div className="footer-brand-row">
            <Link to="/" className="footer-logo">
              <img
                src="https://res.cloudinary.com/deakzascp/image/upload/v1773512477/LogoSooki_es8i5j.png"
                alt="Sooki"
                className="footer-logo-img"
              />
            </Link>
            <div className="footer-brand-social">
              <p className="footer-brand-tagline">Encuéntranos en:</p>
              <div className="footer-socials">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                  <Instagram size={24} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                  <Facebook size={24} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                  <Twitter size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Columna 2: Explorar */}
        <div className="footer-col">
          <h4 className="footer-col-title">Explorar</h4>
          <ul className="footer-links-list">
            <li><Link to="/" className="footer-link">Inicio</Link></li>
            <li><Link to="/products" className="footer-link">Productos</Link></li>
            <li><Link to="/categories" className="footer-link">Categorías</Link></li>
            <li><Link to="/stores" className="footer-link">Tiendas</Link></li>
            <li><Link to="/profile" className="footer-link">Perfil</Link></li>
          </ul>
        </div>

        {/* Columna 3: Contacto */}
        <div className="footer-col">
          <h4 className="footer-col-title">Contacto</h4>
          <ul className="footer-contact-list">
            <li className="footer-contact-item">
              <span className="footer-contact-icon">📍</span>
              <span>Boulevard los Héroes, San Salvador</span>
            </li>
            <li className="footer-contact-item">
              <span className="footer-contact-icon">📞</span>
              <span>7639-0642</span>
            </li>
            <li className="footer-contact-item">
              <span className="footer-contact-icon">✉️</span>
              <span>sooki.sv@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Columna 4: Newsletter */}
        <div className="footer-col footer-col-newsletter">
          <h4 className="footer-col-title">Newsletter</h4>
          <p className="footer-newsletter-desc">
            ¡Suscríbete para recibir notificaciones de nuevos productos y ofertas!
          </p>
          <button className="footer-newsletter-btn">
            Suscribirme
          </button>
        </div>

      </div>

      {/* Imagen decorativa montaña */}
      <img
        src="https://res.cloudinary.com/deakzascp/image/upload/v1773531827/MountainSooki_t7hiqm.png"
        alt=""
        className="footer-mountain-img"
        aria-hidden="true"
      />

      {/* Footer bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="footer-copyright">© 2025 Sooki, Todos los derechos reservados.</p>
          <div className="footer-legal-links">
            <a href="#" className="footer-legal-link">Términos y condiciones</a>
            <a href="#" className="footer-legal-link">Política de privacidad</a>
            <a href="#" className="footer-legal-link">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;