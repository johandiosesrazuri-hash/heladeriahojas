import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const GestionContactos = () => {
  const { token } = useAuth();
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('TODOS');
  const [detallesModal, setDetallesModal] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [animate, setAnimate] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Activar animación después de que el componente se monte
  useEffect(() => {
    setTimeout(() => setAnimate(true), 10);
  }, []);

  // Ocultar notificación después de 3 segundos
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  useEffect(() => {
    fetchContactos();
  }, []);

  const fetchContactos = async () => {
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await axios.get(`${api}/api/admin/contactos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContactos(response.data);
    } catch (error) {
      console.error('Error cargando contactos:', error);
      setNotification({
        show: true,
        message: "Error al cargar los contactos. Inténtalo de nuevo.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContacto = async (id) => {
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      await axios.delete(`${api}/api/admin/contactos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContactos(contactos.filter(c => c.id !== id));
      setNotification({
        show: true,
        message: "Contacto eliminado correctamente.",
        type: "success"
      });
    } catch (error) {
      console.error('Error eliminando contacto:', error);
      setNotification({
        show: true,
        message: "Error al eliminar el contacto.",
        type: "error"
      });
    }
  };

  const contactosFiltrados = contactos.filter(c => {
    const coincideBusqueda = 
      c.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.asunto?.toLowerCase().includes(busqueda.toLowerCase());
    return coincideBusqueda;
  });

  if (loading) {
    return (
      <section className="py-16 px-4 md:px-8 lg:px-16 min-h-screen relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full gradient-hero"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmNWYwZTAiIGZpbGwtb3BhY2l0eT0iMC4zIiBkPSJNMzYgMzRjMC0yLjIwOTEzOSAxLjc5MDg2MS00IDQtNCAyLjIwOTEzOSAwIDQgMS43OTA4NjEgNCA0IDAgMi4yMDkxMzktMS43OTA4NjEgNC00IDQtMi4yMDkxMzkgMC40LTEuNzkwODYxLTQtNHptMCAwYzAtMi4yMDkxMzkgMS43OTA4NjEtNCA0LTQgMi4yMDkxMzkgMCA0IDEuNzkwODYxIDQgNCAwIDIuMjA5MTM5LTEuNzkwODYxIDQtNCA0LTIuMjA5MTM5IDAtNC0xLjc5MDg2MS40LTR6Ii8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmOGU1ZDAiIGZpbGwtb3BhY2l0eT0iMC4yIiBkPSJNNDAgNDBjMC0yLjIwOTEzOSAxLjc5MDg2MS00IDQtNCAyLjIwOTEzOSAwIDQgMS43OTA4NjEgNCA0IDAgMi4yMDkxMzktMS43OTA4NjEgNC00IDQtMi4yMDkxMzkgMC40LTEuNzkwODYxLTQtNHptMCAwYzAtMi4yMDkxMzkgMS43OTA4NjEtNCA0LTQgMi4yMDkxMzkgMCA0IDEuNzkwODYxIDQgNCAwIDIuMjA5MTM5LTEuNzkwODYxIDQtNCA0LTIuMjA5MTM5IDAtNC0xLjc5MDg2MS40LTR6Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        </div>

        {/* Contenido principal */}
        <div className="relative z-10 container-custom flex flex-col items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-[#dbbba6] mb-6"></div>
            <p className="text-xl text-[#6d4c41] font-quicksand">Cargando contactos...</p>
          </div>
        </div>

        {/* Estilos de Animación y Fuentes */}
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Montserrat:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap');
          
          .font-cinzel {
            font-family: 'Cinzel', serif;
          }
          
          .font-montserrat {
            font-family: 'Montserrat', sans-serif;
          }
          
          .font-quicksand {
            font-family: 'Quicksand', sans-serif;
          }
          
          .gradient-hero {
            background: linear-gradient(135deg, #f5f0e8 0%, #e8d7c3 100%);
          }
        `}</style>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 min-h-screen relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full gradient-hero"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmNWYwZTAiIGZpbGwtb3BhY2l0eT0iMC4zIiBkPSJNMzYgMzRjMC0yLjIwOTEzOSAxLjc5MDg2MS00IDQtNCAyLjIwOTEzOSAwIDQgMS43OTA4NjEgNCA0IDAgMi4yMDkxMzktMS43OTA4NjEgNC00IDQtMi4yMDkxMzkgMC40LTEuNzkwODYxLTQtNHptMCAwYzAtMi4yMDkxMzkgMS43OTA4NjEtNCA0LTQgMi4yMDkxMzkgMCA0IDEuNzkwODYxIDQgNCAwIDIuMjA5MTM5LTEuNzkwODYxIDQtNCA0LTIuMjA5MTM5IDAtNC0xLjc5MDg2MS40LTR6Ii8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmOGU1ZDAiIGZpbGwtb3BhY2l0eT0iMC4yIiBkPSJNNDAgNDBjMC0yLjIwOTEzOSAxLjc5MDg2MS00IDQtNCAyLjIwOTEzOSAwIDQgMS43OTA4NjEgNCA0IDAgMi4yMDkxMzktMS43OTA4NjEgNC00IDQtMi4yMDkxMzkgMC40LTEuNzkwODYxLTQtNHptMCAwYzAtMi4yMDkxMzkgMS43OTA4NjEtNCA0LTQgMi4yMDkxMzkgMCA0IDEuNzkwODYxIDQgNCAwIDIuMjA5MTM5LTEuNzkwODYxIDQtNCA0LTIuMjA5MTM5IDAtNC0xLjc5MDg2MS40LTR6Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      </div>

      {/* Notificación temporal */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className={`px-6 py-4 rounded-lg shadow-lg flex items-center ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mr-3 ${notification.type === 'success' ? 'text-green-500' : 'text-red-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {notification.type === 'success' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              )}
            </svg>
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="relative z-10 container-custom">
        {/* Encabezado */}
        <div className="mb-12 text-center">
          <h1 
            className="text-4xl md:text-5xl text-[#3e2723] font-bold mb-4 relative pb-4 font-cinzel"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.1s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            Gestión de Contactos
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-[#d4af37] to-[#e8b4b8] rounded-full"></span>
          </h1>
          <p 
            className="text-lg text-[#6d4c41] font-quicksand"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.3s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            Total: {contactos.length} mensajes
          </p>
        </div>

        {/* Barra de búsqueda */}
        <div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8"
          style={{ 
            animation: animate ? `fadeInUp 0.6s ease-out 0.5s both` : 'none',
            opacity: animate ? 1 : 0
          }}
        >
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#e8d7c3] focus-within:ring-2 focus-within:ring-[#dbbba6] focus-within:border-transparent">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#6d4c41]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre, email o asunto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 bg-transparent border-none focus:outline-none font-quicksand"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="text-[#6d4c41] hover:text-[#5d4037] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <p className="text-sm text-[#6d4c41] mt-2 font-quicksand">
            Mostrando {contactosFiltrados.length} de {contactos.length} contactos
          </p>
        </div>

        {/* Tabla de Contactos */}
        <div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
          style={{ 
            animation: animate ? `fadeInUp 0.6s ease-out 0.7s both` : 'none',
            opacity: animate ? 1 : 0
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#dbbba6] to-[#d0aa96] text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-cinzel">Nombre</th>
                  <th className="px-6 py-4 text-left font-cinzel">Email</th>
                  <th className="px-6 py-4 text-left font-cinzel">Asunto</th>
                  <th className="px-6 py-4 text-left font-cinzel">Fecha</th>
                  <th className="px-6 py-4 text-left font-cinzel">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {contactosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-[#6d4c41] font-quicksand">
                      {busqueda ? 'No se encontraron resultados' : 'No hay contactos registrados'}
                    </td>
                  </tr>
                ) : (
                  contactosFiltrados.map((contacto, index) => (
                    <tr 
                      key={contacto.id} 
                      className="border-t border-[#f5f0e8] hover:bg-[#f9f6f2] transition-colors duration-200"
                      style={{ 
                        animation: animate ? `fadeInUp 0.6s ease-out ${0.8 + index * 0.1}s both` : 'none',
                        opacity: animate ? 1 : 0
                      }}
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#3e2723] font-montserrat">{contacto.nombre}</p>
                      </td>
                      <td className="px-6 py-4">
                        <a 
                          href={`mailto:${contacto.email}`}
                          className="text-[#6d4c41] hover:text-[#5d4037] hover:underline font-quicksand transition-colors"
                        >
                          {contacto.email}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[#6d4c41] font-medium font-quicksand">{contacto.asunto}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6d4c41] font-quicksand">
                        {new Date(contacto.fecha).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setDetallesModal(contacto)}
                          className="text-[#6d4c41] hover:text-[#5d4037] font-semibold text-sm mr-3 font-montserrat transition-colors"
                        >
                          Leer
                        </button>
                        <button
                          onClick={() => handleDeleteContacto(contacto.id)}
                          className="text-[#c62828] hover:text-[#b71c1c] font-semibold text-sm font-montserrat transition-colors"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Detalles */}
        {detallesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full transform transition-all duration-300 scale-95 animate-scale-in">
              
              {/* Encabezado Modal */}
              <div className="bg-gradient-to-r from-[#dbbba6] to-[#d0aa96] text-white p-6 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-2xl font-bold font-cinzel">Mensaje de Contacto</h2>
                <button
                  onClick={() => setDetallesModal(null)}
                  className="text-white hover:text-[#f5f0e8] text-2xl font-bold transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Contenido Modal */}
              <div className="p-6 max-h-96 overflow-y-auto">
                
                {/* Información del Remitente */}
                <div className="mb-6 pb-6 border-b border-[#f5f0e8]">
                  <h3 className="text-lg font-bold text-[#3e2723] mb-3 font-cinzel">Información del Remitente</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#6d4c41] font-quicksand">Nombre</p>
                      <p className="font-semibold text-[#3e2723] font-montserrat">{detallesModal.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#6d4c41] font-quicksand">Email</p>
                      <a 
                        href={`mailto:${detallesModal.email}`}
                        className="font-semibold text-[#6d4c41] hover:text-[#5d4037] font-montserrat transition-colors"
                      >
                        {detallesModal.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Información del Mensaje */}
                <div className="mb-6 pb-6 border-b border-[#f5f0e8]">
                  <h3 className="text-lg font-bold text-[#3e2723] mb-3 font-cinzel">Mensaje</h3>
                  <div>
                    <p className="text-sm text-[#6d4c41] mb-2 font-quicksand">Asunto</p>
                    <p className="font-semibold text-[#3e2723] mb-4 font-montserrat">{detallesModal.asunto}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6d4c41] mb-2 font-quicksand">Contenido</p>
                    <div className="bg-[#f9f6f2] p-4 rounded-lg border border-[#e8d7c3]">
                      <p className="text-[#3e2723] whitespace-pre-wrap leading-relaxed font-quicksand">
                        {detallesModal.mensaje}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fecha */}
                <div className="mb-6">
                  <p className="text-sm text-[#6d4c41] font-quicksand">Recibido el</p>
                  <p className="font-semibold text-[#3e2723] font-montserrat">
                    {new Date(detallesModal.fecha).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </p>
                </div>

                {/* Botones de Acción */}
                <div className="flex gap-3">
                  <a
                    href={`mailto:${detallesModal.email}`}
                    className="flex-1 bg-gradient-to-r from-[#dbbba6] to-[#d0aa96] hover:from-[#d0aa96] hover:to-[#c4a08d] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 text-center font-montserrat shadow-md hover:shadow-lg"
                  >
                    Responder por Email
                  </a>
                  <button
                    onClick={() => setDetallesModal(null)}
                    className="flex-1 bg-[#f5f0e8] hover:bg-[#e8d7c3] text-[#5d4037] font-semibold py-3 px-4 rounded-lg transition-all duration-300 font-montserrat"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Estilos de Animación y Fuentes */}
      <style jsx global>{`
        
        .gradient-hero {
          background: linear-gradient(135deg, #f5f0e8 0%, #e8d7c3 100%);
        }
        
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
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default GestionContactos;