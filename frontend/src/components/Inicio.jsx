import React, { useEffect } from 'react';
import HeroSection from './HeroSection';
import Menu from './Menu';
import Promociones from './Promociones';
import Contacto from './Contacto';
import Testimonios from './Testimonios';
import SobreNosotros from './SobreNosotros';
import useScrollAnimation from '../hooks/useScrollAnimation';

const Inicio = () => {
  const sobreNosotrosAnim = useScrollAnimation({ threshold: 0.2 });
  const menuAnim = useScrollAnimation({ threshold: 0.15 });
  const promocionesAnim = useScrollAnimation({ threshold: 0.15 });
  const contactoAnim = useScrollAnimation({ threshold: 0.2 });
  const testimoniosAnim = useScrollAnimation({ threshold: 0.2 });

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

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Secciones ancladas con margen para el navbar fijo */}
      <div 
        ref={sobreNosotrosAnim.ref}
        id="sobre-nosotros" 
        className={`scroll-mt-20 transition-all duration-700 ${
          sobreNosotrosAnim.isVisible 
            ? 'translate-y-0' 
            : 'translate-y-4'
        }`}
      >
        <SobreNosotros />
      </div>

      <div 
        ref={menuAnim.ref}
        id="menu" 
        className="scroll-mt-20"
      >
        <Menu />
      </div>

      <div 
        ref={promocionesAnim.ref}
        id="promociones" 
        className="scroll-mt-20"
      >
        <Promociones />
      </div>

      <div 
        ref={contactoAnim.ref}
        id="contacto" 
        className="scroll-mt-20"
      >
        <Contacto />
      </div>

      <div 
        ref={testimoniosAnim.ref}
        id="testimonios" 
        className="scroll-mt-20"
      >
        <Testimonios />
      </div>
    </div>
  );
};

export default Inicio;
