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
  const [animate, setAnimate] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Estados para el modal de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cantidadEliminar, setCantidadEliminar] = useState('');
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  // Activar animación después de que el componente se monte
  useEffect(() => {
    setTimeout(() => setAnimate(true), 10);
  }, []);

  // Ocultar notificación después de 3 segundos
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await axios.get(`${api}/api/admin/dashboard/productos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductos(response.data);
    } catch (error) {
      console.error('Error cargando productos:', error);
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
        message: 'Producto creado exitosamente',
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
      console.error('Error creando producto:', error);
      setNotification({
        show: true,
        message: 'Error: ' + (error.response?.data?.message || error.message),
        type: 'error'
      });
    }
  };

  const handleDelete = async () => {
    if (!cantidadEliminar || isNaN(cantidadEliminar) || cantidadEliminar <= 0 || cantidadEliminar > productoAEliminar.stockDisponible) {
      setNotification({
        show: true,
        message: 'La cantidad ingresada no es válida o excede el stock disponible.',
        type: 'error'
      });
      return;
    }

    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      await axios.delete(`${api}/api/admin/dashboard/productos/${productoAEliminar.id}?cantidad=${cantidadEliminar}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotification({
        show: true,
        message: `${cantidadEliminar} unidades de "${productoAEliminar.nombre}" eliminadas correctamente.`,
        type: 'success'
      });
      setShowDeleteModal(false);
      fetchProductos();
    } catch (error) {
      console.error('Error eliminando producto:', error);
      setNotification({
        show: true,
        message: 'Error: ' + (error.response?.data?.message || error.message),
        type: 'error'
      });
    }
  };

  const abrirModalEliminar = (producto) => {
    setProductoAEliminar(producto);
    setCantidadEliminar('');
    setShowDeleteModal(true);
  };

  const cerrarModalEliminar = () => {
    setShowDeleteModal(false);
    setProductoAEliminar(null);
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
            <p className="text-xl text-[#C1583B] font-quicksand">Cargando productos...</p>
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
            Gestión de Productos
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-[#E19D7E] to-[#904939] rounded-full"></span>
          </h1>
          <p 
            className="text-lg text-[#C1583B] font-quicksand"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.3s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            Total: {productos.length} productos
          </p>
        </div>

        {/* Botón para agregar producto */}
        <div 
          className="mb-8 text-center"
          style={{ 
            animation: animate ? `fadeInUp 0.6s ease-out 0.5s both` : 'none',
            opacity: animate ? 1 : 0
          }}
        >
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-[#904939] to-[#E19D7E] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nuevo Producto
          </button>
        </div>

        {/* Formulario de creación de producto */}
        {showForm && (
          <div 
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border-l-4 border-[#904939] animate-scale-in"
            style={{ 
              animation: animate ? `scaleIn 0.4s ease-out 0.7s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            <h2 className="text-2xl font-bold text-[#904939] mb-6 font-cinzel">Crear Nuevo Producto</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#C1583B] font-medium mb-2 font-montserrat">Nombre</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-[#E19D7E] focus:outline-none focus:ring-2 focus:ring-[#904939] focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#C1583B] font-medium mb-2 font-montserrat">Precio</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => setFormData({...formData, precio: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-[#E19D7E] focus:outline-none focus:ring-2 focus:ring-[#904939] focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[#C1583B] font-medium mb-2 font-montserrat">Descripción</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-[#E19D7E] focus:outline-none focus:ring-2 focus:ring-[#904939] focus:border-transparent transition-all"
                    rows="3"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-[#C1583B] font-medium mb-2 font-montserrat">URL Imagen</label>
                  <input
                    type="text"
                    value={formData.imagen}
                    onChange={(e) => setFormData({...formData, imagen: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-[#E19D7E] focus:outline-none focus:ring-2 focus:ring-[#904939] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[#C1583B] font-medium mb-2 font-montserrat">Categoría</label>
                  <input
                    type="text"
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-[#E19D7E] focus:outline-none focus:ring-2 focus:ring-[#904939] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[#C1583B] font-medium mb-2 font-montserrat">Stock Disponible</label>
                  <input
                    type="number"
                    value={formData.stockDisponible}
                    onChange={(e) => setFormData({...formData, stockDisponible: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-[#E19D7E] focus:outline-none focus:ring-2 focus:ring-[#904939] focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 rounded-lg font-medium text-[#C1583B] bg-[#DDD4CE] hover:bg-[#E19D7E] transition-colors duration-300"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-[#904939] to-[#E19D7E] hover:shadow-lg transition-all duration-300"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de productos */}
        {productos.length === 0 ? (
          <div 
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.9s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            <div className="text-6xl mb-4">🍦</div>
            <h3 className="text-2xl font-bold text-[#904939] mb-2 font-cinzel">No hay productos registrados</h3>
            <p className="text-[#C1583B] font-quicksand">Agrega nuevos productos para comenzar</p>
          </div>
        ) : (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.9s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            {productos.map((producto, index) => {
              const tieneStock = producto.stockDisponible && producto.stockDisponible > 0;
              
              return (
                <div 
                  key={producto.id} 
                  className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${!tieneStock ? 'opacity-70' : ''}`}
                  style={{ 
                    animation: animate ? `fadeInUp 0.6s ease-out ${1.1 + index * 0.1}s both` : 'none',
                    opacity: animate ? 1 : 0
                  }}
                >
                  <div className="relative">
                    <img 
                      src={`http://localhost:8080${producto.imagen}`}
                      alt={producto.nombre}
                      className="w-full h-56 object-cover"
                      onError={(e) => e.target.src = '/img/default.png'}
                    />
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white ${tieneStock ? 'bg-gradient-to-r from-[#64b5f6] to-[#42a5f5]' : 'bg-gradient-to-r from-[#e57373] to-[#ef5350]'}`}>
                      Stock: {producto.stockDisponible || 0}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-[#904939] font-montserrat">{producto.nombre}</h3>
                      <span className="text-lg font-bold text-[#E19D7E]">S/ {Number(producto.precio).toFixed(2)}</span>
                    </div>
                    
                    <p className="text-[#C1583B] mb-4 font-quicksand line-clamp-2">{producto.descripcion}</p>
                    
                    {producto.categoria && (
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-[#DDD4CE] text-[#C1583B] rounded-full text-sm font-medium">
                          {producto.categoria}
                        </span>
                      </div>
                    )}
                    
                    <button
                      onClick={() => abrirModalEliminar(producto)}
                      className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-[#e57373] to-[#ef5350] hover:from-[#ef5350] hover:to-[#e53935] transition-all duration-300 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m0 0v-2m0 0h3m-3 0h3" />
                      </svg>
                      Eliminar Stock
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal para confirmar la eliminación del stock */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
              <h3 className="text-2xl font-bold text-[#904939] mb-4 font-cinzel">Eliminar Stock</h3>
              <p className="text-[#C1583B] mb-2 font-quicksand">
                Estás eliminando stock de: <span className="font-semibold">{productoAEliminar?.nombre}</span>
              </p>
              <p className="text-[#C1583B] mb-6 font-quicksand">
                Stock disponible: <span className="font-semibold">{productoAEliminar?.stockDisponible}</span>
              </p>
              
              <div className="mb-6">
                <label className="block text-[#C1583B] font-medium mb-2 font-montserrat">Cantidad a eliminar</label>
                <input
                  type="number"
                  value={cantidadEliminar}
                  onChange={(e) => setCantidadEliminar(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#E19D7E] focus:outline-none focus:ring-2 focus:ring-[#904939] focus:border-transparent transition-all"
                  placeholder="Ingresa la cantidad"
                  min="1"
                  max={productoAEliminar?.stockDisponible}
                />
              </div>
              
              <div className="flex justify-end gap-4">
                <button 
                  onClick={cerrarModalEliminar}
                  className="px-6 py-3 rounded-lg font-medium text-[#C1583B] bg-[#DDD4CE] hover:bg-[#E19D7E] transition-colors duration-300"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleDelete}
                  className="px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-[#e57373] to-[#ef5350] hover:from-[#ef5350] hover:to-[#e53935] transition-all duration-300"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
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
        
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-scale-in {
          animation: scaleIn 0.4s ease-out forwards;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default GestionProductos;



