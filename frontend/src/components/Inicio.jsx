import React, { useEffect } from 'react';
import Menu from './Menu';
import Promociones from './Promociones';
import Contacto from './Contacto';
import Testimonios from './Testimonios';
import SobreNosotros from './SobreNosotros';

const Inicio = () => {
  const scrollToHash = () => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    // Al entrar con hash (ej: /#menu) desplaza suavemente al destino
    setTimeout(scrollToHash, 50);
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  const handleCTA = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-gradient-to-br from-[#DDD4CE] to-[#DDD4CE]">

      {/* Secciones ancladas con margen para el navbar fijo */}
      <div id="sobre-nosotros" className="scroll-mt-24">
        <SobreNosotros />
      </div>

      <div id="menu" className="scroll-mt-24">
        <Menu />
      </div>

      <div id="promociones" className="scroll-mt-24">
        <Promociones />
      </div>

      <div id="contacto" className="scroll-mt-24">
        <Contacto />
      </div>

      <div id="testimonios" className="scroll-mt-24">
        <Testimonios />
      </div>
    </div>
  );
};

export default Inicio;




