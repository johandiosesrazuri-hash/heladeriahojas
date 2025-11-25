import React from 'react';

const PromoSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-pulse">
      {/* Badge skeleton */}
      <div className="absolute top-4 right-4 w-16 h-16 bg-neutral-200 rounded-full z-10"></div>
      
      {/* Imagen skeleton */}
      <div className="relative h-56 bg-neutral-200"></div>
      
      {/* Contenido skeleton */}
      <div className="p-6 space-y-3">
        {/* Título */}
        <div className="h-7 bg-neutral-200 rounded w-4/5"></div>
        
        {/* Descripción línea 1 */}
        <div className="h-4 bg-neutral-200 rounded w-full"></div>
        
        {/* Descripción línea 2 */}
        <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
        
        {/* "Incluye:" header */}
        <div className="h-4 bg-neutral-200 rounded w-1/3 mt-4"></div>
        
        {/* Items list */}
        <div className="space-y-2 mt-2">
          <div className="h-3 bg-neutral-200 rounded w-5/6"></div>
          <div className="h-3 bg-neutral-200 rounded w-4/5"></div>
          <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
        </div>
        
        {/* Precios */}
        <div className="flex items-center gap-3 mt-4">
          <div className="h-6 bg-neutral-200 rounded w-20"></div>
          <div className="h-8 bg-neutral-200 rounded w-24"></div>
        </div>
        
        {/* Botón */}
        <div className="h-12 bg-neutral-200 rounded-full w-full mt-4"></div>
      </div>
    </div>
  );
};

export default PromoSkeleton;
