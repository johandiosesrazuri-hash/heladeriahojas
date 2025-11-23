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
      // ✅ CORRECTO: sin /{id} para obtener todos los pedidos
      const response = await axios.get(`${api}/api/admin/dashboard/pedidos`, {
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
        `${api}/api/admin/dashboard/pedidos/${id}/estado?nuevoEstado=${nuevoEstado}`,
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

  const handleEliminarPedido = async (id) => {
    const confirmar = window.confirm(`¿Eliminar el pedido #${id}? Esta acción no se puede deshacer.`);
    if (!confirmar) return;

    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      await axios.delete(
        `${api}/api/admin/dashboard/pedidos/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotification({
        show: true,
        message: `Pedido #${id} eliminado correctamente.`,
        type: "success"
      });
      // Si el modal estaba abierto para este pedido, ciérralo
      if (detallesModal?.id === id) {
        setDetallesModal(null);
      }
      fetchPedidos();
    } catch (error) {
      console.error('Error eliminando pedido:', error);
      setNotification({
        show: true,
        message: "No se pudo eliminar el pedido. Inténtalo de nuevo.",
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
        </div>

        {/* Contenido principal */}
        <div className="relative z-10 container-custom flex flex-col items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-[#E19D7E] mb-6"></div>
            <p className="text-xl text-[#C1583B] font-quicksand">Cargando pedidos...</p>
          </div>
        </div>

        <style>{`
          .gradient-hero {
            background: linear-gradient(135deg, #DDD4CE 0%, #E19D7E 100%);
          }
        `}</style>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen px-4 py-10 md:px-8 lg:px-12 overflow-hidden bg-gradient-to-br from-[#DDD4CE] via-white to-[#E19D7E]/40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(225,157,126,0.15),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(58,163,143,0.12),transparent_30%),radial-gradient(circle_at_30%_80%,rgba(144,73,57,0.1),transparent_30%)]"></div>

      {/* Notificación */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-[fadeIn_0.2s_ease-out]">
          <div
            className={`px-6 py-4 rounded-2xl shadow-xl border flex items-center gap-3 ${
              notification.type === 'success'
                ? 'bg-[#e0f2f1] text-[#2f7669] border-[#b2dfdb]'
                : 'bg-[#fde7e7] text-[#c53030] border-[#fbd5d5]'
            }`}
          >
            <span className="text-xl">{notification.type === 'success' ? '✅' : '⚠️'}</span>
            <span className="font-semibold">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="relative z-10 container-custom space-y-8">
        {/* Encabezado */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#904939] font-semibold">Panel Admin</p>
            <h1
              className="text-3xl md:text-4xl font-bold text-[#904939] font-cinzel mt-1"
              style={{ animation: animate ? `fadeInUp 0.6s ease-out 0.1s both` : 'none' }}
            >
              Gestión de Pedidos
            </h1>
            <p className="text-[#C1583B] mt-1 font-quicksand">Total: {pedidos.length} pedidos</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchPedidos}
              className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2 text-[#904939] shadow-sm ring-1 ring-[#f0e5dd] hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              🔄 Refrescar
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div
          className="bg-white/85 backdrop-blur-md rounded-2xl shadow-xl border border-white/70 p-5"
          style={{ animation: animate ? `fadeInUp 0.6s ease-out 0.25s both` : 'none' }}
        >
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFiltro('TODOS')}
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 font-montserrat ${
                filtro === 'TODOS'
                  ? 'bg-gradient-to-r from-[#E19D7E] to-[#3aa38f] text-white shadow-lg shadow-[#E19D7E]/50'
                  : 'bg-[#DDD4CE] text-[#904939] hover:bg-[#E19D7E]/60'
              }`}
            >
              🌐 Todos ({pedidos.length})
            </button>
            {estadosDisponibles.map((estado) => {
              const cantidad = pedidos.filter((p) => p.estado === estado).length;
              return (
                <button
                  key={estado}
                  onClick={() => setFiltro(estado)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 font-montserrat ${
                    filtro === estado
                      ? 'bg-[#904939] text-white shadow-lg shadow-[#904939]/40'
                      : 'bg-white text-[#904939] border border-[#f0e5dd] hover:border-[#E19D7E]'
                  }`}
                >
                  <span>{estadoIconos[estado]}</span>
                  {estado.replace('_', ' ')} ({cantidad})
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabla */}
        <div
          className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/70 overflow-hidden"
          style={{ animation: animate ? `fadeInUp 0.6s ease-out 0.4s both` : 'none' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#904939] to-[#E19D7E] text-white">
                <tr className="text-left text-sm uppercase tracking-wider font-montserrat">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Pago</th>
                  <th className="px-6 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0e5dd]">
                {pedidosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-[#C1583B] font-quicksand">
                      No hay pedidos en este estado
                    </td>
                  </tr>
                ) : (
                  pedidosFiltrados.map((pedido, index) => (
                    <tr
                      key={pedido.id}
                      className="hover:bg-[#fef6f1] transition-colors"
                      style={{
                        animation: animate ? `fadeInUp 0.6s ease-out ${0.5 + index * 0.05}s both` : 'none'
                      }}
                    >
                      <td className="px-6 py-4 font-semibold text-[#904939] font-montserrat">#{pedido.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#904939] font-montserrat">{pedido.usuarioNombre}</p>
                        <p className="text-sm text-[#C1583B] font-quicksand">{pedido.usuarioEmail}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#C1583B] font-quicksand">
                        {new Date(pedido.fecha).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 font-bold text-[#3aa38f] font-montserrat">
                        S/ {Number(pedido.total).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                            estadoColores[pedido.estado] || 'bg-[#DDD4CE] text-[#904939]'
                          }`}
                        >
                          <span>{estadoIconos[pedido.estado]}</span>
                          {pedido.estado.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-[#DDD4CE] text-[#904939] font-quicksand">
                          {pedido.metodoPago?.toUpperCase() || 'NO ESPECIFICADO'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setDetallesModal(pedido)}
                            className="px-3 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#E19D7E] to-[#3aa38f] hover:brightness-110 transition-all shadow-sm"
                          >
                            Ver Detalles
                          </button>
                          <button
                            onClick={() => handleEliminarPedido(pedido.id)}
                            className="px-3 py-2 rounded-lg text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 transition-all shadow-sm"
                          >
                            Eliminar
                          </button>
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleCambiarEstado(pedido.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="text-sm border border-[#E19D7E] rounded-lg px-3 py-2 text-[#904939] bg-white hover:border-[#904939] transition-all"
                            defaultValue=""
                          >
                            <option value="">Cambiar estado...</option>
                            {estadosDisponibles.map((estado) => (
                              <option key={estado} value={estado}>
                                {estadoIconos[estado]} {estado.replace('_', ' ')}
                              </option>
                            ))}
                          </select>
                        </div>
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
              <div className="bg-gradient-to-r from-[#8d6e63] to-[#C1583B] text-white p-6 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-2xl font-bold font-cinzel">Detalles del Pedido #{detallesModal.id}</h2>
                <button
                  onClick={() => setDetallesModal(null)}
                  className="text-white hover:text-[#DDD4CE] text-2xl font-bold transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Contenido Modal */}
              <div className="p-6">
                
                {/* Información del Cliente */}
                <div className="mb-6 pb-6 border-b border-[#DDD4CE]">
                  <h3 className="text-lg font-bold text-[#904939] mb-3 font-cinzel">Información del Cliente</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#C1583B] font-quicksand">Nombre</p>
                      <p className="font-semibold text-[#904939] font-montserrat">{detallesModal.usuarioNombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#C1583B] font-quicksand">Email</p>
                      <p className="font-semibold text-[#904939] font-montserrat">{detallesModal.usuarioEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Información del Pedido */}
                <div className="mb-6 pb-6 border-b border-[#DDD4CE]">
                  <h3 className="text-lg font-bold text-[#904939] mb-3 font-cinzel">Información del Pedido</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#C1583B] font-quicksand">Fecha</p>
                      <p className="font-semibold font-montserrat">{new Date(detallesModal.fecha).toLocaleString('es-ES')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#C1583B] font-quicksand">Total</p>
                      <p className="font-bold text-[#4caf50] text-lg font-montserrat">S/ {Number(detallesModal.total).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#C1583B] font-quicksand">Estado</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoColores[detallesModal.estado]}`}>
                        {estadoIconos[detallesModal.estado]} {detallesModal.estado.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-[#C1583B] font-quicksand">Método de Pago</p>
                      <p className="font-semibold font-montserrat">{detallesModal.metodoPago?.toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#C1583B] font-quicksand">Pagado</p>
                      <p className={`font-semibold ${detallesModal.pagado ? 'text-[#4caf50]' : 'text-[#f44336]'}`}>
                        {detallesModal.pagado ? '✓ Sí' : '✗ No'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Información de Entrega */}
                {detallesModal.delivery && (
                  <div className="mb-6 pb-6 border-b border-[#DDD4CE]">
                    <h3 className="text-lg font-bold text-[#904939] mb-3 font-cinzel">Información de Entrega</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <p className="text-sm text-[#C1583B] font-quicksand">Receptor</p>
                        <p className="font-semibold font-montserrat">{detallesModal.delivery.nombreReceptor}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#C1583B] font-quicksand">Dirección</p>
                        <p className="font-semibold font-montserrat">{detallesModal.delivery.direccion}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-[#C1583B] font-quicksand">Ciudad</p>
                          <p className="font-semibold font-montserrat">{detallesModal.delivery.ciudad}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#C1583B] font-quicksand">Teléfono</p>
                          <p className="font-semibold font-montserrat">{detallesModal.delivery.telefono}</p>
                        </div>
                      </div>
                      {detallesModal.delivery.instruccionesEspeciales && (
                        <div>
                          <p className="text-sm text-[#C1583B] font-quicksand">Instrucciones</p>
                          <p className="font-semibold text-[#904939] italic font-montserrat">
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
                  className="w-full bg-gradient-to-r from-[#E19D7E] to-[#3aa38f] hover:brightness-110 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Estilos - SIN jsx ni global */}
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



