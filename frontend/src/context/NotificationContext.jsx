import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Polling para obtener notificaciones cada 30 segundos
  useEffect(() => {
    if (!user || !token) return;

    const fetchNotifications = async () => {
      try {
        const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        
        if (user.rol === 'ADMIN') {
          const res = await axios.get(`${api}/api/pedidos/pendientes`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const pendientes = res.data || [];
          const prevCount = unreadCount;
          
          if (pendientes.length > prevCount && prevCount > 0) {
            showNotification('📦 Nuevo pedido pendiente de validación');
          }
          
          setNotifications(pendientes);
          setUnreadCount(pendientes.length);
        } else {
          const res = await axios.get(`${api}/api/pedidos/usuario/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const pedidos = res.data || [];
          
          const pedidosValidados = pedidos.filter(p => 
            p.pagado && 
            p.fechaValidacionPago && 
            new Date(p.fechaValidacionPago) > new Date(Date.now() - 60000)
          );
          
          if (pedidosValidados.length > 0) {
            showNotification(`✅ Tu pago fue validado! Pedido #${pedidosValidados[0].id}`);
          }
          
          const pedidosEnCamino = pedidos.filter(p => 
            p.estado === 'EN_CAMINO' && 
            !localStorage.getItem(`notified_encamino_${p.id}`)
          );
          
          if (pedidosEnCamino.length > 0) {
            pedidosEnCamino.forEach(p => {
              showNotification(`🚚 Tu pedido #${p.id} está en camino!`);
              localStorage.setItem(`notified_encamino_${p.id}`, 'true');
            });
          }
          
          setNotifications(pedidos);
          setUnreadCount(pedidos.filter(p => p.estado === 'PENDIENTE_PAGO').length);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [user, token, unreadCount]);

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 5000);

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('ChoccoDelight', {
        body: message,
        icon: '/img/ice-cream.png',
        badge: '/img/ice-cream.png'
      });
    }
  };

  const requestPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const value = {
    notifications,
    unreadCount,
    showToast,
    toastMessage,
    showNotification,
    requestPermission,
    clearNotifications,
    hideToast: () => setShowToast(false)
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="bg-white shadow-2xl rounded-2xl p-4 border-l-4 border-primary max-w-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {toastMessage}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => setShowToast(false)}
                  className="inline-flex text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};
