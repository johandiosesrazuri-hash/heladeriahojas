import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const GestionProductos = () => {
  const { token } = useAuth();
  const [productos, setProductos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: '',
    categoria: '',
    stockDisponible: ''
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await axios.get(`${api}/api/admin/dashboard/productos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Productos cargados:', response.data);
      setProductos(response.data);
    } catch (error) {
      console.error('❌ Error cargando productos:', error);
      setNotification({
        show: true,
        message: 'Error al cargar productos',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      await axios.post(`${api}/api/admin/dashboard/productos`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotification({
        show: true,
        message: '✅ Producto creado exitosamente',
        type: 'success'
      });
      setFormData({ 
        nombre: '', 
        descripcion: '', 
        precio: '', 
        imagen: '', 
        categoria: '',
        stockDisponible: ''
      });
      setShowForm(false);
      fetchProductos();
    } catch (error) {
      console.error('❌ Error creando producto:', error);
      setNotification({
        show: true,
        message: '❌ Error: ' + (error.response?.data?.message || error.message),
        type: 'error'
      });
    }
  };

  const handleDelete = async (id, producto) => {
    if (confirm(`¿Eliminar "${producto.nombre}"? Tiene ${producto.stockDisponible} unidades en stock.`)) {
      try {
        const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        await axios.delete(`${api}/api/admin/dashboard/productos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotification({
          show: true,
          message: '✅ Producto eliminado correctamente',
          type: 'success'
        });
        fetchProductos();
      } catch (error) {
        console.error('❌ Error eliminando producto:', error);
        setNotification({
          show: true,
          message: '❌ Error: ' + (error.response?.data?.message || error.message),
          type: 'error'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Notificación */}
        {notification.show && (
          <div className={`fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg text-white mb-6 z-50 ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {notification.message}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Productos</h1>
            <p className="text-gray-600 mt-1">Total: {productos.length} productos</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition transform hover:scale-105"
          >
            + Nuevo Producto
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4 border-green-500">
            <h2 className="text-xl font-bold mb-4">Crear Nuevo Producto</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="number"
                placeholder="Precio"
                step="0.01"
                value={formData.precio}
                onChange={(e) => setFormData({...formData, precio: e.target.value})}
                className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <textarea
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                className="border px-4 py-2 rounded col-span-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="URL Imagen"
                value={formData.imagen}
                onChange={(e) => setFormData({...formData, imagen: e.target.value})}
                className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Categoría"
                value={formData.categoria}
                onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                placeholder="Stock Disponible"
                value={formData.stockDisponible}
                onChange={(e) => setFormData({...formData, stockDisponible: e.target.value})}
                className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition font-semibold">
                Guardar Producto
              </button>
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {productos.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600 text-lg">📦 No hay productos registrados</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map(producto => {
              const tieneStock = producto.stockDisponible && producto.stockDisponible > 0;
              
              return (
                <div 
                  key={producto.id} 
                  className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1 ${
                    !tieneStock ? 'opacity-60' : ''
                  }`}
                >
                  {/* Imagen */}
                  <div className="relative">
                    <img 
                      src={`http://localhost:8080${producto.imagen}`}
                      alt={producto.nombre}
                      className="w-full h-48 object-cover bg-gray-200"
                      onError={(e) => e.target.src = '/img/default.png'}
                    />
                    {/* Badge Stock */}
                    <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold text-white ${
                      tieneStock ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      Stock: {producto.stockDisponible || 0}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 text-gray-900">{producto.nombre}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{producto.descripcion}</p>
                    
                    {/* Categoría */}
                    {producto.categoria && (
                      <p className="text-xs text-gray-500 mb-3">Categoría: {producto.categoria}</p>
                    )}
                    
                    {/* Precio */}
                    <p className="text-green-600 font-bold text-xl mb-4">S/ {Number(producto.precio).toFixed(2)}</p>

                    {/* Botón Eliminar */}
                    <button
                      onClick={() => handleDelete(producto.id, producto)}
                      className="w-full py-2 rounded font-semibold transition bg-red-500 text-white hover:bg-red-600"
                      title="Eliminar este producto"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionProductos;
