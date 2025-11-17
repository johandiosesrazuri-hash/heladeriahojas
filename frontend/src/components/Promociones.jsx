import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Promociones = () => {
  const [promociones, setPromociones] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [loading, setLoading] = useState(true);  // Estado de carga
  const { addItem } = useCart();

  // ✅ Cargar las promociones desde el backend
  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const response = await axios.get(`${api}/api/promociones`);

        if (response.data && Array.isArray(response.data)) {
          // Verificar si las promociones contienen la URL de la imagen
          const validPromos = response.data.map((promo) => ({
            ...promo,
            imagenUrl: promo.imagenUrl || "/img/promociones/default.png", // Asignar imagen predeterminada si no hay URL
          }));

          setPromociones(validPromos);  // Aquí se setean las promociones con la URL de la imagen
        }
      } catch (error) {
        console.error("Error al cargar promociones:", error);
        setNotification({
          show: true,
          message: "Error al cargar promociones. Inténtalo de nuevo.",
          type: "error",
        });
      } finally {
        setLoading(false);  // Detener el estado de carga
      }
    };

    fetchPromos();
  }, []);

  const handleAddPromo = (promo) => {
    addItem({
      id: `promo-${promo.id}`,
      name: promo.nombrePromo,
      price: Number(promo.precio) || 0,
      image: promo.imagenUrl || "/img/promociones/default.png",  // Usar URL de la promoción
      quantity: 1
    });

    setNotification({
      show: true,
      message: `${promo.nombrePromo} agregado al carrito`
    });

    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 min-h-screen relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#fef7f0] via-[#fef9f4] to-[#fefcf8]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,...')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,...')] opacity-30"></div>
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
          <h2 className="text-4xl md:text-5xl text-[#3e2723] text-center font-bold mb-4 relative pb-4" style={{ fontFamily: "'Pacifico', cursive" }}>
            Promociones Especiales
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-[#d4af37] to-[#e8b4b8] rounded-full"></span>
          </h2>

          <p className="text-center text-[#6d4c41] mb-12 text-lg" style={{ fontFamily: "'Quicksand', sans-serif" }}>
            ¡Aprovecha nuestras increíbles ofertas!
          </p>
        </div>

        {/* Contenedor de Promociones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#dbbba6] border-t-transparent"></div>
              <p className="mt-4 text-[#6d4c41] text-lg" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                Cargando promociones...
              </p>
            </div>
          ) : promociones.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="mt-4 text-[#6d4c41] text-lg" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                No hay promociones disponibles.
              </p>
            </div>
          ) : (
            promociones.map((promo, index) => {
              return (
                <div key={promo.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 overflow-hidden group border border-[#f5f0e8]" style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}>
                  {/* Imagen del Producto */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-[#fef7f0] to-[#fef9f4] h-48 md:h-56">
                    <img
                      src={promo.imagenUrl || "/img/promociones/default.png"}
                      alt={promo.nombrePromo}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => { e.target.src = "/img/promociones/default.png"; }}
                    />
                    
                    {/* Badge de Descuento */}
                    <div className="absolute top-3 right-3 bg-[#dbbba6] text-[#5d4037] px-4 py-2 rounded-full shadow-lg font-bold text-sm transform rotate-3 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                      {promo.descuento}% OFF
                    </div>
                  </div>

                  {/* Contenido de la Tarjeta */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-[#3e2723] mb-2 transition-colors duration-300 group-hover:text-[#6d4c41]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {promo.nombrePromo}
                    </h3>

                    <p className="text-[#6d4c41] text-sm mb-4 line-clamp-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                      {promo.descripcion}
                    </p>

                    {/* Precio */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-[#6d4c41]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          S/ {Number(promo.precio).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Botón Agregar */}
                    <button onClick={() => handleAddPromo(promo)} className="w-full px-6 py-3 bg-[#dbbba6] hover:bg-[#d0aa96] text-[#5d4037] rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 transform" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Agregar al Carrito
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Estilos de Animación */}
      <style jsx>{`
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

export default Promociones;
