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
      promocionId: promo.id,
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
    <section className="py-16 px-4 md:px-8 lg:px-16 min-h-screen bg-neutral-50">
      {/* Notificación temporal */}
      {notification.show && (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
          <div className="bg-primary text-white px-6 py-3 rounded-full shadow-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium font-body">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h1 className="section-title">
            Promociones Especiales
          </h1>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto font-body">
            Descubre nuestras ofertas exclusivas y combina tus sabores favoritos
          </p>
        </div>

        {/* Contenedor de Promociones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-neutral-500 text-lg font-body">
                Cargando promociones...
              </p>
            </div>
          ) : promociones.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="text-6xl mb-6 animate-bounce-slow">🎁</div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-2 font-title">
                No hay promociones disponibles
              </h3>
              <p className="text-neutral-500 font-body">
                Vuelve pronto para conocer nuestras ofertas especiales
              </p>
            </div>
          ) : (
            promociones.map((promo, index) => (
              <div
                key={promo.id}
                className="bg-white rounded-3xl shadow-card overflow-hidden transition-all duration-300 hover:shadow-hover hover:-translate-y-2 group flex flex-col border border-neutral-100"
              >
                {/* Imagen de la Promoción con efecto zoom */}
                <div className="relative h-64 overflow-hidden flex-shrink-0 bg-neutral-50">
                  <img
                    src={promo.imagenUrl ? `http://localhost:8080${promo.imagenUrl}` : "/img/promociones/default.png"}
                    alt={promo.nombrePromo}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "/img/promociones/default.png";
                    }}
                  />

                  {/* Badge de Descuento */}
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg font-title">
                    {promo.descuento}% OFF
                  </div>

                  {/* Badge de Promoción */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm font-title">
                    <span className="mr-1">🎁</span>
                    Promoción
                  </div>
                </div>

                {/* Contenido de la Tarjeta */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-neutral-800 mb-2 font-title group-hover:text-primary transition-colors">
                    {promo.nombrePromo}
                  </h3>

                  <p className="text-neutral-500 text-sm mb-4 line-clamp-2 font-body leading-relaxed">
                    {promo.descripcion}
                  </p>

                  {/* Productos incluidos en la promoción */}
                  {promo.productos && promo.productos.length > 0 && (
                    <div className="mb-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                      <p className="text-xs text-neutral-400 font-bold mb-2 font-title uppercase tracking-wider">Incluye:</p>
                      <ul className="space-y-2">
                        {promo.productos.map((prod, idx) => (
                          <li key={idx} className="text-sm text-neutral-600 flex items-center font-body">
                            <span className="mr-2 text-primary">🍦</span>
                            <span className="font-bold mr-1">{prod.cantidad}x</span> {prod.nombre}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Precio y Botón - Centrados */}
                  <div className="mt-auto text-center pt-4 border-t border-neutral-50">
                    <div className="mb-4">
                      {promo.precioRegular && (
                        <span className="text-sm text-neutral-400 line-through block font-body">
                          S/ {Number(promo.precioRegular).toFixed(2)}
                        </span>
                      )}
                      <span className="text-3xl font-bold text-primary font-title block">
                        S/ {Number(promo.precioTotal).toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddPromo(promo)}
                      className="w-full px-6 py-3 bg-neutral-900 text-white rounded-full font-bold transition-all duration-300 flex items-center justify-center font-title hover:bg-primary hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      Agregar al Carrito
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
