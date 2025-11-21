import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Promociones = () => {
  const [promociones, setPromociones] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const response = await axios.get(`${api}/api/promociones`);

        if (response.data && Array.isArray(response.data)) {
          const validPromos = response.data.map((promo) => ({
            ...promo,
            imagenUrl: promo.imagenUrl || "/img/promociones/default.png",
          }));
          setPromociones(validPromos);
        }
      } catch (error) {
        console.error("❌ Error al cargar promociones:", error);
        setNotification({
          show: true,
          message: "Error al cargar promociones. Inténtalo de nuevo.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  const handleAddPromo = (promo) => {
    const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const imageUrl = promo.imagenUrl ? `${api}${promo.imagenUrl}` : "/img/promociones/default.png";

    addItem({
      id: `promo-${promo.id}`,
      name: promo.nombrePromo,
      price: Number(promo.precioTotal) || 0,
      image: imageUrl,
      quantity: 1,
      type: 'promocion',
      productos: promo.productos 
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
    <section className="py-12 px-4 md:px-8 lg:px-16 min-h-screen bg-gradient-to-b from-[#fef9f4] to-[#fef7f0]">
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

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl text-[#3e2723] mb-4 font-cinzel">
            Promociones Especiales
          </h1>
          <p className="text-lg text-[#6d4c41] max-w-2xl mx-auto font-quicksand">
            Descubre nuestras ofertas exclusivas y combina tus sabores favoritos
          </p>
        </div>

        {/* Contenedor de Promociones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#dbbba6] border-t-transparent"></div>
              <p className="mt-4 text-[#6d4c41] text-lg font-quicksand">
                Cargando promociones...
              </p>
            </div>
          ) : promociones.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-2xl font-bold text-[#3e2723] mb-2 font-cinzel">
                No hay promociones disponibles
              </h3>
              <p className="text-[#6d4c41] font-quicksand">
                Vuelve pronto para conocer nuestras ofertas especiales
              </p>
            </div>
          ) : (
            promociones.map((promo, index) => (
              <div
                key={promo.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group flex flex-col"
              >
                {/* Imagen de la Promoción con efecto zoom */}
                <div className="relative h-64 overflow-hidden flex-shrink-0">
                  <img
                    src={promo.imagenUrl ? `http://localhost:8080${promo.imagenUrl}` : "/img/promociones/default.png"}
                    alt={promo.nombrePromo}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "/img/promociones/default.png";
                    }}
                  />
                  
                  {/* Badge de Descuento */}
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {promo.descuento}% OFF
                  </div>
                  
                  {/* Badge de Promoción */}
                  <div className="absolute top-4 left-4 bg-[#dbbba6] text-[#5d4037] px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <span className="mr-1">🎁</span>
                    Promoción
                  </div>
                </div>

                {/* Contenido de la Tarjeta */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-[#3e2723] mb-2 font-cinzel">
                    {promo.nombrePromo}
                  </h3>
                  
                  <p className="text-[#6d4c41] text-sm mb-4 line-clamp-2 font-quicksand">
                    {promo.descripcion}
                  </p>

                  {/* Productos incluidos en la promoción */}
                  {promo.productos && promo.productos.length > 0 && (
                    <div className="mb-4 p-3 bg-[#f9f6f2] rounded-lg">
                      <p className="text-xs text-[#6d4c41] font-semibold mb-2 font-quicksand">Incluye:</p>
                      <ul className="space-y-1">
                        {promo.productos.map((prod, idx) => (
                          <li key={idx} className="text-xs text-[#3e2723] flex items-center font-quicksand">
                            <span className="mr-2">🍦</span>
                            {prod.cantidad}x {prod.nombre}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Precio y Botón - Centrados */}
                  <div className="mt-auto text-center">
                    <div className="mb-3">
                      {promo.precioRegular && (
                        <span className="text-sm text-gray-500 line-through block font-quicksand">
                          S/ {Number(promo.precioRegular).toFixed(2)}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-[#6d4c41] font-cinzel block">
                        S/ {Number(promo.precioTotal).toFixed(2)}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleAddPromo(promo)}
                      className="w-full px-4 py-2 bg-[#dbbba6] hover:bg-[#d0aa96] text-[#5d4037] rounded-full font-medium transition-colors duration-300 flex items-center justify-center font-montserrat"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Estilos */}
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

export default Promociones;