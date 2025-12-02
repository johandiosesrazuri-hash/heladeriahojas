import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const Navbar = () => {
  const { user, logout, token } = useAuth();
  const { items, toggleCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [readNotifications, setReadNotifications] = useState(() => {
    // Cargar notificaciones leídas desde localStorage
    const saved = localStorage.getItem('readNotifications');
    return saved ? JSON.parse(saved) : [];
  });
  const location = useLocation();
  const navigate = useNavigate();

  // Calcular total de items en el carrito
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // Actualizar el contador del carrito con animación
  useEffect(() => {
    if (totalItems !== cartCount) {
      setCartCount(totalItems);
    }
  }, [totalItems, cartCount]);

  // Cargar notificaciones solo si hay usuario
  useEffect(() => {
    if (!user || !token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const isAdmin = user.roles?.includes('ADMIN');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        
        console.log('Cargando notificaciones para:', isAdmin ? 'ADMIN' : 'CLIENTE');
        
        let response;
        if (isAdmin) {
          response = await axios.get(`${apiUrl}/api/pedidos/pendientes`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          response = await axios.get(`${apiUrl}/api/pedidos/usuario/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }

        const pedidos = response.data || [];
        console.log('Pedidos recibidos:', pedidos.length, pedidos);
        const notifs = [];

        if (isAdmin) {
          // Notificaciones para admin: SOLO pedidos con comprobante subido pendiente de validación
          const pendientes = pedidos.filter(p => 
            p.comprobantePago && !p.pagado && p.estado === 'PENDIENTE_PAGO'
          );
          console.log('Pagos pendientes encontrados:', pendientes.length, pendientes);
          
          pendientes.forEach(p => {
            const numPedido = p.numeroPedido || p.id;
            notifs.push({
              id: `pago-${p.id}`,
              pedidoId: p.id,
              mensaje: `Nuevo pago por validar`,
              detalle: `Pedido #${numPedido} · ${p.metodoPago.toUpperCase()}`,
              tipo: 'pago_pendiente',
              fecha: new Date(),
              leido: false
            });
          });
        } else {
          // Notificaciones para cliente
          pedidos.forEach(p => {
            const numPedido = p.numeroPedido || p.id;
            console.log(`Pedido #${numPedido} - Estado: ${p.estado}, Pagado: ${p.pagado}, Comprobante: ${p.comprobantePago ? 'Sí' : 'No'}, MetodoPago: ${p.metodoPago}`);
            
            // 1. Pedido en camino
            if (p.estado === 'EN_CAMINO') {
              notifs.push({
                id: `pedido-${p.id}`,
                pedidoId: p.id,
                mensaje: `Tu pedido va en camino`,
                detalle: `Pedido #${numPedido}`,
                tipo: 'en_camino',
                fecha: new Date(),
                leido: false
              });
            }
            // 2. Pago validado
            else if (p.pagado && (p.estado === 'EN_PREPARACION' || p.estado === 'LISTO_PARA_ENTREGA')) {
              notifs.push({
                id: `pedido-${p.id}`,
                pedidoId: p.id,
                mensaje: `Pago aprobado`,
                detalle: `Pedido #${numPedido}`,
                tipo: 'pago_validado',
                fecha: new Date(),
                leido: false
              });
            }
            // 3. Comprobante subido, esperando validación
            else if (p.estado === 'PENDIENTE_PAGO' && p.comprobantePago && !p.pagado) {
              notifs.push({
                id: `pedido-${p.id}`,
                pedidoId: p.id,
                mensaje: `Validando tu pago`,
                detalle: `Pedido #${numPedido}`,
                tipo: 'esperando_validacion',
                fecha: new Date(),
                leido: false
              });
            }
            // 4. Pago rechazado - Pedido cancelado - PRIORIDAD ALTA
            else if (p.pagoRechazado && p.estado === 'CANCELADO' && (p.metodoPago === 'yape' || p.metodoPago === 'transferencia')) {
              notifs.push({
                id: `pedido-rechazado-${p.id}`,
                pedidoId: p.id,
                mensaje: `❌ Pedido cancelado`,
                detalle: `Pedido #${numPedido} · ${p.motivoRechazo || 'Pago no válido'}`,
                tipo: 'pago_rechazado',
                fecha: new Date(),
                leido: false
              });
            }
            // 5. Pedido pendiente (sin comprobante) - solo para yape/transferencia
            else if (p.estado === 'PENDIENTE_PAGO' && !p.comprobantePago && (p.metodoPago === 'yape' || p.metodoPago === 'transferencia')) {
              notifs.push({
                id: `pedido-${p.id}`,
                pedidoId: p.id,
                mensaje: `Pendiente de pago`,
                detalle: `Pedido #${numPedido}`,
                tipo: 'pendiente_pago',
                fecha: new Date(),
                leido: false
              });
            }
          });
        }

        // Marcar notificaciones como leídas o no leídas según localStorage
        const notifsConEstado = notifs.map(n => ({
          ...n,
          leido: readNotifications.includes(n.id)
        }));
        
        // Limpiar notificaciones leídas que ya no existen
        const currentIds = notifs.map(n => n.id);
        const validReadNotifications = readNotifications.filter(id => currentIds.includes(id));
        if (validReadNotifications.length !== readNotifications.length) {
          setReadNotifications(validReadNotifications);
          localStorage.setItem('readNotifications', JSON.stringify(validReadNotifications));
        }
        
        console.log('Notificaciones generadas:', notifsConEstado.length, notifsConEstado);
        setNotifications(notifsConEstado);
        
        // Contar solo las no leídas
        const noLeidas = notifsConEstado.filter(n => !n.leido).length;
        setUnreadCount(noLeidas);
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [user, token, readNotifications]);

  // Efecto para cambiar el estilo del navbar al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efecto para cerrar notificaciones con Escape y clicks fuera
  useEffect(() => {
    if (!showNotifications) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowNotifications(false);
      }
    };

    const handleClickOutside = (e) => {
      // Verificar si el clic fue fuera del dropdown de notificaciones
      const notificationDropdown = document.getElementById('notification-dropdown');
      const notificationButton = document.getElementById('notification-button');
      
      if (notificationDropdown && notificationButton) {
        if (!notificationDropdown.contains(e.target) && !notificationButton.contains(e.target)) {
          setShowNotifications(false);
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);


  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavClick = (sectionId) => {
    if (location.pathname === '/') {
      scrollToSection(sectionId);
    } else {
      navigate(`/#${sectionId}`);
    }
    setIsMenuOpen(false);
  };

  // Función para marcar una notificación como leída
  const markAsRead = (notificationId) => {
    if (!readNotifications.includes(notificationId)) {
      const updated = [...readNotifications, notificationId];
      setReadNotifications(updated);
      localStorage.setItem('readNotifications', JSON.stringify(updated));
      
      // Actualizar el estado de la notificación
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, leido: true } : n)
      );
      
      // Actualizar contador
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  // Función para marcar todas como leídas
  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadNotifications(allIds);
    localStorage.setItem('readNotifications', JSON.stringify(allIds));
    setNotifications(prev => prev.map(n => ({ ...n, leido: true })));
    setUnreadCount(0);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled
        ? 'bg-white/70 backdrop-blur-xl shadow-2xl py-2 border-b border-white/30 supports-[backdrop-filter]:bg-white/60'
        : 'bg-white/90 backdrop-blur-sm py-5 h-20 border-b border-white/20'
        }`}>
        <div className="container-custom px-4 md:px-8 lg:px-16">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center group">
                <div className="w-10 h-10 bg-primary-light/20 rounded-full flex items-center justify-center mr-3 transition-transform group-hover:scale-110">
                  <img alt="LOGO" className="h-6 w-6" src="/img/ice-cream.png" />
                </div>
                <span className="text-2xl font-bold text-primary font-title tracking-tight">ChoccoDelight</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <ul className="flex space-x-6">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      if (location.pathname === '/') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        navigate('/');
                      }
                      setIsMenuOpen(false);
                    }}
                    className="text-neutral-800 hover:text-primary font-medium font-body transition-colors duration-200 relative group"
                  >
                    Inicio
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </button>
                </li>
                {[
                  { name: 'Menú', section: 'menu' },
                  { name: 'Promociones', section: 'promociones' },
                  { name: 'Contacto', section: 'contacto' },
                  { name: 'Testimonios', section: 'testimonios' },
                ].map((item) => (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.section)}
                      className="text-neutral-800 hover:text-primary font-medium font-body transition-colors duration-200 relative group"
                    >
                      {item.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Notifications */}
              {user && (
                <div className="relative">
                  <button
                    id="notification-button"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-neutral-800 hover:text-primary transition-all duration-300 group hover:bg-primary/5 rounded-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-br from-primary to-primary-dark text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce shadow-lg">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown de notificaciones */}
                  {showNotifications && (
                    <div 
                      id="notification-dropdown"
                      className="absolute right-0 mt-2 w-[380px] bg-white rounded-3xl shadow-2xl border-2 border-primary/20 z-[9999] overflow-hidden backdrop-blur-sm"
                    >
                        <div className="bg-gradient-to-br from-primary via-primary to-secondary px-5 py-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                              </div>
                              <h3 className="font-bold text-white text-lg tracking-tight">Notificaciones</h3>
                            </div>
                            {unreadCount > 0 && (
                              <span className="bg-white/90 text-primary text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                {unreadCount} nueva{unreadCount !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                          {unreadCount > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAllAsRead();
                              }}
                              className="w-full py-2 px-3 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              Marcar todas como leídas
                            </button>
                          )}
                        </div>                        <div className="max-h-[32rem] overflow-y-auto custom-scrollbar">
                          {notifications.filter(n => !n.leido).length === 0 ? (
                            <div className="p-10 text-center">
                              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                              </div>
                              <p className="text-neutral-700 font-semibold text-base">No tienes notificaciones nuevas</p>
                              <p className="text-neutral-500 text-sm mt-2">Te avisaremos cuando haya novedades 🍨</p>
                            </div>
                          ) : (
                            notifications.filter(n => !n.leido).map((notif) => (
                              <div
                                key={notif.id}
                                className={`px-5 py-4 border-b border-neutral-100/60 ${
                                  notif.tipo === 'pago_rechazado' ? '' : 'hover:bg-gradient-to-r hover:from-primary/8 hover:via-secondary/5 hover:to-transparent cursor-pointer'
                                } transition-all duration-300 group relative overflow-hidden`}
                                onClick={() => {
                                  if (notif.tipo !== 'pago_rechazado') {
                                    markAsRead(notif.id);
                                    navigate(user.roles?.includes('ADMIN') ? '/admin/pagos' : '/mis-pedidos');
                                    setShowNotifications(false);
                                  }
                                }}
                              >
                                {/* Línea decorativa al hacer hover */}
                                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                <div className="flex items-start gap-3.5">
                                  {/* Icono según tipo */}
                                  <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 ${
                                    notif.tipo === 'pago_pendiente' || notif.tipo === 'esperando_validacion' ? 'bg-gradient-to-br from-amber-100 to-amber-200' :
                                    notif.tipo === 'pago_validado' ? 'bg-gradient-to-br from-emerald-100 to-emerald-200' :
                                    notif.tipo === 'pago_rechazado' ? 'bg-gradient-to-br from-red-100 to-red-200' :
                                    notif.tipo === 'pendiente_pago' ? 'bg-gradient-to-br from-rose-100 to-rose-200' :
                                    'bg-gradient-to-br from-blue-100 to-blue-200'
                                  }`}>
                                    {notif.tipo === 'pago_rechazado' && (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                      </svg>
                                    )}
                                    {(notif.tipo === 'pago_pendiente' || notif.tipo === 'esperando_validacion') && (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    )}
                                    {notif.tipo === 'pendiente_pago' && (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    )}
                                    {notif.tipo === 'pago_validado' && (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    )}
                                    {notif.tipo === 'en_camino' && (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                      </svg>
                                    )}
                                  </div>
                                  
                                  {/* Contenido */}
                                  <div className="flex-1 min-w-0">
                                    <p className={`font-bold text-sm leading-tight mb-1 ${notif.leido ? 'text-neutral-500' : 'text-neutral-900'}`}>
                                      {notif.mensaje}
                                    </p>
                                    <p className={`text-xs leading-relaxed font-medium ${notif.leido ? 'text-neutral-400' : 'text-neutral-600'}`}>
                                      {notif.detalle}
                                    </p>
                                    
                                    {/* Botón especial para pedidos cancelados */}
                                    {notif.tipo === 'pago_rechazado' && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          markAsRead(notif.id);
                                          navigate('/menu');
                                          setShowNotifications(false);
                                        }}
                                        className="mt-3 w-full bg-gradient-to-r from-primary via-primary to-secondary hover:from-primary-dark hover:via-primary hover:to-primary text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group/btn"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover/btn:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span>Hacer un nuevo pedido</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                      </button>
                                    )}
                                  </div>
                                  
                                  {/* Botón X para descartar */}
                                  <div className="flex-shrink-0 flex items-center">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        markAsRead(notif.id);
                                      }}
                                      className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-red-100 text-neutral-400 hover:text-red-600 flex items-center justify-center transition-all duration-200 group/close opacity-0 group-hover:opacity-100"
                                      title="Descartar notificación"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover/close:rotate-90 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                    {!notif.leido && (
                                      <div className="w-2.5 h-2.5 bg-gradient-to-br from-primary to-secondary rounded-full shadow-sm animate-pulse ml-2"></div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        
                        {notifications.length > 0 && (
                          <div className="p-4 bg-gradient-to-br from-neutral-50 to-primary/5 border-t border-neutral-200/60 space-y-2">
                            {unreadCount > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAllAsRead();
                                }}
                                className="w-full text-center text-xs font-semibold text-neutral-600 hover:text-primary py-2 px-3 rounded-lg transition-all duration-300 hover:bg-primary/5"
                              >
                                ✓ Marcar todas como leídas
                              </button>
                            )}
                            <button
                              onClick={() => {
                                navigate(user.roles?.includes('ADMIN') ? '/admin/pagos' : '/mis-pedidos');
                                setShowNotifications(false);
                              }}
                              className="w-full text-center text-sm font-bold text-primary hover:text-white bg-white hover:bg-gradient-to-r hover:from-primary hover:to-secondary py-2.5 px-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                              Ver todas las notificaciones
                            </button>
                          </div>
                        )}
                      </div>
                  )}
                </div>
              )}

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-neutral-800 hover:text-primary transition-colors duration-200 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-fade-in shadow-sm">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User Actions */}
              {user ? (
                <Link
                  to="/perfil"
                  className="flex items-center space-x-2 text-neutral-800 hover:text-primary font-medium font-body transition-colors duration-200 px-3 py-1.5 rounded-full hover:bg-primary/5"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden lg:inline">{user.nombre}</span>
                </Link>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-neutral-800 hover:text-primary font-medium font-body transition-colors duration-200"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 font-title text-sm"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-neutral-800 hover:text-primary focus:outline-none"
              >
                {isMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-100">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <button
                type="button"
                onClick={() => {
                  if (location.pathname === '/') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    navigate('/');
                  }
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-3 rounded-xl text-base font-medium text-neutral-800 hover:text-primary hover:bg-primary/5 font-body transition-colors"
              >
                Inicio
              </button>
              {[
                { name: 'Menú', section: 'menu' },
                { name: 'Promociones', section: 'promociones' },
                { name: 'Contacto', section: 'contacto' },
                { name: 'Testimonios', section: 'testimonios' }
              ].map((item) => (
                <button
                  type="button"
                  key={item.name}
                  onClick={() => handleNavClick(item.section)}
                  className="block w-full text-left px-3 py-3 rounded-xl text-base font-medium text-neutral-800 hover:text-primary hover:bg-primary/5 font-body transition-colors"
                >
                  {item.name}
                </button>
              ))}

              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex items-center justify-between px-3 py-2">
                  <button
                    onClick={() => {
                      toggleCart();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center text-neutral-800 hover:text-primary font-medium font-body w-full text-left"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Carrito
                    {totalItems > 0 && (
                      <span className="ml-auto bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </button>
                </div>

                {user ? (
                  <Link
                    to="/perfil"
                    className="block px-3 py-3 rounded-xl text-base font-medium text-neutral-800 hover:text-primary hover:bg-primary/5 font-body transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                ) : (
                  <div className="px-3 pt-2 space-y-2">
                    <Link
                      to="/login"
                      className="block w-full text-center px-3 py-2 rounded-xl text-base font-medium text-neutral-800 hover:bg-gray-50 font-body border border-gray-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full text-center px-3 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-base font-semibold font-title shadow-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Espacio para el navbar fijo */}
      <div className="h-16 md:h-20"></div>
    </>
  );
};

export default Navbar;
