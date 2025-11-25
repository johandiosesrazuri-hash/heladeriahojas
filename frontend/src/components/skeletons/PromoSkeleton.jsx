import React from 'react';

const PromoSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden relative">
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
      
      {/* Badge skeleton */}
      <div className="absolute top-4 right-4 w-16 h-16 skeleton-shimmer rounded-full z-10"></div>
      
      {/* Imagen skeleton */}
      <div className="relative h-56 skeleton-shimmer"></div>
      
      {/* Contenido skeleton */}
      <div className="p-6 space-y-3">
        {/* Título */}
        <div className="h-7 skeleton-shimmer rounded w-4/5"></div>
        
        {/* Descripción línea 1 */}
        <div className="h-4 skeleton-shimmer rounded w-full"></div>
        
        {/* Descripción línea 2 */}
        <div className="h-4 skeleton-shimmer rounded w-3/4"></div>
        
        {/* "Incluye:" header */}
        <div className="h-4 skeleton-shimmer rounded w-1/3 mt-4"></div>
        
        {/* Items list */}
        <div className="space-y-2 mt-2">
          <div className="h-3 skeleton-shimmer rounded w-5/6"></div>
          <div className="h-3 skeleton-shimmer rounded w-4/5"></div>
          <div className="h-3 skeleton-shimmer rounded w-3/4"></div>
        </div>
        
        {/* Precios */}
        <div className="flex items-center gap-3 mt-4">
          <div className="h-6 skeleton-shimmer rounded w-20"></div>
          <div className="h-8 skeleton-shimmer rounded w-24"></div>
        </div>
        
        {/* Botón */}
        <div className="h-12 skeleton-shimmer rounded-full w-full mt-4"></div>
      </div>
    </div>
  );
};

export default PromoSkeleton;
