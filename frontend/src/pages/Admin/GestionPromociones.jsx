import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const GestionPromociones = () => {
  const { token } = useAuth();
  const [promociones, setPromociones] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [productoIdSeleccionado, setProductoIdSeleccionado] = useState('');
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    descuento: '',
    precioTotal: '',
    fechaInicio: '',
    fechaFin: '',
    activo: true,
    imagenUrl: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

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
    if (!token) return;
    fetchPromociones();
    fetchProductos();
  }, [token]);

  const fetchPromociones = async () => {
    try {
      setLoading(true);
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await axios.get(`${api}/api/admin/dashboard/promociones`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPromociones(response.data);
    } catch (error) {
      console.error('Error cargando promociones:', error);
      setNotification({
        show: true,
        message: 'Error al cargar promociones',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProductos = async () => {
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await axios.get(`${api}/api/admin/dashboard/productos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductosDisponibles(response.data || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setNotification({
        show: true,
        message: 'No hay token de autenticación. Inicia sesión nuevamente.',
        type: 'error'
      });
      return;
    }
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const payload = {
        nombrePromo: formData.nombre,
        descripcion: formData.descripcion,
        descuento: formData.descuento,
        precioTotal: formData.precioTotal,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        activo: formData.activo,
        imagenUrl: formData.imagenUrl,
        productos: productosSeleccionados.map((p) => ({
          productoId: p.productoId,
          cantidad: p.cantidad,
        })),
      };
      
      if (editingId) {
        // Actualizar promoción existente
        await axios.put(`${api}/api/admin/dashboard/promociones/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotification({
          show: true,
          message: 'Promoción actualizada exitosamente',
          type: 'success'
        });
      } else {
        // Crear nueva promoción
        await axios.post(`${api}/api/admin/dashboard/promociones`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotification({
          show: true,
          message: 'Promoción creada exitosamente',
          type: 'success'
        });
      }
      
      resetForm();
      fetchPromociones();
    } catch (error) {
      console.error('Error guardando promoción:', error);
      setNotification({
        show: true,
        message: 'Error: ' + (error.response?.data?.message || error.message),
        type: 'error'
      });
    }
  };

  const handleEdit = (promocion) => {
    setFormData({
      nombre: promocion.nombrePromo,
      descripcion: promocion.descripcion,
      descuento: promocion.descuento,
      precioTotal: promocion.precioTotal,
      fechaInicio: promocion.fechaInicio,
      fechaFin: promocion.fechaFin,
      activo: promocion.activo ?? true,
      imagenUrl: promocion.imagenUrl
    });
    setProductosSeleccionados(
      (promocion.productos || []).map((p) => ({
        productoId: p.productoId,
        nombre: p.nombre,
        cantidad: p.cantidad || 1,
      }))
    );
    setEditingId(promocion.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta promoción?')) {
      return;
    }
    
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      await axios.delete(`${api}/api/admin/dashboard/promociones/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotification({
        show: true,
        message: 'Promoción eliminada correctamente',
        type: 'success'
      });
      fetchPromociones();
    } catch (error) {
      console.error('Error eliminando promoción:', error);
      setNotification({
        show: true,
        message: 'Error: ' + (error.response?.data?.message || error.message),
        type: 'error'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      descuento: '',
      precioTotal: '',
      fechaInicio: '',
      fechaFin: '',
      activo: true,
      imagenUrl: ''
    });
    setProductosSeleccionados([]);
    setProductoIdSeleccionado('');
    setCantidadSeleccionada(1);
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddProducto = () => {
    if (!productoIdSeleccionado) return;
    const yaExiste = productosSeleccionados.find((p) => p.productoId === Number(productoIdSeleccionado));
    const cantidad = Number(cantidadSeleccionada) || 1;
    const prodInfo = productosDisponibles.find((p) => p.id === Number(productoIdSeleccionado));

    if (yaExiste) {
      setProductosSeleccionados(
        productosSeleccionados.map((p) =>
          p.productoId === Number(productoIdSeleccionado) ? { ...p, cantidad: p.cantidad + cantidad } : p
        )
      );
    } else {
      setProductosSeleccionados([
        ...productosSeleccionados,
        {
          productoId: Number(productoIdSeleccionado),
          nombre: prodInfo?.nombre || 'Producto',
          cantidad,
        },
      ]);
    }
    setProductoIdSeleccionado('');
    setCantidadSeleccionada(1);
  };

  const handleRemoveProducto = (productoId) => {
    setProductosSeleccionados(productosSeleccionados.filter((p) => p.productoId !== productoId));
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
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-[#dbbba6] mb-6"></div>
            <p className="text-xl text-[#6d4c41] font-quicksand">Cargando promociones...</p>
          </div>
        </div>

        {/* Estilos de Animación y Fuentes */}
        <style jsx global>{`
          .gradient-hero {
            background: linear-gradient(135deg, #f5f0e8 0%, #e8d7c3 100%);
          }
        `}</style>
      </section>
    );
  }

  // Formatea fechas evitando desfases por zona horaria (muestra solo la parte de fecha)
  const formatDate = (value) => {
    if (!value) return '—';
    const str = typeof value === 'string' ? value : String(value);
    return str.split('T')[0] || str;
  };

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
            className="text-4xl md:text-5xl text-[#3e2723] font-bold mb-4 relative pb-4 font-cinzel"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.1s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            Gestión de Promociones
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-[#d4af37] to-[#e8b4b8] rounded-full"></span>
          </h1>
          <p 
            className="text-lg text-[#6d4c41] font-quicksand"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.3s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            Total: {promociones.length} promociones
          </p>
        </div>

        {/* Botón para agregar promoción */}
        <div 
          className="mb-8 text-center"
          style={{ 
            animation: animate ? `fadeInUp 0.6s ease-out 0.5s both` : 'none',
            opacity: animate ? 1 : 0
          }}
        >
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-[#e8b4b8] to-[#d4af37] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nueva Promoción
          </button>
        </div>

        {/* Formulario de creación/edición de promoción */}
        {showForm && (
          <div 
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border-l-4 border-[#e8b4b8] animate-scale-in"
            style={{ 
              animation: animate ? `scaleIn 0.4s ease-out 0.7s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            <h2 className="text-2xl font-bold text-[#3e2723] mb-6 font-cinzel">
              {editingId ? 'Editar Promoción' : 'Crear Nueva Promoción'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#6d4c41] font-medium mb-2 font-montserrat">Nombre</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-[#d7ccc8] focus:outline-none focus:ring-2 focus:ring-[#e8b4b8] focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#6d4c41] font-medium mb-2 font-montserrat">Descuento (%)</label>
                  <input
                    type="number"
                    value={formData.descuento}
                    onChange={(e) => setFormData({...formData, descuento: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-[#d7ccc8] focus:outline-none focus:ring-2 focus:ring-[#e8b4b8] focus:border-transparent transition-all"
                    min="0"
                    max="100"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#6d4c41] font-medium mb-2 font-montserrat">Fecha Inicio</label>
                  <input
                    type="date"
                    value={formData.fechaInicio}
                    onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-[#d7ccc8] focus:outline-none focus:ring-2 focus:ring-[#e8b4b8] focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#6d4c41] font-medium mb-2 font-montserrat">Fecha Fin</label>
                  <input
                    type="date"
                    value={formData.fechaFin}
                    onChange={(e) => setFormData({...formData, fechaFin: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-[#d7ccc8] focus:outline-none focus:ring-2 focus:ring-[#e8b4b8] focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#6d4c41] font-medium mb-2 font-montserrat">URL Imagen</label>
                  <input
                    type="text"
                    value={formData.imagenUrl}
                    onChange={(e) => setFormData({...formData, imagenUrl: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-[#d7ccc8] focus:outline-none focus:ring-2 focus:ring-[#e8b4b8] focus:border-transparent transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[#6d4c41] font-medium mb-2 font-montserrat">Descripción</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-[#d7ccc8] focus:outline-none focus:ring-2 focus:ring-[#e8b4b8] focus:border-transparent transition-all"
                    rows="3"
                  ></textarea>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="activo"
                    checked={formData.activo}
                    onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                    className="h-5 w-5 text-[#e8b4b8] focus:ring-[#e8b4b8] border-gray-300 rounded"
                  />
                  <label htmlFor="activo" className="ml-2 block text-sm text-[#6d4c41] font-montserrat">
                    Activo
                  </label>
                </div>
              </div>

              {/* Selección de productos para la promoción */}
              <div className="mt-6 border rounded-xl p-4 bg-[#f9f6f2]">
                <h3 className="text-lg font-semibold text-[#3e2723] mb-3 font-montserrat">Productos en la promoción</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-[#6d4c41] font-medium mb-2 font-montserrat">Producto</label>
                    <select
                      value={productoIdSeleccionado}
                      onChange={(e) => setProductoIdSeleccionado(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-[#d7ccc8] focus:outline-none focus:ring-2 focus:ring-[#e8b4b8] focus:border-transparent transition-all"
                    >
                      <option value="">Selecciona un producto</option>
                      {productosDisponibles.map((p) => (
                        <option key={p.id} value={p.id}>{p.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#6d4c41] font-medium mb-2 font-montserrat">Cantidad</label>
                    <input
                      type="number"
                      min="1"
                      value={cantidadSeleccionada}
                      onChange={(e) => setCantidadSeleccionada(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-[#d7ccc8] focus:outline-none focus:ring-2 focus:ring-[#e8b4b8] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={handleAddProducto}
                      className="w-full px-4 py-3 rounded-lg font-medium text-white bg-[#6d4c41] hover:bg-[#5d4037] transition-colors duration-300"
                    >
                      Agregar producto
                    </button>
                  </div>
                </div>

                {productosSeleccionados.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-sm text-[#6d4c41] font-semibold mb-2">Productos añadidos:</p>
                    <ul className="space-y-2">
                      {productosSeleccionados.map((p) => (
                        <li key={p.productoId} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-[#f0e6de]">
                          <span className="text-sm text-[#3e2723]">{p.cantidad}x {p.nombre}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveProducto(p.productoId)}
                            className="text-red-500 hover:text-red-700 text-sm font-semibold"
                          >
                            Quitar
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-[#8d6e63]">Aún no has agregado productos.</p>
                )}
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button 
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-lg font-medium text-[#6d4c41] bg-[#f5f0e8] hover:bg-[#e8d7c3] transition-colors duration-300"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-[#e8b4b8] to-[#d4af37] hover:shadow-lg transition-all duration-300"
                >
                  {editingId ? 'Actualizar Promoción' : 'Guardar Promoción'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de promociones */}
        {promociones.length === 0 ? (
          <div 
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.9s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-2xl font-bold text-[#3e2723] mb-2 font-cinzel">No hay promociones registradas</h3>
            <p className="text-[#6d4c41] font-quicksand">Agrega nuevas promociones para comenzar</p>
          </div>
        ) : (
          <div 
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
            style={{ 
              animation: animate ? `fadeInUp 0.6s ease-out 0.9s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#8d6e63] to-[#6d4c41] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-cinzel">ID</th>
                    <th className="px-6 py-4 text-left font-cinzel">Nombre</th>
                    <th className="px-6 py-4 text-left font-cinzel">Descuento</th>
                    <th className="px-6 py-4 text-left font-cinzel">Precio</th>
                    <th className="px-6 py-4 text-left font-cinzel">Productos</th>
                    <th className="px-6 py-4 text-left font-cinzel">Fechas</th>
                    <th className="px-6 py-4 text-left font-cinzel">Estado</th>
                    <th className="px-6 py-4 text-left font-cinzel">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {promociones.map((promocion, index) => (
                    <tr 
                      key={promocion.id} 
                      className="border-t border-[#f5f0e8] hover:bg-[#f9f6f2] transition-colors duration-200"
                      style={{ 
                        animation: animate ? `fadeInUp 0.6s ease-out ${1.1 + index * 0.1}s both` : 'none',
                        opacity: animate ? 1 : 0
                      }}
                    >
                      <td className="px-6 py-4 font-semibold text-[#6d4c41] font-montserrat">{promocion.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="font-semibold text-[#3e2723] font-montserrat">{promocion.nombrePromo}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#6d4c41] font-quicksand">{promocion.descuento}%</td>
                      <td className="px-6 py-4 text-[#6d4c41] font-quicksand">S/ {promocion.precioTotal}</td>
                      <td className="px-6 py-4 text-[#6d4c41] font-quicksand">
                        {promocion.productos && promocion.productos.length > 0 ? (
                          <ul className="text-sm space-y-1">
                            {promocion.productos.map((prod) => (
                              <li key={prod.productoId}>{prod.cantidad}x {prod.nombre}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-xs text-gray-500">Sin productos</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[#6d4c41] font-quicksand">
                        <div className="text-sm">
                          <div>Inicio: {formatDate(promocion.fechaInicio)}</div>
                          <div>Fin: {formatDate(promocion.fechaFin)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          promocion.activo 
                            ? 'bg-gradient-to-r from-[#64b5f6] to-[#42a5f5] text-white' 
                            : 'bg-gradient-to-r from-[#e57373] to-[#ef5350] text-white'
                        }`}>
                          {promocion.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEdit(promocion)}
                            className="text-[#5d4037] hover:text-[#3e2723] font-semibold flex items-center transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                          </button>
                          <button 
                            onClick={() => handleDelete(promocion.id)}
                            className="text-[#c62828] hover:text-[#b71c1c] font-semibold flex items-center transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m0 0v-2m0 0h3m-3 0h3" />
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Estilos de Animación y Fuentes */}
      <style jsx global>{`
        
        .gradient-hero {
          background: linear-gradient(135deg, #f5f0e8 0%, #e8d7c3 100%);
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
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default GestionPromociones;
