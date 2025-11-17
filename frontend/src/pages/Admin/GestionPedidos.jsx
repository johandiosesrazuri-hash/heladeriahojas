import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const GestionPedidos = () => {
  const { token } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('TODOS');
  const [detallesModal, setDetallesModal] = useState(null);

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
    } catch (error) {
      console.error('Error actualizando estado:', error);
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

  const estadosDisponibles = [
    'PENDIENTE',
    'PENDIENTE_PAGO',
    'CONFIRMADO',
    'EN_PREPARACION',
    'EN_CAMINO',
    'ENTREGADO',
    'CANCELADO'
  ];

  if (loading) return <div className="text-center py-10">Cargando pedidos...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Pedidos</h1>
          <p className="text-gray-600">Total: {pedidos.length} pedidos</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltro('TODOS')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filtro === 'TODOS'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
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
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    filtro === estado
                      ? 'bg-blue-600 text-white'
                      : `${estadoColores[estado] || 'bg-gray-200'} hover:opacity-80`
                  }`}
                >
                  {estado.replace('_', ' ')} ({cantidad})
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabla de Pedidos */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-800 to-gray-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left">ID Pedido</th>
                <th className="px-6 py-4 text-left">Cliente</th>
                <th className="px-6 py-4 text-left">Fecha</th>
                <th className="px-6 py-4 text-left">Total</th>
                <th className="px-6 py-4 text-left">Estado</th>
                <th className="px-6 py-4 text-left">Método Pago</th>
                <th className="px-6 py-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No hay pedidos en este estado
                  </td>
                </tr>
              ) : (
                pedidosFiltrados.map(pedido => (
                  <tr key={pedido.id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-semibold text-blue-600">#{pedido.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{pedido.usuario?.nombre}</p>
                        <p className="text-sm text-gray-600">{pedido.usuario?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(pedido.fecha).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 font-bold text-green-600">
                      S/ {Number(pedido.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoColores[pedido.estado] || 'bg-gray-200'}`}>
                        {pedido.estado.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">
                        {pedido.metodoPago?.toUpperCase() || 'NO ESPECIFICADO'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setDetallesModal(pedido)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm mr-3"
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
                        className="text-sm border border-gray-300 rounded px-2 py-1 text-gray-700 hover:border-gray-500"
                        defaultValue=""
                      >
                        <option value="">Cambiar estado...</option>
                        {estadosDisponibles.map(estado => (
                          <option key={estado} value={estado}>
                            {estado.replace('_', ' ')}
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

        {/* Modal de Detalles */}
        {detallesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
              
              {/* Encabezado Modal */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Detalles del Pedido #{detallesModal.id}</h2>
                <button
                  onClick={() => setDetallesModal(null)}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Contenido Modal */}
              <div className="p-6">
                
                {/* Información del Cliente */}
                <div className="mb-6 pb-6 border-b">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Información del Cliente</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Nombre</p>
                      <p className="font-semibold text-gray-900">{detallesModal.usuario?.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-900">{detallesModal.usuario?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Información del Pedido */}
                <div className="mb-6 pb-6 border-b">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Información del Pedido</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Fecha</p>
                      <p className="font-semibold">{new Date(detallesModal.fecha).toLocaleString('es-ES')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="font-bold text-green-600 text-lg">S/ {Number(detallesModal.total).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estado</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoColores[detallesModal.estado]}`}>
                        {detallesModal.estado.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Método de Pago</p>
                      <p className="font-semibold">{detallesModal.metodoPago?.toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pagado</p>
                      <p className={`font-semibold ${detallesModal.pagado ? 'text-green-600' : 'text-red-600'}`}>
                        {detallesModal.pagado ? '✓ Sí' : '✗ No'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Información de Entrega */}
                {detallesModal.delivery && (
                  <div className="mb-6 pb-6 border-b">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Información de Entrega</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <p className="text-sm text-gray-600">Receptor</p>
                        <p className="font-semibold">{detallesModal.delivery.nombreReceptor}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Dirección</p>
                        <p className="font-semibold">{detallesModal.delivery.direccion}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Ciudad</p>
                          <p className="font-semibold">{detallesModal.delivery.ciudad}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Teléfono</p>
                          <p className="font-semibold">{detallesModal.delivery.telefono}</p>
                        </div>
                      </div>
                      {detallesModal.delivery.instruccionesEspeciales && (
                        <div>
                          <p className="text-sm text-gray-600">Instrucciones</p>
                          <p className="font-semibold text-gray-800 italic">
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
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionPedidos;