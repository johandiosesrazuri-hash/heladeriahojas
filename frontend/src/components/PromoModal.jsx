import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';

const PromoModal = ({ promo, isOpen, onClose }) => {
  const { addItem } = useCart();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !promo) return null;

  const handleAddToCart = () => {
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

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-modal-title"
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-all duration-300 shadow-lg"
          aria-label="Cerrar modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Contenido del modal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Imagen */}
          <div className="relative h-64 md:h-full bg-neutral-50">
            <img
              src={promo.imagenUrl ? `http://localhost:8080${promo.imagenUrl}` : "/img/promociones/default.png"}
              alt={promo.nombrePromo}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/img/promociones/default.png";
              }}
            />

            {/* Badge de Descuento */}
            <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg font-title">
              {promo.descuento}% OFF
            </div>

            {/* Badge de Promoción */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-sm font-title">
              <span className="mr-1">🎁</span>
              Promoción Especial
            </div>
          </div>

          {/* Información */}
          <div className="p-8 flex flex-col">
            <div className="flex-grow">
              <h2 id="promo-modal-title" className="text-3xl font-bold text-neutral-800 mb-4 font-title">
                {promo.nombrePromo}
              </h2>

              <p className="text-neutral-600 mb-6 font-body leading-relaxed">
                {promo.descripcion}
              </p>

              {/* Productos incluidos */}
              {promo.productos && promo.productos.length > 0 && (
                <div className="mb-6 p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <p className="text-xs text-neutral-400 font-bold mb-3 font-title uppercase tracking-wider flex items-center">
                    <span className="mr-2">📦</span>
                    Esta promoción incluye:
                  </p>
                  <ul className="space-y-2.5">
                    {promo.productos.map((prod, idx) => (
                      <li key={idx} className="text-base text-neutral-700 flex items-center font-body">
                        <span className="mr-3 text-primary text-lg">🍦</span>
                        <span className="font-bold mr-2 text-primary">{prod.cantidad}x</span>
                        <span>{prod.nombre}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Precio */}
              <div className="mb-6 p-5 bg-primary/5 rounded-2xl border border-primary/20">
                {promo.precioRegular && (
                  <div className="flex items-center mb-2">
                    <span className="text-sm text-neutral-400 line-through mr-2 font-body">
                      Precio regular: S/ {Number(promo.precioRegular).toFixed(2)}
                    </span>
                    <span className="text-xs text-red-500 font-bold font-title">
                      Ahorras S/ {(Number(promo.precioRegular) - Number(promo.precioTotal)).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-primary font-title">
                    S/ {Number(promo.precioTotal).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Botón agregar al carrito */}
            <button
              onClick={handleAddToCart}
              className="w-full px-6 py-4 bg-neutral-900 text-white rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center font-title hover:bg-primary hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Agregar al Carrito
            </button>

            <p className="text-xs text-neutral-400 text-center mt-4 font-body">
              Presiona ESC para cerrar
            </p>
          </div>
        </div>
      </div>

      {/* Estilos de animación */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PromoModal;
