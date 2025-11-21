import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Carrito = () => {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const handleCheckout = () => {
    if (!user) {
      setNotification({
        show: true,
        message: "Debes iniciar sesión para continuar con tu pedido",
        type: "error"
      });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    if (items.length === 0) {
      setNotification({
        show: true,
        message: "Tu carrito está vacío",
        type: "error"
      });
      return;
    }
    navigate('/pedidos');
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId, itemName) => {
    removeItem(itemId);
    setNotification({
      show: true,
      message: `${itemName} eliminado del carrito`,
      type: "success"
    });
  };

  const handleClearCart = () => {
    if (items.length === 0) {
      setNotification({
        show: true,
        message: "Tu carrito ya está vacío",
        type: "error"
      });
      return;
    }
    clearCart();
    setNotification({
      show: true,
      message: "Carrito vaciado correctamente",
      type: "success"
    });
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-[#E19D7E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707L17 22h-2m0 0l-2.293-2.293c-.63-.63-1.077-.184-1.707.707L7 13H5m2 0h2m0 0h6m2 0h2m-6 0v2m0 0v-2" />
              </svg>
            </div>
            <h2 className="text-4xl md:text-5xl text-[#904939] font-bold mb-4 font-cinzel">Tu carrito está vacío</h2>
            <p className="text-lg text-[#C1583B] mb-8 font-quicksand">
              Agrega algunos productos deliciosos para comenzar
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => navigate('/menu')}
                className="px-8 py-3 bg-[#E19D7E] hover:bg-[#3aa38f] text-[#904939] rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 transform flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1h3a1 1 0 110 2h-3v3a1 1 0 11-2 0V6H6a1 1 0 010-2h3V3a1 1 0 01-1-1zm-1 9a1 1 0 100-2v-1a1 1 0 00-1 1v1H6a1 1 0 100 2v1a1 1 0 001 1v1h3a1 1 0 100 2v-1a1 1 0 001-1v-1h3a1 1 0 100-2v-1a1 1 0 00-1-1v-1z" clipRule="evenodd" />
                </svg>
                Ver Menú
              </button>
            </div>
          </div>
        </div>

        {/* Estilos de Animación y Fuentes */}
        <style jsx global>{`

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
      <div className="relative z-10 container-custom">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl text-[#904939] text-center font-bold mb-4 relative pb-4 font-cinzel"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.1s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            Tu Carrito
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-[#E19D7E] to-[#904939] rounded-full"></span>
          </h2>
          
          <p 
            className="text-center text-[#C1583B] mb-12 text-lg max-w-2xl mx-auto font-quicksand"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.3s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            Revisa tus productos antes de finalizar tu pedido
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div 
            className="lg:col-span-2"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.5s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-[#DDD4CE]">
              <div className="space-y-6">
                {items.map((item, index) => (
                  <div 
                    key={item.id}
                    className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-md"
                    style={{ 
                      animation: animate ? `fadeInUp 0.6s ease-out ${0.7 + index * 0.1}s both` : 'none',
                      opacity: animate ? 1 : 0
                    }}
                  >
                    {/* Imagen del producto */}
                    <div className="flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-24 h-24 object-cover rounded-lg"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                      />
                    </div>
                    
                    {/* Detalles del producto */}
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-[#904939] mb-1 font-montserrat">{item.name}</h3>
                      <p className="text-[#C1583B] font-medium mb-3 font-quicksand">S/ {(Number(item.price) || 0).toFixed(2)}</p>
                      
                      {/* Controles de cantidad */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm text-gray-600 font-quicksand">Cantidad:</span>
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button 
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 font-medium font-quicksand">{item.quantity}</span>
                          <button 
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      {/* Subtotal y eliminar */}
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-[#C1583B] font-quicksand">
                          Subtotal: <span className="font-bold">S/ {((Number(item.price) || 0) * item.quantity).toFixed(2)}</span>
                        </p>
                        <button 
                          onClick={() => handleRemoveItem(item.id, item.name)}
                          className="text-red-500 hover:text-red-700 transition-colors flex items-center text-sm font-quicksand"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m0 0h3m-3 0h3" />
                          </svg>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div 
            className="lg:col-span-1"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.9s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-[#DDD4CE] sticky top-6">
              <h3 className="text-2xl font-bold text-[#904939] mb-6 font-cinzel">Resumen del pedido</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-quicksand">Subtotal</span>
                  <span className="font-medium font-quicksand">S/ {(total || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-quicksand">Envío</span>
                  <span className="font-medium font-quicksand">S/ 5.00</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-lg font-bold text-[#904939] font-montserrat">Total</span>
                  <span className="text-xl font-bold text-[#C1583B] font-montserrat">S/ {((total || 0) + 5).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={handleCheckout}
                  className="w-full px-6 py-3 bg-[#E19D7E] hover:bg-[#3aa38f] text-[#904939] rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 transform flex items-center justify-center font-montserrat"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1h3a1 1 0 110 2h-3v3a1 1 0 11-2 0V6H6a1 1 0 010-2h3V3a1 1 0 01-1-1zm-1 9a1 1 0 100-2v-1a1 1 0 00-1 1v1H6a1 1 0 100 2v1a1 1 0 001 1v1h3a1 1 0 100 2v-1a1 1 0 001-1v-1h3a1 1 0 100-2v-1a1 1 0 00-1-1v-1z" clipRule="evenodd" />
                  </svg>
                  Continuar con el pedido
                </button>
                
                <button 
                  onClick={handleClearCart}
                  className="w-full px-6 py-3 bg-white text-[#C1583B] border-2 border-[#C1583B] rounded-full font-semibold transition-all duration-300 hover:bg-[#C1583B] hover:text-white hover:-translate-y-1 font-montserrat"
                >
                  Vaciar carrito
                </button>
                
                <button 
                  onClick={() => navigate('/menu')}
                  className="w-full px-6 py-3 bg-white text-[#C1583B] border border-gray-300 rounded-full font-semibold transition-all duration-300 hover:bg-gray-100 font-montserrat"
                >
                  Seguir comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos de Animación y Fuentes */}
      <style jsx global>{`

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

export default Carrito;



