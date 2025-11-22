import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Testimonios = () => {
  const { user, token } = useAuth();
  const [testimonios, setTestimonios] = useState([]);
  const [miTestimonio, setMiTestimonio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  const [formData, setFormData] = useState({
    calificacion: 5,
    comentario: ''
  });

  // Cargar todos los testimonios al montar el componente
  useEffect(() => {
    fetchTestimonios();
  }, []);

  const fetchTestimonios = async () => {
    try {
      setLoading(true);
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';

      // Obtener todos los testimonios (público)
      const response = await axios.get(`${api}/api/testimonios`);
      setTestimonios(response.data);

      // Si está logueado, buscar su testimonio
      if (user && token) {
        try {
          const miTestimonioResponse = await axios.get(
            `${api}/api/testimonios/usuario/${user.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMiTestimonio(miTestimonioResponse.data);
        } catch (err) {
          if (err.response?.status === 403) {
            console.warn('No tienes permiso para acceder a este testimonio');
            setMiTestimonio(null);
          } else {
            console.error('Error al obtener el testimonio del usuario:', err);
          }
        }
      }

      setError(null);
    } catch (err) {
      console.error('Error al cargar testimonios:', err);
      if (err.response?.status === 404) {
        setTestimonios([]);
      } else {
        setError('Error al cargar testimonios');
      }
    } finally {
      setLoading(false);
      // Activar animación después de cargar los datos
      setTimeout(() => setAnimate(true), 5);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setNotification({
        show: true,
        message: "Debes iniciar sesión para dejar un testimonio",
        type: "error"
      });
      return;
    }

    if (!formData.comentario.trim()) {
      setNotification({
        show: true,
        message: "Por favor escribe un comentario",
        type: "error"
      });
      return;
    }

    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';

      await axios.post(
        `${api}/api/testimonios`,
        {
          usuarioId: user.id,
          calificacion: Number(formData.calificacion),
          comentario: formData.comentario
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotification({
        show: true,
        message: "¡Testimonio enviado con éxito!",
        type: "success"
      });

      setFormData({ calificacion: 5, comentario: '' });
      setShowForm(false);
      fetchTestimonios();
    } catch (err) {
      console.error('Error al enviar testimonio:', err);
      setNotification({
        show: true,
        message: "Error al enviar el testimonio. Intenta de nuevo.",
        type: "error"
      });
    }
  };

  // Ocultar notificación después de 3 segundos
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Funciones para el carrusel
  const nextTestimonio = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonios.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonio = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonios.length - 1 : prevIndex - 1
    );
  };

  // Auto-avanzar el carrusel cada 5 segundos
  useEffect(() => {
    if (testimonios.length > 0) {
      const interval = setInterval(() => {
        nextTestimonio();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonios]);

  if (loading) {
    return (
      <section className="py-16 px-4 md:px-8 lg:px-16 min-h-screen relative overflow-hidden bg-neutral-50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full gradient-hero"></div>
        </div>

        <div className="relative z-10 container-custom flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-primary text-lg font-body">Cargando testimonios...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 min-h-screen relative overflow-hidden bg-neutral-50">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full gradient-hero"></div>
      </div>

      {/* Notificación temporal */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className={`px-6 py-4 rounded-xl shadow-lg flex items-center ${notification.type === 'success' ? 'bg-secondary-light text-secondary-dark' : 'bg-red-100 text-red-800'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mr-3 ${notification.type === 'success' ? 'text-secondary-dark' : 'text-red-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {notification.type === 'success' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              )}
            </svg>
            <span className="font-medium font-body">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="relative z-10 container-custom">
        <div className="text-center mb-16">
          <h2
            className="section-title"
            style={{
              animation: animate ? `fadeInUp 0.6s ease-out 0.1s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            Lo que dicen nuestros clientes
          </h2>

          <p
            className="text-center text-neutral-500 mb-12 text-lg max-w-2xl mx-auto font-body"
            style={{
              animation: animate ? `fadeInUp 0.6s ease-out 0.3s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            Descubre las experiencias de quienes han disfrutado de nuestros productos
          </p>
        </div>

        {/* Sección de pestañas */}
        <div
          className="flex justify-center mb-10"
          style={{
            animation: animate ? `fadeInUp 0.6s ease-out 0.5s both` : 'none',
            opacity: animate ? 1 : 0
          }}
        >
          <div className="inline-flex bg-white/80 backdrop-blur-md rounded-full p-1.5 border border-white/50 shadow-soft">
            <button className="px-6 py-2.5 rounded-full bg-primary text-white font-bold font-title transition-all duration-300 shadow-sm">
              Todos los Testimonios
            </button>
            <button className="px-6 py-2.5 rounded-full text-neutral-500 font-bold font-title hover:bg-neutral-100 transition-all duration-300">
              Mis Testimonios ({miTestimonio ? 1 : 0})
            </button>
          </div>
        </div>

        {/* Carrusel de testimonios */}
        {testimonios.length === 0 ? (
          <div
            className="bg-white/80 backdrop-blur-md rounded-3xl shadow-card p-12 text-center border border-white/50 mb-12"
            style={{
              animation: animate ? `fadeInUp 0.6s ease-out 0.7s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            <div className="max-w-md mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-2xl font-bold text-neutral-800 mb-2 font-title">Aún no hay testimonios</h3>
              <p className="text-neutral-500 font-body">¡Sé el primero en compartir tu experiencia con nosotros!</p>
            </div>
          </div>
        ) : (
          <div
            className="relative mb-12"
            style={{
              animation: animate ? `fadeInUp 0.6s ease-out 0.7s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            {/* Carrusel principal - muestra 1 testimonio en móvil, 3 en desktop */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonios.map((test, index) => (
                  <div
                    key={test.id}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <div className="bg-white rounded-3xl shadow-card overflow-hidden max-w-3xl mx-auto border border-neutral-100">
                      <div className="p-8 md:p-10">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl font-title border-2 border-white shadow-sm">
                              {test.usuario?.nombre?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className="ml-4">
                              <h4 className="text-xl font-bold text-neutral-800 font-title">
                                {test.usuario?.nombre || 'Usuario Anónimo'}
                              </h4>
                              <p className="text-sm text-neutral-400 font-body">
                                {new Date(test.fecha).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-6 w-6 ${i < test.calificacion ? 'text-yellow-400' : 'text-neutral-200'}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-neutral-600 text-lg font-body mb-6 leading-relaxed italic">
                          "{test.comentario}"
                        </p>
                        <div className="flex justify-end">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary/20" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones de navegación */}
            <button
              onClick={prevTestimonio}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-primary hover:text-white text-neutral-400 transition-all duration-300 z-10 hover:scale-110"
              style={{
                animation: animate ? `fadeInUp 0.6s ease-out 0.9s both` : 'none',
                opacity: animate ? 1 : 0
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextTestimonio}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-primary hover:text-white text-neutral-400 transition-all duration-300 z-10 hover:scale-110"
              style={{
                animation: animate ? `fadeInUp 0.6s ease-out 0.9s both` : 'none',
                opacity: animate ? 1 : 0
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Indicadores del carrusel */}
            <div
              className="flex justify-center mt-8 space-x-2"
              style={{
                animation: animate ? `fadeInUp 0.6s ease-out 1.1s both` : 'none',
                opacity: animate ? 1 : 0
              }}
            >
              {testimonios.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-primary scale-125' : 'bg-neutral-300 hover:bg-primary/50'
                    }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Botón para agregar testimonio */}
        {user && !showForm && (
          <div
            className="text-center mb-12"
            style={{
              animation: animate ? `fadeInUp 0.6s ease-out 1.3s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            <button
              className="px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 transform inline-flex items-center font-title text-lg"
              onClick={() => setShowForm(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              ¡Déjanos tu opinión!
            </button>
          </div>
        )}

        {/* Formulario para nuevo testimonio */}
        {showForm && (
          <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 animate-scale-in border border-white/20">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-neutral-800 font-title">Deja tu testimonio</h3>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ calificacion: 5, comentario: '' });
                    }}
                    className="text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-neutral-700 mb-2 font-body">Calificación</label>
                    <div className="flex space-x-2 mt-2 justify-center bg-neutral-50 p-4 rounded-2xl">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          type="button"
                          className={`p-2 rounded-full transition-all duration-200 transform hover:scale-110 ${formData.calificacion >= num ? 'text-yellow-400' : 'text-neutral-200'}`}
                          onClick={() => setFormData(prev => ({ ...prev, calificacion: num }))}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <label htmlFor="comentario" className="block text-sm font-bold text-neutral-700 mb-2 font-body">Tu opinión</label>
                    <textarea
                      id="comentario"
                      name="comentario"
                      value={formData.comentario}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 font-body bg-neutral-50 focus:bg-white"
                      placeholder="Cuéntanos tu experiencia con nuestros helados..."
                      required
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button type="submit" className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 transform flex-1 font-title">
                      Enviar
                    </button>
                    <button
                      type="button"
                      className="px-6 py-3 bg-white text-neutral-500 border border-neutral-200 rounded-full font-bold transition-all duration-300 hover:bg-neutral-50 hover:text-neutral-700 flex-1 font-title"
                      onClick={() => {
                        setShowForm(false);
                        setFormData({ calificacion: 5, comentario: '' });
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-800 px-6 py-4 rounded-xl shadow-lg flex items-center max-w-md mx-auto mt-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium font-body">{error}</span>
          </div>
        )}
      </div>

      {/* Estilos de Animación y Fuentes */}
      <style jsx>{`
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
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
      `}</style>
    </section>
  );
};

export default Testimonios;
