import { createContext, useContext, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';

const ToastContext = createContext();

// Iconos para cada tipo de toast
const icons = {
  success: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  cart: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
};

const typeStyles = {
  success: 'bg-gradient-to-r from-secondary to-secondary-dark text-white',
  error: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
  warning: 'bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-900',
  info: 'bg-gradient-to-r from-blue-400 to-blue-500 text-white',
  cart: 'bg-gradient-to-r from-primary to-primary-dark text-white',
};

const Toast = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleRemove = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  }, [toast.id, onRemove]);

  return (
    <div
      className={`
        relative flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg min-w-[320px] max-w-[400px]
        transform transition-all duration-300 ease-out cursor-pointer overflow-hidden
        hover:scale-[1.02] hover:shadow-xl
        ${typeStyles[toast.type] || typeStyles.info}
        ${isExiting 
          ? 'opacity-0 translate-x-full scale-95' 
          : 'opacity-100 translate-x-0 scale-100'
        }
      `}
      onClick={handleRemove}
      style={{
        animation: isExiting ? '' : 'slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }}
    >
      <div className="flex-shrink-0 p-2 bg-white/20 rounded-xl">
        {icons[toast.type] || icons.info}
      </div>

      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-bold font-title text-sm">{toast.title}</p>
        )}
        <p className="font-medium font-body text-sm truncate">{toast.message}</p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleRemove();
        }}
        className="flex-shrink-0 p-1.5 hover:bg-white/20 rounded-full transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
        <div 
          className="h-full bg-white/40"
          style={{
            animation: 'progressBar 4s linear forwards'
          }}
        />
      </div>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', title = null) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, title }]);
    
    setTimeout(() => {
      removeToast(id);
    }, 4000);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Helpers para tipos específicos
  const success = (message, title) => addToast(message, 'success', title);
  const error = (message, title) => addToast(message, 'error', title);
  const warning = (message, title) => addToast(message, 'warning', title);
  const info = (message, title) => addToast(message, 'info', title);
  const cart = (message, title) => addToast(message, 'cart', title);

  // Renderizar toasts en un portal
  const ToastContainer = () => {
    if (toasts.length === 0) return null;

    return ReactDOM.createPortal(
      <div 
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-3"
        style={{ zIndex: 9999 }}
      >
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
        
        {/* Estilos de animación */}
        <style>{`
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(100%) scale(0.8);
            }
            to {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }
          
          @keyframes progressBar {
            from {
              width: 100%;
            }
            to {
              width: 0%;
            }
          }
        `}</style>
      </div>,
      document.body
    );
  };

  return (
    <ToastContext.Provider value={{ success, error, warning, info, cart, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Retornar funciones vacías en lugar de lanzar error
    return {
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {},
      cart: () => {},
      addToast: () => {},
      removeToast: () => {}
    };
  }
  return context;
};

