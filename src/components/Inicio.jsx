import { useState } from 'react';
import { Link } from 'react-router-dom';
import "../css/style.css";

function Inicio() {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const toggleMenu = () => {
    setMostrarMenu(!mostrarMenu);
  };

  return (
    // ID que encapsula y aisla por completo el diseño de la landing page
    <div id="landing-page-root"> 
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Anton&family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet" />

      {/* Control dinámico in-line para alternar la visibilidad de las tarjetas */}
      <style jsx="true">{`
        .selector-prendas {
          display: ${mostrarMenu ? 'grid' : 'none'};
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-top: 25px;
        }
      `}</style>

      {/* Contenedor principal de la Landing */}
      <div className="container">
        {/* COLUMNA IZQUIERDA: TEXTOS Y ACCESOS */}
        <div className="texto">
          <h4>Bienvenido a otro nivel.</h4>
          <h1>
            Personaliza <br />
            <span>your style</span>
          </h1>
          <p>Lo clásico nunca pasa de moda.</p>

          {/* Menú Rojo Dinámico */}
          <div className="caja">
            <button id="btn-mostrar-disenos" onClick={toggleMenu}>
              Tipos de diseños
            </button>

            {/* Selector de prendas con todos tus accesos reales recuperados */}
            <div className="selector-prendas" id="menu-prendas">
              <Link to="/personalizacion?tipo=sudadera" className="card-prenda">
                <div className="card-icon">🧥</div>
                <div className="card-title">Sudadera</div>
              </Link>
              
              <Link to="/personalizacion?tipo=gorra" className="card-prenda">
                <div className="card-icon">🧢</div>
                <div className="card-title">Gorra</div>
              </Link>

              <Link to="/personalizacion?tipo=t-shirt" className="card-prenda">
                <div className="card-icon">👕</div>
                <div className="card-title">T-Shirt</div>
              </Link>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: SECCIÓN GRÁFICA */}
        <div className="imagen">
          <div className="fondo"></div>
          {/* Imagen de la sudadera con los stickers que sirve de portada */}
          <img className="sudadera" src="/img/portada.png" alt="Sudadera de Portada" />
        </div>
      </div>
    </div>
  );
}

export default Inicio;