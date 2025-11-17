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
    categoria: ''
  });

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await axios.get(`${api}/api/admin/productos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductos(response.data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      await axios.post(`${api}/api/admin/productos`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ nombre: '', descripcion: '', precio: '', imagen: '', categoria: '' });
      setShowForm(false);
      fetchProductos();
    } catch (error) {
      console.error('Error creando producto:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar este producto?')) {
      try {
        const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        await axios.delete(`${api}/api/admin/productos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProductos();
      } catch (error) {
        console.error('Error eliminando producto:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestión de Productos</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            + Nuevo Producto
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="border px-4 py-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Precio"
                value={formData.precio}
                onChange={(e) => setFormData({...formData, precio: e.target.value})}
                className="border px-4 py-2 rounded"
                required
              />
              <textarea
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                className="border px-4 py-2 rounded col-span-2"
              />
              <input
                type="text"
                placeholder="URL Imagen"
                value={formData.imagen}
                onChange={(e) => setFormData({...formData, imagen: e.target.value})}
                className="border px-4 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Categoría"
                value={formData.categoria}
                onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                className="border px-4 py-2 rounded"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Guardar
              </button>
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productos.map(producto => (
            <div key={producto.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={`http://localhost:8080${producto.imagen}`}
                alt={producto.nombre}
                className="w-full h-48 object-cover"
                onError={(e) => e.target.src = '/img/default.png'}
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{producto.nombre}</h3>
                <p className="text-gray-600 text-sm mb-2">{producto.descripcion}</p>
                <p className="text-green-600 font-bold text-xl mb-4">S/ {Number(producto.precio).toFixed(2)}</p>
                <button
                  onClick={() => handleDelete(producto.id)}
                  className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GestionProductos;