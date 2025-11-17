import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const GestionContactos = () => {
  const { token } = useAuth();
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('TODOS');
  const [detallesModal, setDetallesModal] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchContactos();
  }, []);

  const fetchContactos = async () => {
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await axios.get(`${api}/api/admin/contactos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContactos(response.data);
    } catch (error) {
      console.error('Error cargando contactos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContacto = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este contacto?')) {
      try {
        const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        await axios.delete(`${api}/api/admin/contactos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContactos(contactos.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error eliminando contacto:', error);
      }
    }
  };

  const contactosFiltrados = contactos.filter(c => {
    const coincideBusqueda = 
      c.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.asunto?.toLowerCase().includes(busqueda.toLowerCase());
    return coincideBusqueda;
  });

  if (loading) return <div className="text-center py-10">Cargando contactos...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Contactos</h1>
          <p className="text-gray-600">Total: {contactos.length} mensajes</p>
        </div>

        {/* Barra de búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nombre, email o asunto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Mostrando {contactosFiltrados.length} de {contactos.length} contactos
          </p>
        </div>

        {/* Tabla de Contactos */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Nombre</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Asunto</th>
                <th className="px-6 py-4 text-left">Fecha</th>
                <th className="px-6 py-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contactosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    {busqueda ? 'No se encontraron resultados' : 'No hay contactos registrados'}
                  </td>
                </tr>
              ) : (
                contactosFiltrados.map(contacto => (
                  <tr key={contacto.id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{contacto.nombre}</p>
                    </td>
                    <td className="px-6 py-4">
                      <a 
                        href={`mailto:${contacto.email}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {contacto.email}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700 font-medium">{contacto.asunto}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(contacto.fecha).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setDetallesModal(contacto)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm mr-3"
                      >
                        Leer
                      </button>
                      <button
                        onClick={() => handleDeleteContacto(contacto.id)}
                        className="text-red-600 hover:text-red-800 font-semibold text-sm"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal de Detalles */}
        {detallesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
              
              {/* Encabezado Modal */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Mensaje de Contacto</h2>
                <button
                  onClick={() => setDetallesModal(null)}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Contenido Modal */}
              <div className="p-6 max-h-96 overflow-y-auto">
                
                {/* Información del Remitente */}
                <div className="mb-6 pb-6 border-b">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Información del Remitente</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Nombre</p>
                      <p className="font-semibold text-gray-900">{detallesModal.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <a 
                        href={`mailto:${detallesModal.email}`}
                        className="font-semibold text-blue-600 hover:text-blue-800"
                      >
                        {detallesModal.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Información del Mensaje */}
                <div className="mb-6 pb-6 border-b">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Mensaje</h3>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Asunto</p>
                    <p className="font-semibold text-gray-900 mb-4">{detallesModal.asunto}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Contenido</p>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {detallesModal.mensaje}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fecha */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600">Recibido el</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(detallesModal.fecha).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </p>
                </div>

                {/* Botones de Acción */}
                <div className="flex gap-3">
                  <a
                    href={`mailto:${detallesModal.email}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition text-center"
                  >
                    Responder por Email
                  </a>
                  <button
                    onClick={() => setDetallesModal(null)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionContactos;