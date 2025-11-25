import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import OrderProgress from './OrderProgress';

const MisPedidos = ({ embedded = false }) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [detalleModal, setDetalleModal] = useState(null);

  // Activar animación
  useEffect(() => {
    setTimeout(() => setAnimate(true), 10);
  }, []);

  useEffect(() => {
    if (!user) {
      setTimeout(() => {
        toast?.error?.('Debes iniciar sesión para ver tus pedidos');
        navigate('/login');
      }, 100);
      return;
    }
    fetchPedidos();
  }, [user]);

  const fetchPedidos = async () => {
    if (!user?.id || !token) return;
    
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
      toast?.error?.('Error al cargar tus pedidos. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Verificar si un pedido puede ser cancelado
  const puedeCancelar = (pedido) => {
    if (!pedido) return false;
    
    const estadosPermitidos = ['PENDIENTE', 'PENDIENTE_PAGO', 'CONFIRMADO'];
    const tiempoLimite = 30 * 60 * 1000; // 30 minutos en milisegundos
    
    // Validar estado
    const estadoValido = estadosPermitidos.includes(pedido.estado);
    
    // Validar tiempo (si la fecha no existe o es inválida, permitir cancelación)
    let dentroDelTiempo = true;
    if (pedido.fecha) {
      try {
        const fechaPedido = new Date(pedido.fecha);
        const tiempoTranscurrido = Date.now() - fechaPedido.getTime();
        dentroDelTiempo = tiempoTranscurrido <= tiempoLimite;
      } catch (e) {
        console.error('Error procesando fecha del pedido:', e);
      }
    }
    
    return estadoValido && dentroDelTiempo;
  };

  // Cancelar pedido
  const handleCancelarPedido = async (pedidoId) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar este pedido? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      await axios.put(
        `${api}/api/pedidos/${pedidoId}/estado`,
        { estado: 'CANCELADO' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast?.success?.('Pedido cancelado exitosamente');

      // Actualizar la lista de pedidos
      fetchPedidos();
      
      // Cerrar el modal si está abierto
      if (detalleModal && detalleModal.id === pedidoId) {
        setDetalleModal(null);
      }
    } catch (error) {
      console.error('Error al cancelar pedido:', error);
      toast?.error?.(error.response?.data?.message || 'Error al cancelar el pedido. Inténtalo de nuevo.');
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

  if (embedded) {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <span className="text-neutral-600 font-medium font-body">Cargando pedidos...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {pedidos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-neutral-500 font-body">No tienes pedidos aún</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pedidos.map((pedido) => {
              const estado = estadoInfo[pedido.estado] || estadoInfo['PENDIENTE'];
              return (
                <div key={pedido.id} className="bg-neutral-50 rounded-xl p-4 hover:bg-neutral-100 transition-colors border border-neutral-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-base font-bold text-neutral-800 font-title">Pedido #{pedido.id}</p>
                      <p className="text-xs text-neutral-500 font-body mt-0.5">
                        {new Date(pedido.fecha).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${estado.color}`}>
                      {estado.icono} {estado.texto}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-neutral-200">
                    <span className="text-sm text-neutral-600 font-body">{pedido.metodoPago?.toUpperCase() || 'EFECTIVO'}</span>
                    <span className="text-lg font-bold text-neutral-800 font-title">S/ {Number(pedido.total).toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => setDetalleModal(pedido)}
                    className="mt-3 w-full py-2 bg-white hover:bg-neutral-50 text-neutral-700 text-sm font-medium rounded-lg transition-all border border-neutral-200 font-body"
                  >
                    Ver detalles
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal con diseño profesional */}
        {detalleModal && ReactDOM.createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-neutral-900 text-white p-6 flex justify-between items-center">
                <h2 className="text-xl font-bold font-title">Pedido #{detalleModal.id}</h2>
                <button
                  onClick={() => setDetalleModal(null)}
                  className="text-white hover:text-neutral-300 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="mb-6 pb-6 border-b border-neutral-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${estadoInfo[detalleModal.estado]?.color || 'bg-gray-100'}`}>
                      {estadoInfo[detalleModal.estado]?.icono} {estadoInfo[detalleModal.estado]?.texto}
                    </span>
                    <span className="text-2xl font-bold text-neutral-800 font-title">
                      S/ {Number(detalleModal.total).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500 font-body">
                    {new Date(detalleModal.fecha).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="mb-6 pb-6 border-b border-neutral-200">
                  <h3 className="text-base font-bold text-neutral-800 mb-4 font-title">Progreso del Pedido</h3>
                  <OrderProgress estado={detalleModal.estado} />
                </div>
                <div className="mb-6 pb-6 border-b border-neutral-200">
                  <h3 className="text-base font-bold text-neutral-800 mb-4 font-title">Información de Pago</h3>
                  <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-600 font-body">Método de Pago</span>
                      <span className="font-semibold text-neutral-800 font-body">{detalleModal.metodoPago?.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-600 font-body">Estado de Pago</span>
                      <span className={`font-semibold ${detalleModal.pagado ? 'text-green-600' : 'text-orange-600'}`}>
                        {detalleModal.pagado ? '✓ Pagado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                </div>
                {detalleModal.delivery && (
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-neutral-800 mb-4 font-title">Información de Entrega</h3>
                    <div className="bg-neutral-50 rounded-lg p-4 space-y-2.5 text-sm font-body">
                      <div className="flex gap-2">
                        <span className="text-neutral-600 min-w-[100px]">Receptor:</span>
                        <span className="text-neutral-800 font-medium">{detalleModal.delivery.nombreReceptor}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-neutral-600 min-w-[100px]">Dirección:</span>
                        <span className="text-neutral-800 font-medium">{detalleModal.delivery.direccion}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-neutral-600 min-w-[100px]">Ciudad:</span>
                        <span className="text-neutral-800 font-medium">{detalleModal.delivery.ciudad}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-neutral-600 min-w-[100px]">Teléfono:</span>
                        <span className="text-neutral-800 font-medium">{detalleModal.delivery.telefono}</span>
                      </div>
                      {detalleModal.delivery.instruccionesEspeciales && (
                        <div className="flex gap-2 pt-2 border-t border-neutral-200">
                          <span className="text-neutral-600 min-w-[100px]">Instrucciones:</span>
                          <span className="text-neutral-800 font-medium">{detalleModal.delivery.instruccionesEspeciales}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex gap-3">
                  {puedeCancelar(detalleModal) && (
                    <button
                      onClick={() => handleCancelarPedido(detalleModal.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 font-title flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancelar Pedido
                    </button>
                  )}
                  <button
                    onClick={() => setDetalleModal(null)}
                    className={`${puedeCancelar(detalleModal) ? 'flex-1' : 'w-full'} bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 font-title`}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    );
  }

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
    <section className="py-12 px-4 md:px-8 lg:px-16 min-h-screen bg-neutral-50">
      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-2 font-title">
            Mis Pedidos
          </h1>
          <p className="text-neutral-500 font-body">
            {pedidos.length} {pedidos.length === 1 ? 'pedido realizado' : 'pedidos realizados'}
          </p>
        </div>

        {/* Lista de pedidos o mensaje vacío */}
        {pedidos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-neutral-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="text-xl font-bold text-neutral-800 mb-2 font-title">No tienes pedidos aún</h3>
              <p className="text-neutral-500 mb-6 font-body">Comienza a explorar nuestro menú y realiza tu primer pedido</p>
              <button 
                onClick={() => navigate('/menu')}
                className="px-6 py-3 bg-neutral-900 hover:bg-primary text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg inline-flex items-center font-title"
              >
                Ver Menú
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => {
              const estado = estadoInfo[pedido.estado] || estadoInfo['PENDIENTE'];
              
              return (
                <div 
                  key={pedido.id}
                  className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  <div className="p-6">
                    {/* Encabezado del pedido */}
                    <div className="flex flex-wrap justify-between items-start mb-4 gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-neutral-800 font-title mb-1">
                          Pedido #{pedido.id}
                        </h3>
                        <p className="text-sm text-neutral-500 font-body">
                          {new Date(pedido.fecha).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${estado.color}`}>
                          {estado.icono} {estado.texto}
                        </span>
                        <span className="text-xl font-bold text-neutral-800 font-title">
                          S/ {Number(pedido.total).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Información adicional */}
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-neutral-600 font-body">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{pedido.metodoPago?.toUpperCase() || 'EFECTIVO'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{pedido.pagado ? 'Pagado' : 'Pendiente de pago'}</span>
                      </div>
                    </div>

                    {/* Botón ver detalles */}
                    <button
                      onClick={() => setDetalleModal(pedido)}
                      className="w-full py-2.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-body border border-neutral-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        {detalleModal && ReactDOM.createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Encabezado del Modal */}
              <div className="bg-neutral-900 text-white p-6 flex justify-between items-center">
                <h2 className="text-xl font-bold font-title">Pedido #{detalleModal.id}</h2>
                <button
                  onClick={() => setDetalleModal(null)}
                  className="text-white hover:text-neutral-300 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Contenido del Modal */}
              <div className="p-6">
                {/* Estado y Total */}
                <div className="mb-6 pb-6 border-b border-neutral-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${estadoInfo[detalleModal.estado]?.color || 'bg-gray-100'}`}>
                      {estadoInfo[detalleModal.estado]?.icono} {estadoInfo[detalleModal.estado]?.texto}
                    </span>
                    <span className="text-2xl font-bold text-neutral-800 font-title">
                      S/ {Number(detalleModal.total).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500 font-body">
                    {new Date(detalleModal.fecha).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {/* Progreso del pedido */}
                <div className="mb-6 pb-6 border-b border-neutral-200">
                  <h3 className="text-base font-bold text-neutral-800 mb-4 font-title">Progreso del Pedido</h3>
                  <OrderProgress estado={detalleModal.estado} />
                </div>

                {/* Información de Pago */}
                <div className="mb-6 pb-6 border-b border-neutral-200">
                  <h3 className="text-base font-bold text-neutral-800 mb-4 font-title">Información de Pago</h3>
                  <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-600 font-body">Método de Pago</span>
                      <span className="font-semibold text-neutral-800 font-body">{detalleModal.metodoPago?.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-600 font-body">Estado de Pago</span>
                      <span className={`font-semibold ${detalleModal.pagado ? 'text-green-600' : 'text-orange-600'}`}>
                        {detalleModal.pagado ? '✓ Pagado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Información de Entrega (si existe) */}
                {detalleModal.delivery && (
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-neutral-800 mb-4 font-title">Información de Entrega</h3>
                    <div className="bg-neutral-50 rounded-lg p-4 space-y-2.5 text-sm font-body">
                      <div className="flex gap-2">
                        <span className="text-neutral-600 min-w-[100px]">Receptor:</span>
                        <span className="text-neutral-800 font-medium">{detalleModal.delivery.nombreReceptor}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-neutral-600 min-w-[100px]">Dirección:</span>
                        <span className="text-neutral-800 font-medium">{detalleModal.delivery.direccion}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-neutral-600 min-w-[100px]">Ciudad:</span>
                        <span className="text-neutral-800 font-medium">{detalleModal.delivery.ciudad}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-neutral-600 min-w-[100px]">Teléfono:</span>
                        <span className="text-neutral-800 font-medium">{detalleModal.delivery.telefono}</span>
                      </div>
                      {detalleModal.delivery.instruccionesEspeciales && (
                        <div className="flex gap-2 pt-2 border-t border-neutral-200">
                          <span className="text-neutral-600 min-w-[100px]">Instrucciones:</span>
                          <span className="text-neutral-800 font-medium">{detalleModal.delivery.instruccionesEspeciales}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex gap-3">
                  {puedeCancelar(detalleModal) && (
                    <button
                      onClick={() => handleCancelarPedido(detalleModal.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 font-title flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancelar Pedido
                    </button>
                  )}
                  <button
                    onClick={() => setDetalleModal(null)}
                    className={`${puedeCancelar(detalleModal) ? 'flex-1' : 'w-full'} bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 font-title`}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </section>
  );
};

export default MisPedidos;



