// Componente del lado izquierdo con logo y bienvenida
// Left side component with logo and welcome message

import logo from "../assets/sookiLogo.png";
// Si el nombre "Sooki" también es una imagen, importala así:
// If the "Sooki" name is also an image, import it like this:
 import logoNombre from "../assets/sookiName.png";

import "../styles/loginStyles.css";

/**
 * BrandPanel — Panel izquierdo con identidad visual de la app
 * BrandPanel — Left panel with app visual identity
 *
 * Para cambiar el logo / To change the logo:
 *   Reemplaza el archivo en: src/assets/sookiLogo.png
 *   Replace the file at: src/assets/sookiLogo.png
 *
 * Para cambiar el nombre / To change the brand name:
 *   Opción A — imagen: descomenta logoNombre y el <img> de abajo
 *   Option A — image: uncomment logoNombre and the <img> below
 *   Opción B — texto: descomenta el <p className="brand-name">
 *   Option B — text: uncomment the <p className="brand-name">
 */
export default function BrandPanel() {
  return (
    <div className="brand-left">

      {/* ── Logo principal / Main logo ──
          Para cambiar el tamaño edita .brand-logo en el CSS
          To resize edit .brand-logo in CSS                   */}
      <img
        src={logo}
        alt="Sooki Logo"
        className="brand-logo"
      />

      {/* Mensaje de bienvenida / Welcome message */}
      <h1 className="brand-welcome">Bienvenido!</h1>

      {/* Línea decorativa / Decorative divider */}
      <div className="brand-divider" />

      {/* ── Nombre de la marca / Brand name ──────────────────────────
          OPCIÓN A — Si el nombre es una IMAGEN / If the name is an IMAGE:
          1. Importa tu imagen arriba: import logoNombre from "../assets/sookiNombre.png"
          2. Descomenta el bloque de abajo / Uncomment the block below           */}
      {
      <img
        src={logoNombre}
        alt="Sooki"
        className="brand-name-img"
      />
      }

      {/* OPCIÓN B — Si el nombre es TEXTO / If the name is TEXT:
          Descomenta esta línea / Uncomment this line             */}
      {/* <p className="brand-name">Sooki</p> */}

    </div>
  );
}