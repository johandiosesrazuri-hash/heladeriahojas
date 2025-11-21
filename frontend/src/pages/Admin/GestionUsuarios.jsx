import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const GestionUsuarios = () => {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  
  // Estados para modales
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Estados para formularios
  const [editForm, setEditForm] = useState({ nombre: '', email: '', rol: 'CLIENTE' });
  const [createForm, setCreateForm] = useState({ nombre: '', email: '', password: '', rol: 'CLIENTE' });
  
  // Estados para filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('TODOS');

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
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await axios.get(`${api}/api/admin/dashboard/usuarios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setNotification({
        show: true,
        message: "Error al cargar los usuarios.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  // ========== CREAR USUARIO ==========
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      
      // Usar el endpoint de registro público con el rol especificado
      await axios.post(`${api}/api/auth/register`, {
        nombre: createForm.nombre,
        email: createForm.email,
        password: createForm.password
      });
      
      // Si el rol NO es CLIENTE, actualizar el usuario recién creado
      if (createForm.rol !== 'CLIENTE') {
        const usuarios = await axios.get(`${api}/api/admin/dashboard/usuarios`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const nuevoUsuario = usuarios.data.find(u => u.email === createForm.email);
        
        if (nuevoUsuario) {
          await axios.put(`${api}/api/admin/dashboard/usuarios/${nuevoUsuario.id}`, {
            nombre: createForm.nombre,
            email: createForm.email,
            rol: createForm.rol
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      }
      
      setNotification({
        show: true,
        message: "Usuario creado exitosamente.",
        type: "success"
      });
      setShowCreateModal(false);
      setCreateForm({ nombre: '', email: '', password: '', rol: 'CLIENTE' });
      fetchUsuarios();
    } catch (error) {
      console.error('Error creando usuario:', error);
      setNotification({
        show: true,
        message: error.response?.data?.message || "Error al crear usuario.",
        type: "error"
      });
    }
  };

  // ========== EDITAR USUARIO ==========
  const openEditModal = (usuario) => {
    setSelectedUser(usuario);
    setEditForm({
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    });
    setShowEditModal(true);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      await axios.put(`${api}/api/admin/dashboard/usuarios/${selectedUser.id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotification({
        show: true,
        message: "Usuario actualizado correctamente.",
        type: "success"
      });
      setShowEditModal(false);
      fetchUsuarios();
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      setNotification({
        show: true,
        message: "Error al actualizar usuario.",
        type: "error"
      });
    }
  };

  // ========== ELIMINAR USUARIO ==========
  const openDeleteModal = (usuario) => {
    setSelectedUser(usuario);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      await axios.delete(`${api}/api/admin/dashboard/usuarios/${selectedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotification({
        show: true,
        message: "Usuario eliminado correctamente.",
        type: "success"
      });
      setShowDeleteModal(false);
      fetchUsuarios();
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      setNotification({
        show: true,
        message: "Error al eliminar usuario.",
        type: "error"
      });
    }
  };

  // ========== FILTROS ==========
  const usuariosFiltrados = usuarios.filter(u => {
    const coincideBusqueda = 
      u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email?.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideRol = filtroRol === 'TODOS' || u.rol === filtroRol;
    
    return coincideBusqueda && coincideRol;
  });

  if (loading) {
    return (
      <section className="py-16 px-4 md:px-8 lg:px-16 min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full gradient-hero"></div>
        </div>
        <div className="relative z-10 container-custom flex flex-col items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-[#E19D7E] mb-6"></div>
            <p className="text-xl text-[#C1583B] font-quicksand">Cargando usuarios...</p>
          </div>
        </div>
        <style>{`.gradient-hero { background: linear-gradient(135deg, #DDD4CE 0%, #E19D7E 100%); }`}</style>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 min-h-screen relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full gradient-hero"></div>
      </div>

      {/* Notificación */}
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
          <h1 className="text-4xl md:text-5xl text-[#904939] font-bold mb-4 relative pb-4 font-cinzel">
            Gestión de Usuarios
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-[#E19D7E] to-[#904939] rounded-full"></span>
          </h1>
          <p className="text-lg text-[#C1583B] font-quicksand">
            Total: {usuarios.length} usuarios
          </p>
        </div>

        {/* Barra de búsqueda y botón crear */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Búsqueda */}
            <div className="flex-1 flex items-center gap-3 p-3 bg-white rounded-lg border border-[#E19D7E]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#C1583B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="flex-1 bg-transparent border-none focus:outline-none font-quicksand"
              />
            </div>

            {/* Filtro por rol */}
            <select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
              className="px-4 py-3 bg-white border border-[#E19D7E] rounded-lg font-quicksand"
            >
              <option value="TODOS">Todos los roles</option>
              <option value="ADMIN">Administradores</option>
              <option value="CLIENTE">Clientes</option>
            </select>

            {/* Botón Crear */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-[#64b5f6] to-[#42a5f5] text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              Nuevo Usuario
            </button>
          </div>
          <p className="text-sm text-[#C1583B] mt-2 font-quicksand">
            Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios
          </p>
        </div>

        {/* Tabla de Usuarios */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#8d6e63] to-[#C1583B] text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-cinzel">ID</th>
                  <th className="px-6 py-4 text-left font-cinzel">Usuario</th>
                  <th className="px-6 py-4 text-left font-cinzel">Email</th>
                  <th className="px-6 py-4 text-left font-cinzel">Rol</th>
                  <th className="px-6 py-4 text-left font-cinzel">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-[#C1583B] font-quicksand">
                      {busqueda || filtroRol !== 'TODOS' ? 'No se encontraron resultados' : 'No hay usuarios registrados'}
                    </td>
                  </tr>
                ) : (
                  usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id} className="border-t border-[#DDD4CE] hover:bg-[#DDD4CE] transition-colors duration-200">
                      <td className="px-6 py-4 font-semibold text-[#C1583B] font-montserrat">{usuario.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#E19D7E] to-[#3aa38f] flex items-center justify-center mr-3">
                            <span className="text-white font-bold font-montserrat">
                              {usuario.nombre?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-semibold text-[#904939] font-montserrat">{usuario.nombre}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#C1583B] font-quicksand">{usuario.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          usuario.rol === 'ADMIN' 
                            ? 'bg-gradient-to-r from-[#e57373] to-[#ef5350] text-white' 
                            : 'bg-gradient-to-r from-[#64b5f6] to-[#42a5f5] text-white'
                        }`}>
                          {usuario.rol === 'ADMIN' ? '👑 Admin' : '👤 Cliente'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openEditModal(usuario)}
                            className="text-[#1976d2] hover:text-[#1565c0] font-semibold flex items-center transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                          </button>
                          <button 
                            onClick={() => openDeleteModal(usuario)}
                            className="text-[#c62828] hover:text-[#b71c1c] font-semibold flex items-center transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Crear Usuario */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold text-[#904939] mb-6 font-cinzel">Crear Nuevo Usuario</h3>
              <form onSubmit={handleCreateUser}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#C1583B] font-medium mb-2">Nombre</label>
                    <input
                      type="text"
                      value={createForm.nombre}
                      onChange={(e) => setCreateForm({...createForm, nombre: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-[#E19D7E] focus:outline-none focus:ring-2 focus:ring-[#64b5f6]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#C1583B] font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={createForm.email}
                      onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-[#E19D7E] focus:outline-none focus:ring-2 focus:ring-[#64b5f6]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#C1583B] font-medium mb-2">Contraseña</label>
                    <input
                      type="password"
                      value={createForm.password}
                      onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-[#E19D7E] focus:outline-none focus:ring-2 focus:ring-[#64b5f6]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#C1583B] font-medium mb-2">Rol</label>
                    <select
                      value={createForm.rol}
                      onChange={(e) => setCreateForm({...createForm, rol: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-[#E19D7E] focus:outline-none focus:ring-2 focus:ring-[#64b5f6]"
                    >
                      <option value="CLIENTE">Cliente</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="submit" className="flex-1 bg-gradient-to-r from-[#64b5f6] to-[#42a5f5] text-white py-3 rounded-lg font-semibold">
                    Crear
                  </button>
                  <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 bg-[#DDD4CE] text-[#C1583B] py-3 rounded-lg font-semibold">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Editar Usuario */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold text-[#904939] mb-6 font-cinzel">Editar Usuario</h3>
              <form onSubmit={handleEditUser}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#C1583B] font-medium mb-2">Nombre</label>
                    <input
                      type="text"
                      value={editForm.nombre}
                      onChange={(e) => setEditForm({...editForm, nombre: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-[#E19D7E] focus:outline-none focus:ring-2 focus:ring-[#1976d2]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#C1583B] font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-[#E19D7E] focus:outline-none focus:ring-2 focus:ring-[#1976d2]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#C1583B] font-medium mb-2">Rol</label>
                    <select
                      value={editForm.rol}
                      onChange={(e) => setEditForm({...editForm, rol: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-[#E19D7E] focus:outline-none focus:ring-2 focus:ring-[#1976d2]"
                    >
                      <option value="CLIENTE">Cliente</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="submit" className="flex-1 bg-gradient-to-r from-[#1976d2] to-[#1565c0] text-white py-3 rounded-lg font-semibold">
                    Guardar
                  </button>
                  <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 bg-[#DDD4CE] text-[#C1583B] py-3 rounded-lg font-semibold">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Eliminar Usuario */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold text-[#c62828] mb-4 font-cinzel">Confirmar Eliminación</h3>
              <p className="text-[#C1583B] mb-6 font-quicksand">
                ¿Estás seguro de eliminar al usuario <strong>{selectedUser?.nombre}</strong>?
                Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteUser}
                  className="flex-1 bg-gradient-to-r from-[#e57373] to-[#ef5350] text-white py-3 rounded-lg font-semibold"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-[#DDD4CE] text-[#C1583B] py-3 rounded-lg font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .gradient-hero {
          background: linear-gradient(135deg, #DDD4CE 0%, #E19D7E 100%);
        }
      `}</style>
    </section>
  );
};

export default GestionUsuarios;



