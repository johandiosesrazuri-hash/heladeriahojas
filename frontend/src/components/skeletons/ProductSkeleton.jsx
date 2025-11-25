import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(90deg, #e5e5e5 0%, #f0f0f0 50%, #e5e5e5 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }
      `}</style>
      
      {/* Imagen skeleton */}
      <div className="relative h-64 skeleton-shimmer"></div>
      
      {/* Contenido skeleton */}
      <div className="p-6 space-y-3">
        {/* Título */}
        <div className="h-6 skeleton-shimmer rounded w-3/4"></div>
        
        {/* Descripción línea 1 */}
        <div className="h-4 skeleton-shimmer rounded w-full"></div>
        
        {/* Descripción línea 2 */}
        <div className="h-4 skeleton-shimmer rounded w-5/6"></div>
        
        {/* Precio */}
        <div className="h-8 skeleton-shimmer rounded w-1/3 mt-4"></div>
        
        {/* Botón */}
        <div className="h-12 skeleton-shimmer rounded-full w-full mt-4"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
