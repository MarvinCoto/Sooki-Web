import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import './ContactUs.css';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-page">
      <div className="contact-container">

        {/* Card principal */}
        <div className="contact-card">

          {/* Panel izquierdo naranja */}
          <div className="contact-left">
            <h1 className="contact-title">Contáctanos</h1>
            <p className="contact-tagline">
              Esperamos tu mensaje, estamos listos para atenderte
            </p>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <Phone size={18} />
                <div>
                  <p>2256-7654</p>
                  <p>7946-6212</p>
                </div>
              </div>
              <div className="contact-info-item">
                <Mail size={18} />
                <p>sookicontact@gmail.com</p>
              </div>
              <div className="contact-info-item">
                <MapPin size={18} />
                <p>Boulevard los Héroes, San Salvador</p>
              </div>
            </div>

            {/* Mapa embed */}
            <div className="contact-map">
              <iframe
                title="Ubicación Sooki"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.5!2d-89.2182!3d13.7034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQyJzEyLjIiTiA4OcKwMTMnMDUuNSJX!5e0!3m2!1ses!2ssv!4v1620000000000!5m2!1ses!2ssv"
                width="100%"
                height="160"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Panel derecho oscuro - formulario */}
          <div className="contact-right">
            <h2 className="contact-form-title">Envíanos un mensaje</h2>

            {sent && (
              <div className="contact-success">
                ✅ ¡Mensaje enviado! Te responderemos pronto.
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-field">
                <label className="contact-label">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="contact-input"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>

              <div className="contact-field">
                <label className="contact-label">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="contact-input"
                  placeholder="tu@correo.com"
                  required
                />
              </div>

              <div className="contact-field">
                <label className="contact-label">Mensaje</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="contact-textarea"
                  placeholder="¿En qué podemos ayudarte?"
                  rows={5}
                  required
                />
              </div>

              <button type="submit" className="contact-btn">
                Enviar <Send size={16} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;