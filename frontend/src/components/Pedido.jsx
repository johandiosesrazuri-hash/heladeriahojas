import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Pedido = () => {
  const { items, total, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const [formData, setFormData] = useState({
    direccion: '',
    telefono: '',
    ciudad: '',
    codigoPostal: '',
    instrucciones: '',
    nombreReceptor: user?.nombre || '',
    metodoPago: 'efectivo'
  });

  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.direccion || !formData.telefono || !formData.ciudad) {
      setNotification({
        show: true,
        message: "Por favor completa todos los campos obligatorios",
        type: "error"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';

      const pedidoData = {
        items: items.map(item => ({
          productoId: item.productoId || item.id,
          cantidad: item.quantity,
          precioUnitario: Number(item.price)
        })),
        delivery: {
          direccion: formData.direccion,
          telefono: formData.telefono,
          ciudad: formData.ciudad,
          codigoPostal: formData.codigoPostal,
          instruccionesEspeciales: formData.instrucciones,
          nombreReceptor: formData.nombreReceptor
        },
        metodoPago: formData.metodoPago
      };

      await axios.post(`${api}/api/pedidos`, pedidoData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      clearCart();
      setNotification({
        show: true,
        message: "¡Pedido realizado con éxito!",
        type: "success"
      });
      setTimeout(() => navigate('/mis-pedidos'), 1500);

    } catch (error) {
      console.error('Error al crear el pedido:', error.response?.data || error);
      setNotification({
        show: true,
        message: "Error al procesar el pedido. Por favor intenta de nuevo.",
        type: "error"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="py-16 px-4 md:px-8 lg:px-16 min-h-screen relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full gradient-hero"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmNWYwZTAiIGZpbGwtb3BhY2l0eT0iMC4zIiBkPSJNMzYgMzRjMC0yLjIwOTEzOSAxLjc5MDg2MS00IDQtNCAyLjIwOTEzOSAwIDQgMS43OTA4NjEgNCA0IDAgMi4yMDkxMzktMS43OTA4NjEgNC00IDQtMi4yMDkxMzkgMC00LTEuNzkwODYxLTQtNHptMCAwYzAtMi4yMDkxMzkgMS43OTA4NjEtNCA0LTQgMi4yMDkxMzkgMCA0IDEuNzkwODYxIDQgNCAwIDIuMjA5MTM5LTEuNzkwODYxIDQtNCA0LTIuMjA5MTM5IDAtNC0xLjc5MDg2MS40LTR6Ii8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
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
        <div className="relative z-10 container-custom flex flex-col items-center justify-center min-h-[70vh]">
          <div 
            className="text-center max-w-md mx-auto"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.1s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            <div className="mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-[#dbbba6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707L17 22h-2m0 0l-2.293-2.293c-.63-.63-1.077-.184-1.707.707L7 13H5m2 0h2m0 0h6m2 0h2m-6 0v2m0 0v-2" />
              </svg>
            </div>
            <h2 className="text-4xl md:text-5xl text-[#3e2723] font-bold mb-4 font-cinzel">Tu carrito está vacío</h2>
            <p className="text-lg text-[#6d4c41] mb-8 font-quicksand">
              Agrega algunos productos deliciosos para comenzar
            </p>
            <button 
              onClick={() => navigate('/menu')}
              className="px-8 py-3 bg-[#dbbba6] hover:bg-[#d0aa96] text-[#5d4037] rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 transform flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1h3a1 1 0 110 2h-3v3a1 1 0 11-2 0V6H6a1 1 0 010-2h3V3a1 1 0 01-1-1zm-1 9a1 1 0 100-2v-1a1 1 0 00-1 1v1H6a1 1 0 100 2v1a1 1 0 001 1v1h3a1 1 0 100 2v-1a1 1 0 001-1v-1h3a1 1 0 100-2v-1a1 1 0 00-1-1v-1z" clipRule="evenodd" />
              </svg>
              Ver Menú
            </button>
          </div>
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
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl text-[#3e2723] text-center font-bold mb-4 relative pb-4 font-cinzel"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.1s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            Finalizar Pedido
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-[#d4af37] to-[#e8b4b8] rounded-full"></span>
          </h2>
          
          <p 
            className="text-center text-[#6d4c41] mb-12 text-lg max-w-2xl mx-auto font-quicksand"
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-[#f5f0e8]">
              <h3 className="text-2xl font-bold text-[#3e2723] mb-6 font-cinzel">Resumen del Pedido</h3>
              
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                {items.map((item, index) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-md"
                    style={{ 
                      animation: animate ? `fadeInUp 0.6s ease-out ${0.7 + index * 0.1}s both` : 'none',
                      opacity: animate ? 1 : 0
                    }}
                  >
                    <div className="flex items-center">
                      <div className="bg-gray-200 rounded-lg p-2 mr-4">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 font-montserrat">{item.name}</h3>
                        <p className="text-sm text-gray-500 font-quicksand">x{item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900 font-montserrat">S/ {((Number(item.price) || 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-[#3e2723] font-montserrat">Total:</span>
                  <span className="text-2xl font-bold text-[#6d4c41] font-montserrat">S/ {(total || 0).toFixed(2)}</span>
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-[#f5f0e8]">
              <h3 className="text-2xl font-bold text-[#3e2723] mb-6 font-cinzel">Datos de Entrega</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="nombreReceptor" className="block text-sm font-medium text-[#3e2723] mb-1 font-montserrat">
                    Nombre del Receptor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombreReceptor"
                    name="nombreReceptor"
                    value={formData.nombreReceptor}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dbbba6] focus:border-[#dbbba6] transition-all duration-200 font-quicksand"
                    placeholder="Nombre completo"
                  />
                </div>

                <div>
                  <label htmlFor="direccion" className="block text-sm font-medium text-[#3e2723] mb-1 font-montserrat">
                    Dirección de Entrega <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dbbba6] focus:border-[#dbbba6] transition-all duration-200 font-quicksand"
                    placeholder="Dirección completa"
                  />
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-[#3e2723] mb-1 font-montserrat">
                    Teléfono de Contacto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dbbba6] focus:border-[#dbbba6] transition-all duration-200 font-quicksand"
                    placeholder="Número de teléfono"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="ciudad" className="block text-sm font-medium text-[#3e2723] mb-1 font-montserrat">
                      Ciudad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="ciudad"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dbbba6] focus:border-[#dbbba6] transition-all duration-200 font-quicksand"
                      placeholder="Ciudad"
                    />
                  </div>

                  <div>
                    <label htmlFor="codigoPostal" className="block text-sm font-medium text-[#3e2723] mb-1 font-montserrat">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      id="codigoPostal"
                      name="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dbbba6] focus:border-[#dbbba6] transition-all duration-200 font-quicksand"
                      placeholder="Código postal"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="instrucciones" className="block text-sm font-medium text-[#3e2723] mb-1 font-montserrat">
                    Instrucciones de Entrega
                  </label>
                  <textarea
                    id="instrucciones"
                    name="instrucciones"
                    value={formData.instrucciones}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dbbba6] focus:border-[#dbbba6] transition-all duration-200 font-quicksand"
                    placeholder="Ej: Tocar el timbre, dejar en portería, etc."
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="metodoPago" className="block text-sm font-medium text-[#3e2723] mb-1 font-montserrat">
                    Método de Pago <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="metodoPago"
                    name="metodoPago"
                    value={formData.metodoPago}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dbbba6] focus:border-[#dbbba6] transition-all duration-200 font-quicksand"
                  >
                    <option value="efectivo">💵 Efectivo (Pago contra entrega)</option>
                    <option value="transferencia">🏦 Transferencia bancaria</option>
                    <option value="tarjeta" disabled>💳 Tarjeta (Próximamente)</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  disabled={isProcessing || formData.metodoPago === 'tarjeta'}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dbbba6] font-montserrat ${
                    isProcessing || formData.metodoPago === 'tarjeta' 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-[#dbbba6] to-[#d0aa96] hover:from-[#d0aa96] hover:to-[#c4a08d] hover:shadow-xl'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
      `}</style>
    </section>
  );
};

export default Pedido;