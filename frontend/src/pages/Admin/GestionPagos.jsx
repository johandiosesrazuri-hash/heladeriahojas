import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const GestionPagos = () => {
  const { token } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pedidoToValidate, setPedidoToValidate] = useState(null);

  useEffect(() => {
    fetchPedidos();
    const interval = setInterval(fetchPedidos, 10000); // Actualizar cada 10 segundos
    return () => clearInterval(interval);
  }, []);

  const fetchPedidos = async () => {
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const res = await axios.get(`${api}/api/pedidos/pendientes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filtrar solo los que tienen comprobante y no están pagados
      const pedidosConComprobante = res.data.filter(p => 
        p.comprobantePago && !p.pagado && p.estado === 'PENDIENTE_PAGO'
      );
      setPedidos(pedidosConComprobante);
    } catch (error) {
      console.error('Error fetching pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const openConfirmModal = (pedido) => {
    setPedidoToValidate(pedido);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setPedidoToValidate(null);
  };

  const validarPago = async () => {
    if (processing || !pedidoToValidate) return;

    setProcessing(true);
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      await axios.post(`${api}/api/payment/validar/${pedidoToValidate.id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showToast('success', '✅ Pago validado exitosamente. El cliente ha sido notificado.');
      setShowConfirmModal(false);
      setPedidoToValidate(null);
      await fetchPedidos();
    } catch (error) {
      console.error('Error al validar pago:', error);
      showToast('error', '❌ Error al validar el pago. Por favor intenta nuevamente.');
    } finally {
      setProcessing(false);
    }
  };

  const rechazarPago = async () => {
    if (processing || !selectedPedido) return;

    setProcessing(true);
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      await axios.post(
        `${api}/api/payment/rechazar/${selectedPedido.id}`,
        { motivo: motivoRechazo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      showToast('success', '✅ Pago rechazado. El pedido ha sido cancelado y el cliente notificado.');
      
      setShowRejectModal(false);
      setSelectedPedido(null);
      setMotivoRechazo('');
      await fetchPedidos();
    } catch (error) {
      console.error('Error al rechazar pago:', error);
      showToast('error', '❌ Error al rechazar el pago. Por favor intenta nuevamente.');
    } finally {
      setProcessing(false);
    }
  };

  const openRejectModal = (pedido) => {
    setSelectedPedido(pedido);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedPedido(null);
    setMotivoRechazo('');
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: '', message: '' });
    }, 4000);
  };

  const getImageUrl = (comprobante) => {
    const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    return `${api}${comprobante}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-primary/5">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-neutral-600 font-medium">Cargando pagos pendientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary/5 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Gestión de Pagos</h1>
              <p className="text-neutral-600">Valida o rechaza los comprobantes de pago</p>
            </div>
          </div>
          
          {pedidos.length > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">{pedidos.length} pago{pedidos.length !== 1 ? 's' : ''} pendiente{pedidos.length !== 1 ? 's' : ''} de validación</span>
            </div>
          )}
        </div>

        {/* Content */}
        {pedidos.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg border-2 border-neutral-100 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">¡Todo al día!</h3>
            <p className="text-neutral-600">No hay pagos pendientes de validación en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pedidos.map(pedido => {
              const numPedido = pedido.numeroPedido || pedido.id;
              return (
                <div key={pedido.id} className="bg-white rounded-3xl shadow-lg border-2 border-neutral-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Header del pedido */}
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-bold text-lg">Pedido #{numPedido}</h3>
                        <p className="text-amber-100 text-sm">
                          {pedido.usuario?.nombre || 'Usuario'} · {pedido.metodoPago?.toUpperCase()}
                        </p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <p className="text-white font-bold text-lg">S/ {pedido.total?.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6">
                    {/* Información del cliente */}
                    <div className="mb-4 bg-neutral-50 rounded-xl p-4">
                      <h4 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Datos del Cliente
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-neutral-500">Nombre:</span>
                          <p className="font-medium text-neutral-900">{pedido.usuario?.nombre}</p>
                        </div>
                        <div>
                          <span className="text-neutral-500">Teléfono:</span>
                          <p className="font-medium text-neutral-900">{pedido.usuario?.telefono || 'No especificado'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Comprobante */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Comprobante de Pago
                      </h4>
                      {pedido.comprobantePago ? (
                        <div className="relative group">
                          <img 
                            src={getImageUrl(pedido.comprobantePago)} 
                            alt="Comprobante" 
                            className="w-full h-64 object-contain bg-neutral-50 rounded-2xl border-2 border-neutral-200 cursor-pointer hover:border-primary transition-colors"
                            onClick={() => setSelectedImage(getImageUrl(pedido.comprobantePago))}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                               onClick={() => setSelectedImage(getImageUrl(pedido.comprobantePago))}>
                            <div className="bg-white rounded-full p-3 shadow-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-neutral-500 text-sm">Sin comprobante</p>
                        </div>
                      )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => openConfirmModal(pedido)}
                        disabled={processing}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {processing ? 'Procesando...' : 'Validar Pago'}
                      </button>
                      <button
                        onClick={() => openRejectModal(pedido)}
                        disabled={processing}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 px-6 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {processing ? 'Procesando...' : 'Rechazar'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de imagen ampliada */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img 
            src={selectedImage} 
            alt="Comprobante ampliado" 
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Modal de rechazo */}
      {showRejectModal && selectedPedido && (
        <div 
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
          onClick={closeRejectModal}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Rechazar Pago</h3>
                </div>
                <button
                  onClick={closeRejectModal}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-neutral-700 mb-4">
                Estás a punto de rechazar el pago del <span className="font-bold">Pedido #{selectedPedido.numeroPedido || selectedPedido.id}</span>. 
                El comprobante será eliminado y el cliente deberá subir uno nuevo.
              </p>

              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Motivo del rechazo (opcional)
                </label>
                <textarea
                  value={motivoRechazo}
                  onChange={(e) => setMotivoRechazo(e.target.value)}
                  placeholder="Ej: Comprobante ilegible, datos incorrectos, etc."
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all resize-none"
                  rows="3"
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeRejectModal}
                  disabled={processing}
                  className="flex-1 bg-neutral-100 text-neutral-700 font-semibold py-3 px-6 rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={rechazarPago}
                  disabled={processing}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 px-6 rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Rechazando...' : 'Confirmar Rechazo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de validación */}
      {showConfirmModal && pedidoToValidate && (
        <div 
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
          onClick={closeConfirmModal}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Validar Pago</h3>
                </div>
                <button
                  onClick={closeConfirmModal}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-neutral-700 text-lg">
                  ¿Confirmas la validación del pago para el <span className="font-bold text-emerald-600">Pedido #{pedidoToValidate.numeroPedido || pedidoToValidate.id}</span>?
                </p>
                <p className="text-neutral-500 text-sm mt-2">
                  El pedido pasará a estado <span className="font-semibold">CONFIRMADO</span> y el cliente será notificado automáticamente.
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-3">
                <button
                  onClick={closeConfirmModal}
                  disabled={processing}
                  className="flex-1 bg-neutral-100 text-neutral-700 font-semibold py-3 px-6 rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={validarPago}
                  disabled={processing}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Validando...' : 'Confirmar Validación'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-20 right-4 z-[10000] animate-fade-in">
          <div className={`rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4 min-w-[320px] border-2 ${
            toast.type === 'success' 
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-400' 
              : 'bg-gradient-to-r from-red-500 to-red-600 border-red-400'
          }`}>
            <div className="flex-shrink-0">
              {toast.type === 'success' ? (
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm leading-tight">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast({ show: false, type: '', message: '' })}
              className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionPagos;
