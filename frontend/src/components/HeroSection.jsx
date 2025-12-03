import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animate, setAnimate] = useState(false);

  const slides = [
    {
      title: "Deléitate con Nuestros Helados Artesanales",
      subtitle: "Sabores únicos hechos con amor y los mejores ingredientes naturales",
      cta: "Ver Menú",
      image: "/img/hero-1.jpg",
      gradient: "from-primary/90 to-primary-dark/90"
    },
    {
      title: "Promociones Especiales Todos los Días",
      subtitle: "Descubre nuestras ofertas exclusivas y combos irresistibles",
      cta: "Ver Promociones",
      image: "/img/hero-2.jpg",
      gradient: "from-secondary/90 to-secondary-dark/90"
    },
    {
      title: "Calidad Premium en Cada Bocado",
      subtitle: "Más de 20 sabores para todos los gustos y ocasiones",
      cta: "Pedir Ahora",
      image: "/img/hero-3.jpg",
      gradient: "from-accent-purple/90 to-primary/90"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleCTA = () => {
    const element = currentSlide === 1 
      ? document.getElementById('promociones')
      : document.getElementById('menu');
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleKnowMore = () => {
    const element = document.getElementById('sobre-nosotros');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section 
      className="relative min-h-screen overflow-hidden"
      aria-label="Hero section con carrusel de presentación"
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=2000';
              }}
            />
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}></div>
          </div>

          {/* Content */}
          <div className="relative h-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className={`inline-block mb-6 transition-all duration-1000 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-bold animate-pulse border border-white/30">
                  ✨ Nuevo: Sabor del Mes
                </span>
              </div>
              
              <h1
                className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-2xl font-title leading-tight transition-all duration-1000 delay-200 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                {slide.title}
              </h1>
              <p
                className={`text-lg sm:text-xl md:text-2xl text-white/95 mb-8 max-w-2xl mx-auto drop-shadow-lg font-body transition-all duration-1000 delay-400 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                {slide.subtitle}
              </p>
              
              <div className={`flex flex-wrap gap-4 justify-center transition-all duration-1000 delay-600 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <button
                  onClick={handleCTA}
                  className="px-8 py-4 bg-white text-primary rounded-full font-bold text-lg shadow-2xl hover:bg-neutral-50 hover:scale-110 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center gap-3 font-title"
                >
                  <span>{slide.cta}</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                
                <button
                  onClick={handleKnowMore}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-full font-bold text-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300 font-title"
                >
                  Conocer Más
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20"
        role="tablist"
        aria-label="Navegación del carrusel"
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'w-12 h-3 bg-white'
                : 'w-3 h-3 bg-white/50 hover:bg-white/75'
            }`}
            role="tab"
            aria-label={`Ir a la diapositiva ${index + 1}`}
            aria-selected={index === currentSlide}
            tabIndex={index === currentSlide ? 0 : -1}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-40 right-16 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 right-10 w-20 h-20 bg-white/5 rounded-full blur-2xl animate-float"></div>
    </section>
  );
};

export default HeroSection;
