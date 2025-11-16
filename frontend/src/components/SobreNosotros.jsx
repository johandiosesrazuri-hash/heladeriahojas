import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SobreNosotros = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mision');
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const response = await axios.get(`${api}/api/sobre-nosotros`);
        setData(response.data);
        // Activar animación después de cargar los datos
        setTimeout(() => setAnimate(true), 10);
      } catch (error) {
        console.error('Error al cargar información:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#faf7f2] to-[#f9f5f0]">
        <div className="relative">
          {/* Spinner animado */}
          <div className="w-20 h-20 border-4 border-[#d7ccc8] border-t-[#6d4c41] rounded-full animate-spin"></div>
          {/* Icono de helado en el centro */}
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl">
            🍦
          </span>
        </div>
        <p className="mt-6 text-lg font-accent text-[#6d4c41] animate-pulse">
          Cargando nuestra deliciosa historia...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#faf7f2] to-[#f9f5f0]">
        <div className="text-center px-4">
          <span className="text-6xl mb-4 block animate-bounce">😞</span>
          <p className="text-xl font-accent text-[#6d4c41] mb-6">
            No pudimos cargar la información
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  const { informacionPrincipal, valores, estadisticas, galeria } = data;

  return (
    <div className="bg-gradient-to-br from-[#faf7f2] to-[#f9f5f0]">
      
      {/* 🎨 Hero Section - Impactante */}
      <section className="relative h-[70vh] overflow-hidden">
        {/* Fondo con gradiente animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6d4c41] via-[#a1887f] to-[#d4af37] opacity-90"></div>
        
        {/* Círculos decorativos flotantes */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#e8b4b8]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Contenido del hero */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
          <h1 
            className="font-title text-5xl md:text-7xl text-white font-bold mb-6 drop-shadow-2xl"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.1s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            {informacionPrincipal.titulo}
          </h1>
          <p 
            className="font-accent text-xl md:text-2xl text-white/95 max-w-2xl"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.3s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            {informacionPrincipal.subtitulo}
          </p>
          
          {/* Indicador de scroll */}
          <div 
            className="absolute bottom-10 animate-bounce"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.5s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            <div className="flex flex-col items-center text-white/80">
              <span className="text-sm font-accent mb-2">Descubre más</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 📖 Story Section - Historia con imagen */}
      <section 
        className="py-20 px-4"
        style={{ 
          animation: animate ? `fadeInUp 0.6s ease-out 0.7s both` : 'none',
          opacity: animate ? 1 : 0
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Imagen con efectos */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#d4af37] to-[#e8b4b8] 
                            rounded-3xl opacity-30 group-hover:opacity-50 blur-xl transition-all duration-500"></div>
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src={informacionPrincipal.imagenPrincipal || '/img/default-about.jpg'} 
                  alt={informacionPrincipal.titulo}
                  className="w-full h-[500px] object-cover transform group-hover:scale-110 
                           transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#6d4c41]/60 to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>

            {/* Contenido */}
            <div className="space-y-6">
              <div>
                <h2 className="section-title text-left">
                  Nuestra Historia
                </h2>
              </div>
              
              <p className="text-lg text-gray-700 leading-relaxed font-accent">
                {informacionPrincipal.descripcionPrincipal}
              </p>

              {/* Tabs Misión/Visión con diseño moderno */}
              <div className="mt-8">
                <div className="flex gap-4 border-b-2 border-gray-200">
                  <button
                    onClick={() => setActiveTab('mision')}
                    className={`pb-4 px-6 font-semibold font-accent text-lg relative transition-colors duration-300
                              ${activeTab === 'mision' 
                                ? 'text-[#6d4c41]' 
                                : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    🎯 Misión
                    {activeTab === 'mision' && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r 
                                     from-[#d4af37] to-[#e8b4b8] animate-fade-in"></span>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('vision')}
                    className={`pb-4 px-6 font-semibold font-accent text-lg relative transition-colors duration-300
                              ${activeTab === 'vision' 
                                ? 'text-[#6d4c41]' 
                                : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    🔭 Visión
                    {activeTab === 'vision' && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r 
                                     from-[#d4af37] to-[#e8b4b8] animate-fade-in"></span>
                    )}
                  </button>
                </div>

                <div className="mt-6 p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
                  {activeTab === 'mision' && (
                    <p className="text-gray-700 font-accent leading-relaxed animate-fade-in">
                      {informacionPrincipal.mision}
                    </p>
                  )}
                  {activeTab === 'vision' && (
                    <p className="text-gray-700 font-accent leading-relaxed animate-fade-in">
                      {informacionPrincipal.vision}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📊 Statistics Section - Estadísticas impactantes */}
      <section 
        className="py-20 bg-gradient-to-br from-[#6d4c41] to-[#a1887f] relative overflow-hidden"
        style={{ 
          animation: animate ? `fadeInUp 0.6s ease-out 0.9s both` : 'none',
          opacity: animate ? 1 : 0
        }}
      >
        {/* Decoración de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {estadisticas.map((stat, index) => (
              <div
                key={stat.id}
                className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-md
                         hover:bg-white/20 transition-all duration-300 hover:scale-105
                         hover:shadow-2xl animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl mb-4 animate-bounce delay-300">
                  {stat.icono}
                </div>
                <div className="text-4xl font-bold text-white mb-2 font-title">
                  {stat.valor}
                </div>
                <div className="text-sm text-white/90 font-accent">
                  {stat.descripcion}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 💎 Values Section - Valores con tarjetas elegantes */}
      <section 
        className="py-20 px-4"
        style={{ 
          animation: animate ? `fadeInUp 0.6s ease-out 1.1s both` : 'none',
          opacity: animate ? 1 : 0
        }}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title mb-16">
            Nuestros Valores
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {valores.map((valor, index) => (
              <div
                key={valor.id}
                className="card p-8 group animate-fade-in hover:shadow-2xl"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-12 
                              transition-all duration-500">
                  {valor.icono}
                </div>
                <h3 className="text-2xl font-bold text-[#3e2723] mb-4 font-accent 
                             group-hover:text-[#6d4c41] transition-colors">
                  {valor.titulo}
                </h3>
                <p className="text-gray-600 leading-relaxed font-accent">
                  {valor.descripcion}
                </p>
                
                {/* Línea decorativa que aparece en hover */}
                <div className="mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r 
                              from-[#d4af37] to-[#e8b4b8] transition-all duration-500 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🖼️ Gallery Section - Galería con efectos parallax */}
      {galeria && galeria.length > 0 && (
        <section 
          className="py-20 px-4 bg-white/50"
          style={{ 
            animation: animate ? `fadeInUp 0.6s ease-out 1.3s both` : 'none',
            opacity: animate ? 1 : 0
          }}
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="section-title mb-16">
              Nuestra Galería
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galeria.map((imagen, index) => (
                <div
                  key={imagen.id}
                  className="group relative overflow-hidden rounded-2xl shadow-lg 
                           aspect-[4/3] animate-fade-in hover:shadow-2xl transition-all duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <img
                    src={imagen.imagenUrl}
                    alt={imagen.titulo}
                    className="w-full h-full object-cover transform group-hover:scale-110 
                             transition-transform duration-700"
                    onError={(e) => e.target.src = '/img/default-gallery.jpg'}
                  />
                  
                  {/* Overlay con gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
                                opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 
                                  group-hover:translate-y-0 transition-transform duration-500">
                      <h4 className="text-xl font-bold text-white mb-2 font-accent">
                        {imagen.titulo}
                      </h4>
                      {imagen.descripcion && (
                        <p className="text-sm text-white/90 font-accent">
                          {imagen.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 🎥 Video Section */}
      {informacionPrincipal.videoUrl && (
        <section 
          className="py-20 px-4"
          style={{ 
            animation: animate ? `fadeInUp 0.6s ease-out 1.5s both` : 'none',
            opacity: animate ? 1 : 0
          }}
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="section-title mb-12">
              Conócenos Mejor
            </h2>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#d4af37] to-[#e8b4b8] 
                            opacity-30 group-hover:opacity-50 blur-2xl transition-all duration-500"></div>
              <div className="relative aspect-video">
                <iframe
                  src={informacionPrincipal.videoUrl}
                  title="Video sobre nosotros"
                  className="w-full h-full rounded-2xl"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 🎯 Call to Action - Llamada a la acción impactante */}
      <section 
        className="py-24 px-4 relative overflow-hidden"
        style={{ 
          animation: animate ? `fadeInUp 0.6s ease-out 1.7s both` : 'none',
          opacity: animate ? 1 : 0
        }}
      >
        {/* Fondo con patrón */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8b4b8] via-[#d4af37] to-[#a1887f]"></div>
        
        {/* Círculos decorativos */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-7xl mb-6 block animate-bounce">🍦</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-title drop-shadow-lg">
            ¿Listo para probar nuestros helados?
          </h2>
          <p className="text-xl text-white/95 mb-10 font-accent max-w-2xl mx-auto">
            Visítanos hoy y descubre por qué somos los favoritos de la ciudad
          </p>
          
          <button
            onClick={() => window.location.href = '/menu'}
            className="px-12 py-5 bg-white text-[#6d4c41] rounded-full font-bold text-lg
                     hover:bg-[#6d4c41] hover:text-white transition-all duration-300
                     hover:scale-110 hover:shadow-2xl transform active:scale-95
                     flex items-center gap-3 mx-auto group"
          >
            <span>Ver Menú Completo</span>
            <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </section>
      <style jsx global>{`
         
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SobreNosotros;