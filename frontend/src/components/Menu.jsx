import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const Menu = () => {
  const [productos, setProductos] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const response = await axios.get(`${api}/api/productos`);
        setProductos(response.data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    fetchProductos();
  }, []);

  const handleAddToCart = (producto) => {
    addItem({
      id: `menu-${producto.id}`,
      productoId: producto.id,
      name: producto.nombre,
      price: Number(producto.precio) || 0,
      image: `http://localhost:8080${producto.imagen}` || '/img/default.png',
      quantity: 1
    });
    
    // Mostrar notificación
    setNotification({
      show: true,
      message: `${producto.nombre} agregado al carrito`
    });
    
    // Ocultar notificación después de 3 segundos
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 min-h-screen relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#fef7f0] via-[#fef9f4] to-[#fefcf8]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmNWYwZTAiIGZpbGwtb3BhY2l0eT0iMC4zIiBkPSJNMzYgMzRjMC0yLjIwOTEzOSAxLjc5MDg2MS00IDQtNCAyLjIwOTEzOSAwIDQgMS43OTA4NjEgNCA0IDAgMi4yMDkxMzktMS43OTA4NjEgNC00IDQtMi4yMDkxMzkgMC00LTEuNzkwODYxLTQtNHptMCAwYzAtMi4yMDkxMzkgMS43OTA4NjEtNCA0LTQgMi4yMDkxMzkgMCA0IDEuNzkwODYxIDQgNCAwIDIuMjA5MTM5LTEuNzkwODYxIDQtNCA0LTIuMjA5MTM5IDAtNC0xLjc5MDg2MS00LTR6Ii8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmOGU1ZDAiIGZpbGwtb3BhY2l0eT0iMC4yIiBkPSJNNDAgNDBjMC0yLjIwOTEzOSAxLjc5MDg2MS00IDQtNCAyLjIwOTEzOSAwIDQgMS43OTA4NjEgNCA0IDAgMi4yMDkxMzktMS43OTA4NjEgNC00IDQtMi4yMDkxMzkgMC00LTEuNzkwODYxLTQtNHptMCAwYzAtMi4yMDkxMzkgMS43OTA4NjEtNCA0LTQgMi4yMDkxMzkgMCA0IDEuNzkwODYxIDQgNCAwIDIuMjA5MTM5LTEuNzkwODYxIDQtNCA0LTIuMjA5MTM5IDAtNC0xLjc5MDg2MS00LTR6Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      </div>

      {/* Notificación temporal */}
      {notification.show && (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
          <div className="bg-[#dbbba6] text-[#5d4037] px-6 py-3 rounded-full shadow-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl text-[#3e2723] text-center font-bold mb-4 relative pb-4 font-cinzel">
            Nuestros Helados
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-[#d4af37] to-[#e8b4b8] rounded-full"></span>
          </h2>
          
          <p className="text-center text-[#6d4c41] mb-12 text-lg font-quicksand">
            Descubre nuestros deliciosos sabores artesanales
          </p>
        </div>

        {/* Contenedor de Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {productos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#dbbba6] border-t-transparent"></div>
              <p className="mt-4 text-[#6d4c41] text-lg font-quicksand">
                Cargando productos...
              </p>
            </div>
          ) : (
            productos.map((producto, index) => (
              <div
                key={producto.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 overflow-hidden group border border-[#f5f0e8]"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Imagen del Producto */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#fef7f0] to-[#fef9f4] h-48 md:h-56">
                  <img
                    src={`http://localhost:8080${producto.imagen}`}
                    alt={producto.nombre}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = '/img/default.png';
                    }}
                  />
                  
                  {/* Badge de Popularidad */}
                  <div className="absolute top-3 left-3 bg-[#d4af37] text-white px-3 py-1 rounded-full text-xs font-bold font-montserrat">
                    Popular
                  </div>
                </div>

                {/* Contenido de la Tarjeta */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-[#3e2723] mb-2 transition-colors duration-300 group-hover:text-[#6d4c41] font-cinzel">
                    {producto.nombre}
                  </h3>
                  
                  <p className="text-[#6d4c41] text-sm mb-4 line-clamp-2 font-quicksand">
                    {producto.descripcion}
                  </p>

                  {/* Precio */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-[#6d4c41] font-cinzel">
                        S/ {Number(producto.precio).toFixed(2)}
                      </span>
                    </div>
                    
                    {/* Badge de Calorías */}
                    <div className="bg-[#f5f0e8] text-[#6d4c41] px-2 py-1 rounded-full text-xs font-medium font-montserrat">
                      {Math.floor(Math.random() * 100 + 150)} cal
                    </div>
                  </div>

                  {/* Botón Agregar */}
                  <button
                    onClick={() => handleAddToCart(producto)}
                    className="w-full px-6 py-3 bg-[#dbbba6] hover:bg-[#d0aa96] text-[#5d4037] rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 transform font-montserrat flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            ))
          )}
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default Menu;