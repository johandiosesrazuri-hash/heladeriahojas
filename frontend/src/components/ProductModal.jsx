import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';

const ProductModal = ({ product, isOpen, onClose }) => {
  const { addItem } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addItem({
      id: `menu-${product.id}`,
      productoId: product.id,
      name: product.nombre,
      price: Number(product.precio) || 0,
      image: `http://localhost:8080${product.imagen}` || '/img/default.png',
      quantity: 1
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
          aria-label="Cerrar modal"
        >
          <svg className="w-6 h-6 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Imagen del producto */}
          <div className="relative h-64 md:h-full min-h-[400px] bg-neutral-100">
            <img
              src={`http://localhost:8080${product.imagen}`}
              alt={product.nombre}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/img/default.png';
              }}
            />
            {/* Badge de disponibilidad */}
            <div className="absolute top-4 left-4 px-4 py-2 bg-secondary/90 backdrop-blur-sm text-white rounded-full text-sm font-bold shadow-lg">
              ✓ Disponible
            </div>
          </div>

          {/* Información del producto */}
          <div className="p-8 md:p-10 flex flex-col">
            <div className="flex-grow">
              <h2 id="modal-title" className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4 font-title">
                {product.nombre}
              </h2>

              <p className="text-lg text-neutral-600 mb-6 font-body leading-relaxed">
                {product.descripcion || 'Delicioso producto artesanal elaborado con ingredientes naturales de la más alta calidad.'}
              </p>

              {/* Detalles adicionales */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-neutral-700">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-body">Ingredientes 100% naturales</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-700">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  <span className="font-body">Elaboración artesanal</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-700">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-body">Preparación inmediata</span>
                </div>
              </div>

              {/* Categorías/Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold">
                  {product.tipo || 'Helado'}
                </span>
                <span className="px-3 py-1 bg-secondary/10 text-secondary-dark rounded-full text-sm font-bold">
                  Artesanal
                </span>
              </div>
            </div>

            {/* Precio y botón */}
            <div className="border-t border-neutral-200 pt-6 mt-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-neutral-500 font-body mb-1">Precio</p>
                  <p className="text-4xl font-bold text-primary font-title">
                    S/ {Number(product.precio).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleAddToCart();
                    onClose();
                  }}
                  className="flex-1 px-6 py-4 bg-primary text-white rounded-full font-bold text-lg shadow-lg hover:bg-primary-dark hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 font-title"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Agregar al Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
