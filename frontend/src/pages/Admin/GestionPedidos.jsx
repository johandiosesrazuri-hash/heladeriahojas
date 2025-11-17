import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const GestionPedidos = () => {
  const { token } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('TODOS');
  const [detallesModal, setDetallesModal] = useState(null);
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
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await axios.get(`${api}/api/admin/pedidos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPedidos(response.data);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
      setNotification({
        show: true,
        message: "Error al cargar los pedidos. Inténtalo de nuevo.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      await axios.put(
        `${api}/api/admin/pedidos/${id}/estado?nuevoEstado=${nuevoEstado}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPedidos();
      setNotification({
        show: true,
        message: "Estado del pedido actualizado correctamente.",
        type: "success"
      });
    } catch (error) {
      console.error('Error actualizando estado:', error);
      setNotification({
        show: true,
        message: "Error al actualizar el estado del pedido.",
        type: "error"
      });
    }
  };

  const pedidosFiltrados = filtro === 'TODOS' 
    ? pedidos 
    : pedidos.filter(p => p.estado === filtro);

  const estadoColores = {
    'PENDIENTE': 'bg-yellow-100 text-yellow-800',
    'PENDIENTE_PAGO': 'bg-orange-100 text-orange-800',
    'CONFIRMADO': 'bg-blue-100 text-blue-800',
    'EN_PREPARACION': 'bg-purple-100 text-purple-800',
    'EN_CAMINO': 'bg-cyan-100 text-cyan-800',
    'ENTREGADO': 'bg-green-100 text-green-800',
    'CANCELADO': 'bg-red-100 text-red-800'
  };

  const estadoIconos = {
    'PENDIENTE': '⏱️',
    'PENDIENTE_PAGO': '💳',
    'CONFIRMADO': '✅',
    'EN_PREPARACION': '🍳',
    'EN_CAMINO': '🚚',
    'ENTREGADO': '🎉',
    'CANCELADO': '❌'
  };

  const estadosDisponibles = [
    'PENDIENTE',
    'PENDIENTE_PAGO',
    'CONFIRMADO',
    'EN_PREPARACION',
    'EN_CAMINO',
    'ENTREGADO',
    'CANCELADO'
  ];

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
            <p className="text-xl text-[#6d4c41] font-quicksand">Cargando pedidos...</p>
          </div>
        </div>

        {/* Estilos de Animación y Fuentes */}
        <style jsx global>{`
          
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
            Gestión de Pedidos
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-[#d4af37] to-[#e8b4b8] rounded-full"></span>
          </h1>
          <p 
            className="text-lg text-[#6d4c41] font-quicksand"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.3s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            Total: {pedidos.length} pedidos
          </p>
        </div>

        {/* Filtros */}
        <div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8"
          style={{ 
            animation: animate ? `fadeInUp 0.6s ease-out 0.5s both` : 'none',
            opacity: animate ? 1 : 0
          }}
        >
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFiltro('TODOS')}
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 font-montserrat ${
                filtro === 'TODOS'
                  ? 'bg-gradient-to-r from-[#dbbba6] to-[#d0aa96] text-white shadow-md'
                  : 'bg-[#f5f0e8] text-[#5d4037] hover:bg-[#e8d7c3]'
              }`}
            >
              Todos ({pedidos.length})
            </button>
            {estadosDisponibles.map(estado => {
              const cantidad = pedidos.filter(p => p.estado === estado).length;
              return (
                <button
                  key={estado}
                  onClick={() => setFiltro(estado)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 font-montserrat flex items-center ${
                    filtro === estado
                      ? 'bg-gradient-to-r from-[#dbbba6] to-[#d0aa96] text-white shadow-md'
                      : `${estadoColores[estado] || 'bg-[#f5f0e8] text-[#5d4037]'} hover:opacity-80`
                  }`}
                >
                  <span className="mr-2">{estadoIconos[estado]}</span>
                  {estado.replace('_', ' ')} ({cantidad})
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabla de Pedidos */}
        <div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
          style={{ 
            animation: animate ? `fadeInUp 0.6s ease-out 0.7s both` : 'none',
            opacity: animate ? 1 : 0
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#8d6e63] to-[#6d4c41] text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-cinzel">ID Pedido</th>
                  <th className="px-6 py-4 text-left font-cinzel">Cliente</th>
                  <th className="px-6 py-4 text-left font-cinzel">Fecha</th>
                  <th className="px-6 py-4 text-left font-cinzel">Total</th>
                  <th className="px-6 py-4 text-left font-cinzel">Estado</th>
                  <th className="px-6 py-4 text-left font-cinzel">Método Pago</th>
                  <th className="px-6 py-4 text-left font-cinzel">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-[#6d4c41] font-quicksand">
                      No hay pedidos en este estado
                    </td>
                  </tr>
                ) : (
                  pedidosFiltrados.map((pedido, index) => (
                    <tr 
                      key={pedido.id} 
                      className="border-t border-[#f5f0e8] hover:bg-[#f9f6f2] transition-colors duration-200"
                      style={{ 
                        animation: animate ? `fadeInUp 0.6s ease-out ${0.8 + index * 0.1}s both` : 'none',
                        opacity: animate ? 1 : 0
                      }}
                    >
                      <td className="px-6 py-4 font-semibold text-[#6d4c41] font-montserrat">#{pedido.id}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-[#3e2723] font-montserrat">{pedido.usuario?.nombre}</p>
                          <p className="text-sm text-[#6d4c41] font-quicksand">{pedido.usuario?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6d4c41] font-quicksand">
                        {new Date(pedido.fecha).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 font-bold text-[#4caf50] font-montserrat">
                        S/ {Number(pedido.total).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoColores[pedido.estado] || 'bg-[#f5f0e8]'}`}>
                          {estadoIconos[pedido.estado]} {pedido.estado.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-[#f5f0e8] rounded text-xs font-medium text-[#5d4037] font-quicksand">
                          {pedido.metodoPago?.toUpperCase() || 'NO ESPECIFICADO'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setDetallesModal(pedido)}
                          className="text-[#6d4c41] hover:text-[#5d4037] font-semibold text-sm mr-3 font-montserrat transition-colors"
                        >
                          Ver Detalles
                        </button>
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleCambiarEstado(pedido.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="text-sm border border-[#e8d7c3] rounded px-2 py-1 text-[#5d4037] bg-white hover:border-[#dbbba6] font-quicksand transition-colors"
                          defaultValue=""
                        >
                          <option value="">Cambiar estado...</option>
                          {estadosDisponibles.map(estado => (
                            <option key={estado} value={estado}>
                              {estadoIconos[estado]} {estado.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
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
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 animate-scale-in">
              
              {/* Encabezado Modal */}
              <div className="bg-gradient-to-r from-[#8d6e63] to-[#6d4c41] text-white p-6 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-2xl font-bold font-cinzel">Detalles del Pedido #{detallesModal.id}</h2>
                <button
                  onClick={() => setDetallesModal(null)}
                  className="text-white hover:text-[#f5f0e8] text-2xl font-bold transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Contenido Modal */}
              <div className="p-6">
                
                {/* Información del Cliente */}
                <div className="mb-6 pb-6 border-b border-[#f5f0e8]">
                  <h3 className="text-lg font-bold text-[#3e2723] mb-3 font-cinzel">Información del Cliente</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#6d4c41] font-quicksand">Nombre</p>
                      <p className="font-semibold text-[#3e2723] font-montserrat">{detallesModal.usuario?.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#6d4c41] font-quicksand">Email</p>
                      <p className="font-semibold text-[#3e2723] font-montserrat">{detallesModal.usuario?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Información del Pedido */}
                <div className="mb-6 pb-6 border-b border-[#f5f0e8]">
                  <h3 className="text-lg font-bold text-[#3e2723] mb-3 font-cinzel">Información del Pedido</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#6d4c41] font-quicksand">Fecha</p>
                      <p className="font-semibold font-montserrat">{new Date(detallesModal.fecha).toLocaleString('es-ES')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#6d4c41] font-quicksand">Total</p>
                      <p className="font-bold text-[#4caf50] text-lg font-montserrat">S/ {Number(detallesModal.total).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#6d4c41] font-quicksand">Estado</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoColores[detallesModal.estado]}`}>
                        {estadoIconos[detallesModal.estado]} {detallesModal.estado.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-[#6d4c41] font-quicksand">Método de Pago</p>
                      <p className="font-semibold font-montserrat">{detallesModal.metodoPago?.toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#6d4c41] font-quicksand">Pagado</p>
                      <p className={`font-semibold ${detallesModal.pagado ? 'text-[#4caf50]' : 'text-[#f44336]'}`}>
                        {detallesModal.pagado ? '✓ Sí' : '✗ No'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Información de Entrega */}
                {detallesModal.delivery && (
                  <div className="mb-6 pb-6 border-b border-[#f5f0e8]">
                    <h3 className="text-lg font-bold text-[#3e2723] mb-3 font-cinzel">Información de Entrega</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <p className="text-sm text-[#6d4c41] font-quicksand">Receptor</p>
                        <p className="font-semibold font-montserrat">{detallesModal.delivery.nombreReceptor}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#6d4c41] font-quicksand">Dirección</p>
                        <p className="font-semibold font-montserrat">{detallesModal.delivery.direccion}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-[#6d4c41] font-quicksand">Ciudad</p>
                          <p className="font-semibold font-montserrat">{detallesModal.delivery.ciudad}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6d4c41] font-quicksand">Teléfono</p>
                          <p className="font-semibold font-montserrat">{detallesModal.delivery.telefono}</p>
                        </div>
                      </div>
                      {detallesModal.delivery.instruccionesEspeciales && (
                        <div>
                          <p className="text-sm text-[#6d4c41] font-quicksand">Instrucciones</p>
                          <p className="font-semibold text-[#3e2723] italic font-montserrat">
                            {detallesModal.delivery.instruccionesEspeciales}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Botón Cerrar */}
                <button
                  onClick={() => setDetallesModal(null)}
                  className="w-full bg-gradient-to-r from-[#dbbba6] to-[#d0aa96] hover:from-[#d0aa96] hover:to-[#c4a08d] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 font-montserrat shadow-md hover:shadow-lg"
                >
                  Cerrar
                </button>
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

export default GestionPedidos;