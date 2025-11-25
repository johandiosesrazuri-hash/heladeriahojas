import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-pulse">
      {/* Imagen skeleton */}
      <div className="relative h-64 bg-neutral-200"></div>
      
      {/* Contenido skeleton */}
      <div className="p-6 space-y-3">
        {/* Título */}
        <div className="h-6 bg-neutral-200 rounded w-3/4"></div>
        
        {/* Descripción línea 1 */}
        <div className="h-4 bg-neutral-200 rounded w-full"></div>
        
        {/* Descripción línea 2 */}
        <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
        
        {/* Precio */}
        <div className="h-8 bg-neutral-200 rounded w-1/3 mt-4"></div>
        
        {/* Botón */}
        <div className="h-12 bg-neutral-200 rounded-full w-full mt-4"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
