import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MisPedidos = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [detalleModal, setDetalleModal] = useState(null);

  // Activar animación
  useEffect(() => {
    setTimeout(() => setAnimate(true), 10);
  }, []);

  // Ocultar notificación
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  useEffect(() => {
    if (!user) {
      setNotification({
        show: true,
        message: "Debes iniciar sesión para ver tus pedidos",
        type: "error"
      });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    fetchPedidos();
  }, [user]);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await axios.get(`${api}/api/pedidos/usuario/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
            const pedidosOrdenados = response.data.sort((a, b) => 
        new Date(b.fecha) - new Date(a.fecha)
      );
      
      setPedidos(pedidosOrdenados);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
      setNotification({
        show: true,
        message: "Error al cargar tus pedidos. Inténtalo de nuevo.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  // Mapeo de estados con colores y iconos
  const estadoInfo = {
    'PENDIENTE': { color: 'bg-yellow-100 text-yellow-800', icono: '⏱️', texto: 'Pendiente' },
    'PENDIENTE_PAGO': { color: 'bg-orange-100 text-orange-800', icono: '💳', texto: 'Pendiente de Pago' },
    'CONFIRMADO': { color: 'bg-blue-100 text-blue-800', icono: '✅', texto: 'Confirmado' },
    'EN_PREPARACION': { color: 'bg-purple-100 text-purple-800', icono: '🍳', texto: 'En Preparación' },
    'EN_CAMINO': { color: 'bg-cyan-100 text-cyan-800', icono: '🚚', texto: 'En Camino' },
    'ENTREGADO': { color: 'bg-green-100 text-green-800', icono: '🎉', texto: 'Entregado' },
    'CANCELADO': { color: 'bg-red-100 text-red-800', icono: '❌', texto: 'Cancelado' }
  };

  if (loading) {
    return (
      <section className="py-16 px-4 md:px-8 lg:px-16 min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full gradient-hero"></div>
        </div>
        <div className="relative z-10 container-custom flex flex-col items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-[#E19D7E] mb-6"></div>
            <p className="text-xl text-[#C1583B] font-quicksand">Cargando tus pedidos...</p>
          </div>
        </div>
        <style>{`.gradient-hero { background: linear-gradient(135deg, #DDD4CE 0%, #E19D7E 100%); }`}</style>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 min-h-screen relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full gradient-hero"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmNWYwZTAiIGZpbGwtb3BhY2l0eT0iMC4zIiBkPSJNMzYgMzRjMC0yLjIwOTEzOSAxLjc5MDg2MS00IDQtNCAyLjIwOTEzOSAwIDQgMS43OTA4NjEgNCA0IDAgMi4yMDkxMzktMS43OTA4NjEgNC00IDQtMi4yMDkxMzkgMC00LTEuNzkwODYxLTQtNHptMCAwYzAtMi4yMDkxMzkgMS43OTA4NjEtNCA0LTQgMi4yMDkxMzkgMCA0IDEuNzkwODYxIDQgNCAwIDIuMjA5MTM5LTEuNzkwODYxIDQtNCA0LTIuMjA5MTM5IDAtNC0xLjc5MDg2MS00LTR6Ii8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      </div>

      {/* Notificación */}
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
            className="text-4xl md:text-5xl text-[#904939] font-bold mb-4 relative pb-4 font-cinzel"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.1s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            Mis Pedidos
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-[#E19D7E] to-[#904939] rounded-full"></span>
          </h1>
          <p 
            className="text-lg text-[#C1583B] font-quicksand"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.3s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            Historial de {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Lista de pedidos o mensaje vacío */}
        {pedidos.length === 0 ? (
          <div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.5s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            <div className="max-w-md mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-[#E19D7E] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="text-2xl font-bold text-[#904939] mb-2 font-cinzel">No tienes pedidos aún</h3>
              <p className="text-[#C1583B] mb-6 font-quicksand">¡Haz tu primer pedido y disfruta de nuestros deliciosos helados!</p>
              <button 
                onClick={() => navigate('/menu')}
                className="px-8 py-3 bg-[#E19D7E] hover:bg-[#3aa38f] text-[#904939] rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 transform inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1h3a1 1 0 110 2h-3v3a1 1 0 11-2 0V6H6a1 1 0 010-2h3V3a1 1 0 011-1zm-1 9a1 1 0 100-2v-1a1 1 0 00-1 1v1H6a1 1 0 100 2v1a1 1 0 001 1v1h3a1 1 0 100 2v-1a1 1 0 001-1v-1h3a1 1 0 100-2v-1a1 1 0 00-1-1v-1z" clipRule="evenodd" />
                </svg>
                Ver Menú
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pedidos.map((pedido, index) => {
              const estado = estadoInfo[pedido.estado] || estadoInfo['PENDIENTE'];
              
              return (
                <div 
                  key={pedido.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  style={{ 
                    animation: animate ? `fadeInUp 0.6s ease-out ${0.5 + index * 0.1}s both` : 'none',
                    opacity: animate ? 1 : 0
                  }}
                >
                  <div className="p-6">
                    {/* Encabezado del pedido */}
                    <div className="flex flex-wrap justify-between items-start mb-4 gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-[#904939] font-montserrat">
                          Pedido #{pedido.id}
                        </h3>
                        <p className="text-sm text-[#C1583B] font-quicksand">
                          {new Date(pedido.fecha).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${estado.color}`}>
                          {estado.icono} {estado.texto}
                        </span>
                        <span className="text-2xl font-bold text-[#4caf50] font-montserrat">
                          S/ {Number(pedido.total).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Información adicional */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-[#C1583B] font-quicksand">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#E19D7E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Método: <strong>{pedido.metodoPago?.toUpperCase() || 'EFECTIVO'}</strong></span>
                      </div>
                      <div className="flex items-center text-sm text-[#C1583B] font-quicksand">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#E19D7E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Pagado: <strong>{pedido.pagado ? 'Sí ✓' : 'No ✗'}</strong></span>
                      </div>
                    </div>

                    {/* Botón ver detalles */}
                    <button
                      onClick={() => setDetalleModal(pedido)}
                      className="w-full py-3 bg-gradient-to-r from-[#E19D7E] to-[#3aa38f] hover:from-[#3aa38f] hover:to-[#c4a08d] text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ver Detalles
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal de Detalles */}
        {detalleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Encabezado del Modal */}
              <div className="bg-gradient-to-r from-[#8d6e63] to-[#C1583B] text-white p-6 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-2xl font-bold font-cinzel">Pedido #{detalleModal.id}</h2>
                <button
                  onClick={() => setDetalleModal(null)}
                  className="text-white hover:text-[#DDD4CE] text-2xl font-bold transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Contenido del Modal */}
              <div className="p-6">
                {/* Estado y Total */}
                <div className="mb-6 pb-6 border-b border-[#DDD4CE]">
                  <div className="flex justify-between items-center mb-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${estadoInfo[detalleModal.estado]?.color || 'bg-gray-100'}`}>
                      {estadoInfo[detalleModal.estado]?.icono} {estadoInfo[detalleModal.estado]?.texto}
                    </span>
                    <span className="text-3xl font-bold text-[#4caf50]">
                      S/ {Number(detalleModal.total).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-[#C1583B]">
                    Realizado el {new Date(detalleModal.fecha).toLocaleString('es-ES')}
                  </p>
                </div>

                {/* Información de Pago */}
                <div className="mb-6 pb-6 border-b border-[#DDD4CE]">
                  <h3 className="text-lg font-bold text-[#904939] mb-3 font-cinzel">Información de Pago</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#C1583B]">Método de Pago</p>
                      <p className="font-semibold">{detalleModal.metodoPago?.toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#C1583B]">Estado de Pago</p>
                      <p className={`font-semibold ${detalleModal.pagado ? 'text-green-600' : 'text-red-600'}`}>
                        {detalleModal.pagado ? '✓ Pagado' : '✗ Pendiente'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Información de Entrega (si existe) */}
                {detalleModal.delivery && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-[#904939] mb-3 font-cinzel">Información de Entrega</h3>
                    <div className="bg-[#DDD4CE] p-4 rounded-lg space-y-2">
                      <p className="text-sm"><strong>Receptor:</strong> {detalleModal.delivery.nombreReceptor}</p>
                      <p className="text-sm"><strong>Dirección:</strong> {detalleModal.delivery.direccion}</p>
                      <p className="text-sm"><strong>Ciudad:</strong> {detalleModal.delivery.ciudad}</p>
                      <p className="text-sm"><strong>Teléfono:</strong> {detalleModal.delivery.telefono}</p>
                      {detalleModal.delivery.instruccionesEspeciales && (
                        <p className="text-sm"><strong>Instrucciones:</strong> {detalleModal.delivery.instruccionesEspeciales}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Botón Cerrar */}
                <button
                  onClick={() => setDetalleModal(null)}
                  className="w-full bg-gradient-to-r from-[#E19D7E] to-[#3aa38f] hover:from-[#3aa38f] hover:to-[#c4a08d] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Estilos */}
      <style>{`
        .gradient-hero {
          background: linear-gradient(135deg, #DDD4CE 0%, #E19D7E 100%);
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
      `}</style>
    </section>
  );
};

export default MisPedidos;



