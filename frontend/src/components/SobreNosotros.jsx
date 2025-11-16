import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/SobreNosotros.css';

const SobreNosotros = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mision');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const response = await axios.get(`${api}/api/sobre-nosotros`);
        setData(response.data);
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
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando información...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="error-container">
        <p>No se pudo cargar la información</p>
      </div>
    );
  }

  const { informacionPrincipal, valores, estadisticas, galeria } = data;

  return (
    <div className="sobre-nosotros-page">
      {/* Hero Section */}
      <section className="hero-about">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="animate-fade-in">{informacionPrincipal.titulo}</h1>
          <p className="subtitle animate-slide-up">{informacionPrincipal.subtitulo}</p>
        </div>
        <div className="scroll-indicator">
          <span>↓</span>
        </div>
      </section>

      {/* Main Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-image">
              <img 
                src={informacionPrincipal.imagenPrincipal || '/img/default-about.jpg'} 
                alt={informacionPrincipal.titulo}
                className="image-reveal"
              />
              <div className="image-overlay"></div>
            </div>
            <div className="story-content">
              <h2 className="section-title">Nuestra Historia</h2>
              <p className="story-text">{informacionPrincipal.descripcionPrincipal}</p>
              
              {/* Tabs para Misión/Visión */}
              <div className="tabs-container">
                <div className="tabs-header">
                  <button 
                    className={`tab ${activeTab === 'mision' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mision')}
                  >
                    Misión
                  </button>
                  <button 
                    className={`tab ${activeTab === 'vision' ? 'active' : ''}`}
                    onClick={() => setActiveTab('vision')}
                  >
                    Visión
                  </button>
                </div>
                <div className="tabs-content">
                  {activeTab === 'mision' && (
                    <div className="tab-panel fade-in">
                      <p>{informacionPrincipal.mision}</p>
                    </div>
                  )}
                  {activeTab === 'vision' && (
                    <div className="tab-panel fade-in">
                      <p>{informacionPrincipal.vision}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {estadisticas.map((stat, index) => (
              <div 
                key={stat.id} 
                className="stat-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="stat-icon">{stat.icono}</div>
                <div className="stat-number">{stat.valor}</div>
                <div className="stat-label">{stat.descripcion}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Nuestros Valores</h2>
          <div className="values-grid">
            {valores.map((valor, index) => (
              <div 
                key={valor.id} 
                className="value-card"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="value-icon">{valor.icono}</div>
                <h3 className="value-title">{valor.titulo}</h3>
                <p className="value-description">{valor.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {galeria && galeria.length > 0 && (
        <section className="gallery-section">
          <div className="container">
            <h2 className="section-title">Nuestra Galería</h2>
            <div className="gallery-grid">
              {galeria.map((imagen, index) => (
                <div 
                  key={imagen.id} 
                  className="gallery-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img 
                    src={imagen.imagenUrl} 
                    alt={imagen.titulo}
                    onError={(e) => e.target.src = '/img/default-gallery.jpg'}
                  />
                  <div className="gallery-overlay">
                    <h4>{imagen.titulo}</h4>
                    {imagen.descripcion && <p>{imagen.descripcion}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Section (si existe) */}
      {informacionPrincipal.videoUrl && (
        <section className="video-section">
          <div className="container">
            <h2 className="section-title">Conócenos mejor</h2>
            <div className="video-container">
              <iframe
                src={informacionPrincipal.videoUrl}
                title="Video sobre nosotros"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>¿Listo para probar nuestros helados?</h2>
            <p>Visítanos hoy y descubre por qué somos los favoritos de la ciudad</p>
            <button className="cta-button" onClick={() => window.location.href = '/menu'}>
              Ver Menú
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SobreNosotros;
