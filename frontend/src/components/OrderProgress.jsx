import React from 'react';

const OrderProgress = ({ estado }) => {
  const steps = [
    { key: 'PENDIENTE', label: 'Pendiente', icon: '⏱️' },
    { key: 'CONFIRMADO', label: 'Confirmado', icon: '✅' },
    { key: 'EN_PREPARACION', label: 'En Preparación', icon: '🍳' },
    { key: 'EN_CAMINO', label: 'En Camino', icon: '🚚' },
    { key: 'ENTREGADO', label: 'Entregado', icon: '🎉' }
  ];

  // Mapeo de estados del backend a los pasos del progreso
  const estadoMapping = {
    'PENDIENTE': 0,
    'PENDIENTE_PAGO': 0, // Se trata igual que PENDIENTE
    'CONFIRMADO': 1,
    'EN_PREPARACION': 2,
    'EN_CAMINO': 3,
    'ENTREGADO': 4
  };

  const estadoIndex = estadoMapping[estado] !== undefined ? estadoMapping[estado] : -1;
  const isCanceled = estado === 'CANCELADO';

  if (isCanceled) {
    return (
      <div className="w-full py-6">
        <div className="flex items-center justify-center gap-2 text-red-600">
          <span className="text-2xl">❌</span>
          <span className="font-bold font-title">Pedido Cancelado</span>
        </div>
      </div>
    );
  }

  // Si el estado no está mapeado, mostrar mensaje genérico
  if (estadoIndex === -1) {
    return (
      <div className="w-full py-6">
        <div className="flex items-center justify-center gap-2 text-neutral-600">
          <span className="text-2xl">📋</span>
          <span className="font-bold font-title">Estado: {estado}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index <= estadoIndex;
          const isActive = index === estadoIndex;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.key}>
              {/* Step Circle */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-lg md:text-2xl transition-all duration-500 ${
                    isCompleted
                      ? 'bg-primary shadow-lg'
                      : 'bg-neutral-200'
                  } ${isActive ? 'animate-pulse ring-4 ring-primary/30 scale-110' : ''}`}
                >
                  {step.icon}
                </div>
                <span
                  className={`mt-2 text-[10px] md:text-xs font-bold text-center font-body max-w-[60px] md:max-w-none ${
                    isCompleted ? 'text-primary' : 'text-neutral-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="flex-1 h-1 mx-1 md:mx-2 relative">
                  <div className="absolute inset-0 bg-neutral-200 rounded-full"></div>
                  <div
                    className={`absolute inset-0 bg-primary rounded-full transition-all duration-700 ${
                      index < estadoIndex ? 'w-full' : 'w-0'
                    }`}
                  ></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Estado actual - texto descriptivo */}
      <div className="mt-6 text-center">
        <p className="text-xs md:text-sm text-neutral-600 font-body">
          {(estado === 'PENDIENTE' || estado === 'PENDIENTE_PAGO') && 'Tu pedido ha sido recibido y está esperando confirmación'}
          {estado === 'CONFIRMADO' && 'Tu pedido ha sido confirmado y pronto comenzará su preparación'}
          {estado === 'EN_PREPARACION' && 'Tu pedido está siendo preparado con mucho cuidado'}
          {estado === 'EN_CAMINO' && 'Tu pedido está en camino, ¡llegará pronto!'}
          {estado === 'ENTREGADO' && '¡Tu pedido ha sido entregado! Disfrútalo 😊'}
        </p>
      </div>
    </div>
  );
};

export default OrderProgress;
