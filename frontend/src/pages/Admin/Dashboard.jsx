import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar que sea admin
    if (user?.rol !== 'ROLE_ADMIN') {
      navigate('/');
      return;
    }
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await axios.get(`${api}/api/admin/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600 mt-2">Bienvenido, {user?.nombre}</p>
        </div>

        {/* Tarjetas de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Usuarios" 
            value={stats?.totalUsuarios} 
            icon="👥" 
            color="bg-blue-500"
          />
          <StatCard 
            title="Productos" 
            value={stats?.totalProductos} 
            icon="🍦" 
            color="bg-green-500"
          />
          <StatCard 
            title="Pedidos" 
            value={stats?.totalPedidos} 
            icon="📦" 
            color="bg-purple-500"
          />
          <StatCard 
            title="Ingresos" 
            value={`S/ ${stats?.ingresosTotales?.toFixed(2) || '0.00'}`} 
            icon="💰" 
            color="bg-yellow-500"
          />
        </div>

        {/* Navegación Rápida */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Gestión</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <NavButton to="/admin/usuarios" label="Usuarios" icon="👥" />
            <NavButton to="/admin/productos" label="Productos" icon="🍦" />
            <NavButton to="/admin/pedidos" label="Pedidos" icon="📦" />
            <NavButton to="/admin/contactos" label="Contactos" icon="✉️" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className={`${color} text-white rounded-lg shadow-md p-6`}>
    <div className="text-4xl mb-2">{icon}</div>
    <p className="text-sm opacity-90">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

const NavButton = ({ to, label, icon }) => (
  <button 
    onClick={() => window.location.href = to}
    className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition"
  >
    <div className="text-3xl mb-2">{icon}</div>
    <p className="font-semibold text-gray-800">{label}</p>
  </button>
);

export default AdminDashboard;