import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MapaSelector from './MapaSelector';

const Pedido = () => {
  const { items, total, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [animate, setAnimate] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: ''
  });

  const [formData, setFormData] = useState({
    direccion: '',
    telefono: '',
    ciudad: '',
    codigoPostal: '',
    instrucciones: '',
    nombreReceptor: user?.nombre || '',
    metodoPago: 'efectivo',
    latitud: null,
    longitud: null
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Verificar autenticación al cargar
  useEffect(() => {
    if (!user || !token) {
      setNotification({
        show: true,
        message: 'Debes iniciar sesión para realizar un pedido',
        type: 'error'
      });
      setTimeout(() => navigate('/login'), 1500);
    }
  }, [user, token, navigate]);

  // Animación de entrada
  useEffect(() => {
    setTimeout(() => setAnimate(true), 10);
  }, []);

  // Ocultar notificación después de 3 s
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(
        () => setNotification({ show: false, message: '', type: '' }),
        3000
      );
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Verificar autenticación
    if (!user || !token) {
      setNotification({
        show: true,
        message: 'Debes iniciar sesión para realizar un pedido',
        type: 'error'
      });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    // Validaciones básicas
    if (!formData.direccion || !formData.telefono || !formData.ciudad) {
      setNotification({
        show: true,
        message: 'Por favor completa todos los campos obligatorios',
        type: 'error'
      });
      return;
    }

    setIsProcessing(true);
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';

      const pedidoData = {
        items: items.map(item => {
          // Si el ítem tiene `promocionId` lo enviamos, de lo contrario enviamos `productoId`
          if (item.promocionId) {
            return {
              promocionId: Number(item.promocionId),
              cantidad: item.quantity,
              precioUnitario: Number(item.price)
            };
          }
          return {
            productoId: Number(item.productoId || item.id),
            cantidad: item.quantity,
            precioUnitario: Number(item.price)
          };
        }),
        delivery: {
          direccion: formData.direccion,
          telefono: formData.telefono,
          ciudad: formData.ciudad,
          codigoPostal: formData.codigoPostal,
          instruccionesEspeciales: formData.instrucciones,
          nombreReceptor: formData.nombreReceptor,
          latitud: formData.latitud ? Number(formData.latitud) : null,
          longitud: formData.longitud ? Number(formData.longitud) : null
        },
        metodoPago: formData.metodoPago
      };

      await axios.post(`${api}/api/pedidos`, pedidoData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      clearCart();
      setNotification({
        show: true,
        message: '¡Pedido realizado con éxito!',
        type: 'success'
      });
      setTimeout(() => navigate('/mis-pedidos'), 1500);
    } catch (error) {
      console.error('Error al crear el pedido:', error.response?.data || error);
      setNotification({
        show: true,
        message: 'Error al procesar el pedido. Por favor intenta de nuevo.',
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Si el carrito está vacío
  if (items.length === 0) {
    return (
      <section className="py-16 px-4 md:px-8 lg:px-16 min-h-screen relative overflow-hidden bg-neutral-50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full gradient-hero"></div>
        </div>

        {notification.show && (
          <div className="fixed top-4 right-4 z-50 animate-fade-in">
            <div
              className={`px-6 py-4 rounded-xl shadow-lg flex items-center ${
                notification.type === 'success'
                  ? 'bg-secondary-light text-secondary-dark'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 mr-3 ${
                  notification.type === 'success' ? 'text-secondary-dark' : 'text-red-500'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {notification.type === 'success' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                )}
              </svg>
              <span className="font-medium font-body">{notification.message}</span>
            </div>
          </div>
        )}

        <div className="relative z-10 container-custom flex flex-col items-center justify-center min-h-[70vh]">
          <div
            className="text-center max-w-md mx-auto"
            style={{
              animation: animate ? `fadeInUp 0.6s ease-out 0.1s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            <div className="mb-8 bg-white p-6 rounded-full inline-block shadow-soft">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24 mx-auto text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707L17 22h-2m0 0l-2.293-2.293c-.63-.63-1.077-.184-1.707.707L7 13H5m2 0h2m0 0h6m2 0h2m-6 0v2m0 0v-2"
                />
              </svg>
            </div>
            <h2 className="text-4xl md:text-5xl text-neutral-900 font-bold mb-4 font-title">
              Tu carrito está vacío
            </h2>
            <p className="text-lg text-neutral-500 mb-8 font-body">
              Agrega algunos productos deliciosos para comenzar
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => navigate('/menu')}
                className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 flex items-center justify-center font-title"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1h3a1 1 0 110 2h-3v3a1 1 0 11-2 0V6H6a1 1 0 010-2h3V3a1 1 0 01-1-1zm-1 9a1 1 0 100-2v-1a1 1 0 00-1 1v1H6a1 1 0 100 2v1a1 1 0 001 1v1h3a1 1 0 100 2v-1a1 1 0 00-1-1v-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Ver Menú
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ---------- UI PRINCIPAL ---------- */
  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 min-h-screen relative overflow-hidden bg-neutral-50">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full gradient-hero"></div>
      </div>

      {/* Notificación temporal */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div
            className={`px-6 py-4 rounded-xl shadow-lg flex items-center ${
              notification.type === 'success'
                ? 'bg-secondary-light text-secondary-dark'
                : 'bg-red-100 text-red-800'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 mr-3 ${
                notification.type === 'success' ? 'text-secondary-dark' : 'text-red-500'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {notification.type === 'success' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              )}
            </svg>
            <span className="font-medium font-body">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="relative z-10 container-custom">
        {/* Título */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl text-neutral-900 text-center font-bold mb-4 relative pb-4 font-title"
            style={{
              animation: animate ? `fadeInUp 0.6s ease-out 0.1s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            Finalizar Pedido
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full"></span>
          </h2>

          <p
            className="text-center text-neutral-500 mb-12 text-lg max-w-2xl mx-auto font-body"
            style={{
              animation: animate ? `fadeInUp 0.6s ease-out 0.3s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            Completa tus datos para recibir tu pedido
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resumen del pedido */}
          <div
            className="lg:col-span-1"
            style={{
              animation: animate ? `fadeInUp 0.6s ease-out 0.5s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-8 border border-white/50">
              <h3 className="text-2xl font-bold text-neutral-800 mb-6 font-title flex items-center">
                <span className="bg-primary/10 p-2 rounded-lg mr-3 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </span>
                Resumen del Pedido
              </h3>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-neutral-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                    style={{
                      animation: animate
                        ? `fadeInUp 0.6s ease-out ${0.7 + index * 0.1}s both`
                        : 'none',
                      opacity: animate ? 1 : 0
                    }}
                  >
                    <div className="flex items-center">
                      <div className="w-16 h-16 flex-shrink-0 bg-neutral-50 rounded-xl overflow-hidden mr-4 border border-neutral-100">
                        <img
                          src={item.image || '/img/placeholder.png'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={e => (e.target.src = '/img/placeholder.png')}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-800 font-title">{item.name}</h3>
                        <p className="text-sm text-neutral-500 font-body">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-primary font-body text-lg">
                      S/ {((Number(item.price) || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-100">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-neutral-600 font-body">
                    Total a Pagar:
                  </span>
                  <span className="text-3xl font-bold text-primary font-title">
                    S/ {(total || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de datos de entrega */}
          <div
            className="lg:col-span-1"
            style={{
              animation: animate ? `fadeInUp 0.6s ease-out 0.9s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-8 border border-white/50">
              <h3 className="text-2xl font-bold text-neutral-800 mb-6 font-title flex items-center">
                <span className="bg-secondary/10 p-2 rounded-lg mr-3 text-secondary-dark">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </span>
                Datos de Entrega
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nombre del receptor */}
                <div>
                  <label
                    htmlFor="nombreReceptor"
                    className="block text-sm font-bold text-neutral-700 mb-2 font-body"
                  >
                    Nombre del Receptor <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombreReceptor"
                    name="nombreReceptor"
                    value={formData.nombreReceptor}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 font-body bg-white"
                    placeholder="Nombre completo"
                  />
                </div>

                {/* Dirección */}
                <div>
                  <label
                    htmlFor="direccion"
                    className="block text-sm font-bold text-neutral-700 mb-2 font-body"
                  >
                    Dirección de Entrega <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 font-body bg-white"
                    placeholder="Dirección completa"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label
                    htmlFor="telefono"
                    className="block text-sm font-bold text-neutral-700 mb-2 font-body"
                  >
                    Teléfono de Contacto <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 font-body bg-white"
                    placeholder="Número de teléfono"
                  />
                </div>

                {/* Mapa */}
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2 font-body">
                    Ubicación en el Mapa <span className="text-red-400">*</span>
                  </label>
                  <MapaSelector
                    onLocationSelect={data => {
                      setFormData(prev => ({
                        ...prev,
                        latitud: data.lat,
                        longitud: data.lng,
                        direccion: data.direccion || prev.direccion,
                        ciudad: data.ciudad || prev.ciudad,
                        codigoPostal: data.codigoPostal || prev.codigoPostal
                      }));
                    }}
                  />
                </div>

                {/* Ciudad y Código Postal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="ciudad"
                      className="block text-sm font-bold text-neutral-700 mb-2 font-body"
                    >
                      Ciudad <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="ciudad"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 font-body bg-white"
                      placeholder="Ciudad"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="codigoPostal"
                      className="block text-sm font-bold text-neutral-700 mb-2 font-body"
                    >
                      Código Postal
                    </label>
                    <input
                      type="text"
                      id="codigoPostal"
                      name="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 font-body bg-white"
                      placeholder="Código postal"
                    />
                  </div>
                </div>

                {/* Instrucciones */}
                <div>
                  <label
                    htmlFor="instrucciones"
                    className="block text-sm font-bold text-neutral-700 mb-2 font-body"
                  >
                    Instrucciones de Entrega
                  </label>
                  <textarea
                    id="instrucciones"
                    name="instrucciones"
                    value={formData.instrucciones}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 font-body bg-white"
                    placeholder="Ej: tocar timbre, dejar en portería, etc."
                  ></textarea>
                </div>

                {/* Método de pago */}
                <div>
                  <label
                    htmlFor="metodoPago"
                    className="block text-sm font-bold text-neutral-700 mb-2 font-body"
                  >
                    Método de Pago <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="metodoPago"
                    name="metodoPago"
                    value={formData.metodoPago}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 font-body bg-white"
                  >
                    <option value="efectivo">💵 Efectivo (Pago contra entrega)</option>
                    <option value="transferencia">🏦 Transferencia bancaria</option>
                    <option value="tarjeta" disabled>
                      💳 Tarjeta (Próximamente)
                    </option>
                  </select>
                </div>

                {/* Botón confirmar */}
                <button
                  type="submit"
                  disabled={isProcessing || formData.metodoPago === 'tarjeta'}
                  className={`w-full py-4 px-6 rounded-full font-bold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-primary/30 font-title mt-4 ${
                    isProcessing || formData.metodoPago === 'tarjeta'
                      ? 'bg-neutral-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary to-primary-dark hover:shadow-xl'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Procesando...
                    </div>
                  ) : (
                    'Confirmar Pedido'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pedido;