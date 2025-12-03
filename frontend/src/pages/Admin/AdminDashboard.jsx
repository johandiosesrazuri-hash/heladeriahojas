import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pedidosRecientes, setPedidosRecientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    setTimeout(() => setAnimate(true), 10);
  }, []);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  useEffect(() => {

    // Verificar que sea admin
    if (!user || user.rol !== 'ADMIN') {
      console.warn('⚠️ Usuario no es admin, redirigiendo...');
      setNotification({
        show: true,
        message: "No tienes permisos de administrador",
        type: "error"
      });
      setTimeout(() => navigate('/'), 1500);
      return;
    }

    fetchStats();
    fetchPedidosRecientes();

    // Actualizar cada 30 segundos
    const interval = setInterval(() => {
      fetchStats();
      fetchPedidosRecientes();
    }, 30000);

    return () => clearInterval(interval);
  }, [user, token, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      
      console.log('🔐 Usuario actual:', user);
      console.log('🔑 Token:', token ? 'Presente' : 'Ausente');
      
      console.log('📡 Fetching stats desde:', `${api}/api/admin/dashboard/stats`);
      
      const response = await axios.get(`${api}/api/admin/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Stats obtenidas:', response.data);
      setStats(response.data);
    } catch (error) {
      console.error('❌ Error cargando estadísticas:', error);
      setError(error.message);
      setNotification({
        show: true,
        message: "Error al cargar las estadísticas. Inténtalo de nuevo.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPedidosRecientes = async () => {
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await axios.get(`${api}/api/admin/pedidos/recientes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPedidosRecientes(response.data);
    } catch (error) {
      console.error('❌ Error cargando pedidos recientes:', error);
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4 md:px-8 lg:px-16 min-h-screen relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full gradient-hero"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmNWYwZTAiIGZpbGwtb3BhY2l0eT0iMC4zIiBkPSJNMzYgMzRjMC0yLjIwOTEzOSAxLjc5MDg2MS00IDQtNCAyLjIwOTEzOSAwIDQgMS43OTA4NjEgNCA0IDAgMi4yMDkxMzktMS43OTA4NjEgNC00IDQtMi4yMDkxMzkgMC40LTEuNzkwODYxLTQtNHptMCAwYzAtMi4yMDkxMzkgMS43OTA4NjEtNCA0LTQgMi4yMDkxMzkgMCA0IDEuNzkwODYxIDQgNCAwIDIuMjA5MTM5LTEuNzkwODYxIDQtNCA0LTIuMjA5MTM5IDAtNC0xLjc5MDg2MS40LTR6Ii8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmOGU1ZDAiIGZpbGwtb3BhY2l0eT0iMC4yIiBkPSJNNDAgNDBjMC0yLjIwOTEzOSAxLjc5MDg2MS00IDQtNCAyLjIwOTEzOSAwIDQgMS43OTA4NjEgNCA0IDAgMi4yMDkxMzktMS43OTA4NjEgNC00IDQtMi4yMDkxMzkgMC40LTEuNzkwODYxLTQtNHptMCAwYzAtMi4yMDkxMzkgMS43OTA4NjEtNCA0LTQgMi4yMDkxMzkgMCA0IDEuNzkwODYxIDQgNCAwIDIuMjA5MTM5LTEuNzkwODYxIDQtNCA0LTIuMjA5MTM5IDAtNC0xLjc5MDg2MS40LTR6Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        </div>

        {/* Contenido principal */}
        <div className="relative z-10 container-custom flex flex-col items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-[#E19D7E] mb-6"></div>
            <p className="text-xl text-[#C1583B] font-quicksand">Cargando dashboard...</p>
          </div>
        </div>

        {/* Estilos de Animación y Fuentes */}
        <style jsx global>{`
          
          .gradient-hero {
            background: linear-gradient(135deg, #DDD4CE 0%, #E19D7E 100%);
          }
        `}</style>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 md:px-8 lg:px-16 min-h-screen relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full gradient-hero"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmNWYwZTAiIGZpbGwtb3BhY2l0eT0iMC4zIiBkPSJNMzYgMzRjMC0yLjIwOTEzOSAxLjc5MDg2MS00IDQtNCAyLjIwOTEzOSAwIDQgMS43OTA4NjEgNCA0IDAgMi4yMDkxMzktMS43OTA4NjEgNC00IDQtMi4yMDkxMzkgMC40LTEuNzkwODYxLTQtNHptMCAwYzAtMi4yMDkxMzkgMS43OTA4NjEtNCA0LTQgMi4yMDkxMzkgMCA0IDEuNzkwODYxIDQgNCAwIDIuMjA5MTM5LTEuNzkwODYxIDQtNCA0LTIuMjA5MTM5IDAtNC0xLjc5MDg2MS40LTR6Ii8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmOGU1ZDAiIGZpbGwtb3BhY2l0eT0iMC4yIiBkPSJNNDAgNDBjMC0yLjIwOTEzOSAxLjc5MDg2MS00IDQtNCAyLjIwOTEzOSAwIDQgMS43OTA4NjEgNCA0IDAgMi4yMDkxMzktMS43OTA4NjEgNC00IDQtMi4yMDkxMzkgMC40LTEuNzkwODYxLTQtNHptMCAwYzAtMi4yMDkxMzkgMS43OTA4NjEtNCA0LTQgMi4yMDkxMzkgMCA0IDEuNzkwODYxIDQgNCAwIDIuMjA5MTM5LTEuNzkwODYxIDQtNCA0LTIuMjA5MTM5IDAtNC0xLjc5MDg2MS40LTR6Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        </div>

        {/* Notificación temporal */}
        {notification.show && (
          <div className="fixed top-4 right-4 z-50 animate-fade-in">
            <div className={`px-6 py-4 rounded-lg shadow-lg flex items-center ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mr-3 ${notification.type === 'success' ? 'text-green-500' : 'text-red-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {notification.type === 'success' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
              <span className="font-medium">{notification.message}</span>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        <div className="relative z-10 container-custom flex flex-col items-center justify-center min-h-[70vh]">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-[#904939] mb-2 font-cinzel">Error al cargar datos</h2>
            <p className="text-[#C1583B] mb-6 font-quicksand">{error}</p>
            <button
              onClick={() => fetchStats()}
              className="px-6 py-3 bg-[#E19D7E] hover:bg-[#3aa38f] text-[#904939] rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 transform font-montserrat"
            >
              Reintentar
            </button>
          </div>
        </div>

        {/* Estilos de Animación y Fuentes */}
        <style jsx global>{`
          .gradient-hero {
            background: linear-gradient(135deg, #DDD4CE 0%, #E19D7E 100%);
          }
        `}</style>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 min-h-screen relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full gradient-hero"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmNWYwZTAiIGZpbGwtb3BhY2l0eT0iMC4zIiBkPSJNMzYgMzRjMC0yLjIwOTEzOSAxLjc5MDg2MS00IDQtNCAyLjIwOTEzOSAwIDQgMS43OTA4NjEgNCA0IDAgMi4yMDkxMzktMS43OTA4NjEgNC00IDQtMi4yMDkxMzkgMC40LTEuNzkwODYxLTQtNHptMCAwYzAtMi4yMDkxMzkgMS43OTA4NjEtNCA0LTQgMi4yMDkxMzkgMCA0IDEuNzkwODYxIDQgNCAwIDIuMjA5MTM5LTEuNzkwODYxIDQtNCA0LTIuMjA5MTM5IDAtNC0xLjc5MDg2MS40LTR6Ii8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmOGU1ZDAiIGZpbGwtb3BhY2l0eT0iMC4yIiBkPSJNNDAgNDBjMC0yLjIwOTEzOSAxLjc5MDg2MS00IDQtNCAyLjIwOTEzOSAwIDQgMS43OTA4NjEgNCA0IDAgMi4yMDkxMzktMS43OTA4NjEgNC00IDQtMi4yMDkxMzkgMC40LTEuNzkwODYxLTQtNHptMCAwYzAtMi4yMDkxMzkgMS43OTA4NjEtNCA0LTQgMi4yMDkxMzkgMCA0IDEuNzkwODYxIDQgNCAwIDIuMjA5MTM5LTEuNzkwODYxIDQtNCA0LTIuMjA5MTM5IDAtNC0xLjc5MDg2MS40LTR6Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      </div>

      {/* Notificación temporal */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className={`px-6 py-4 rounded-lg shadow-lg flex items-center ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mr-3 ${notification.type === 'success' ? 'text-green-500' : 'text-red-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {notification.type === 'success' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              )}
            </svg>
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="relative z-10 container-custom">
        {/* Encabezado */}
        <div className="mb-12 text-center">
          <h1 
            className="text-4xl md:text-5xl text-[#904939] font-bold mb-4 relative pb-4 font-cinzel"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.1s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            Dashboard Administrativo
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-[#E19D7E] to-[#904939] rounded-full"></span>
          </h1>
          <p 
            className="text-lg text-[#C1583B] font-quicksand"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.3s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            Bienvenido, {user?.nombre}
          </p>
        </div>

        {/* Tarjetas de Estadísticas */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          style={{ 
            animation: animate ? `fadeInUp 0.6s ease-out 0.5s both` : 'none',
            opacity: animate ? 1 : 0
          }}
        >
          <StatCard 
            title="Usuarios" 
            value={stats?.totalUsuarios || 0} 
            icon="👥" 
            color="from-pink-400 to-pink-500"
            delay={0.1}
          />
          <StatCard 
            title="Productos" 
            value={stats?.totalProductos || 0} 
            icon="🍦" 
            color="from-amber-600 to-amber-700"
            delay={0.2}
          />
          <StatCard 
            title="Pedidos" 
            value={stats?.totalPedidos || 0} 
            icon="🚚" 
            color="from-sky-400 to-sky-500"
            delay={0.3}
          />
          <StatCard 
            title="Ingresos" 
            value={`S/ ${(stats?.ingresosTotales || 0).toFixed(2)}`} 
            icon="💰" 
            color="from-emerald-400 to-emerald-500"
            delay={0.4}
          />
          <StatCard
            title="Promociones Activas"
            value={stats?.totalPromociones || 0}
            icon="🎁"
            color="from-purple-400 to-purple-500"
            delay={0.5}
            />
        </div>

        {/* Navegación Rápida */}
        <div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8"
          style={{ 
            animation: animate ? `fadeInUp 0.6s ease-out 0.7s both` : 'none',
            opacity: animate ? 1 : 0
          }}
        >
          <h2 className="text-2xl font-bold text-[#904939] mb-6 font-cinzel">Gestión</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <NavButton to="/admin/usuarios" label="Usuarios" icon="👥" delay={0.1} />
            <NavButton to="/admin/productos" label="Productos" icon="🍨" delay={0.2} />
            <NavButton to="/admin/pedidos" label="Pedidos" icon="🚚" delay={0.3} />
            <NavButton to="/admin/contactos" label="Contactos" icon="✉️" delay={0.4} />
            <NavButton to="/admin/promociones" label="Promociones" icon="🎁" delay={0.5} />
            <NavButton to="/admin/sobre-nosotros" label="Sobre Nosotros" icon="📖" delay={0.6} />
            <NavButton to="/admin/pagos" label="Validar Pagos" icon="💳" delay={0.7} />
          </div>
        </div>
      </div>

      {/* Estilos de Animación y Fuentes */}
      <style jsx global>{`

        .gradient-hero {
          background: linear-gradient(135deg, #DDD4CE 0%, #E19D7E 100%);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

const StatCard = ({ title, value, icon, color, delay }) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`bg-gradient-to-r ${color} text-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden`}
      style={{ 
        animation: animate ? `fadeInUp 0.6s ease-out ${delay}s both` : 'none',
        opacity: animate ? 1 : 0
      }}
    >
      {/* Decoración de helado */}
      <div className="absolute -right-4 -bottom-4 opacity-10">
        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
      </div>
      
      <div className="text-4xl mb-3 relative z-10">{icon}</div>
      <p className="text-sm font-bold text-black px-2 py-1 rounded-md inline-block mb-2 font-quicksand relative z-10">{title}</p>
      <p className="text-3xl font-bold text-black font-montserrat relative z-10">{value}</p>
    </div>
  );
};

const NavButton = ({ to, label, icon, delay }) => {
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <button 
      onClick={() => navigate(to)}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group relative overflow-hidden"
      style={{ 
        animation: animate ? `fadeInUp 0.6s ease-out ${delay}s both` : 'none',
        opacity: animate ? 1 : 0
      }}
    >
      {/* Decoración de helado */}
      <div className="absolute -right-2 -bottom-2 opacity-5">
        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
      </div>
      
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10">{icon}</div>
      <p className="font-semibold text-[#904939] font-montserrat relative z-10">{label}</p>
    </button>
  );
};

export default AdminDashboard;




