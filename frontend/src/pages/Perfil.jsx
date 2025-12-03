import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MisPedidos from '../components/MisPedidos';
import ForgotPassword from '../components/ForgotPassword';
import MapaSelector from '../components/MapaSelector';

const tabs = [
  {
    id: 'perfil', label: 'Información', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    )
  },
  {
    id: 'pedidos', label: 'Pedidos', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
    )
  },
  {
    id: 'direcciones', label: 'Direcciones', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )
  },
  {
    id: 'seguridad', label: 'Configuración', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )
  }
];

const Perfil = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const [activeTab, setActiveTab] = useState('perfil');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', avatarUrl: '' });
  const [newDir, setNewDir] = useState({ alias: '', linea1: '', linea2: '', ciudad: '', region: '', cp: '', referencias: '', latitud: null, longitud: null, principal: false, activo: true });
  const [passwordForm, setPasswordForm] = useState({ passwordActual: '', nuevaPassword: '' });
  const [notification, setNotification] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [direccionToDelete, setDireccionToDelete] = useState(null);

  useEffect(() => {
    fetchPerfil();
  }, []);

  const fetchPerfil = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/api/perfil`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
      setForm({
        nombre: res.data.nombre || '',
        email: res.data.email || '',
        telefono: res.data.telefono || '',
        avatarUrl: res.data.avatarUrl || ''
      });
    } catch (err) {
      console.error('Error cargando perfil', err);
      setNotification({ type: 'error', msg: 'No se pudo cargar tu perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const savePerfil = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${api}/api/perfil`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notify('Perfil actualizado correctamente');
      fetchPerfil();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'No se pudo actualizar el perfil';
      notify(errorMsg, 'error');
    }
  };

  const addDireccion = async (e) => {
    e.preventDefault();
    
    if (!newDir.latitud || !newDir.longitud) {
      notify('Por favor selecciona una ubicación en el mapa', 'error');
      return;
    }
    
    try {
      await axios.post(`${api}/api/perfil/direcciones`, newDir, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewDir({ alias: '', linea1: '', linea2: '', ciudad: '', region: '', cp: '', referencias: '', latitud: null, longitud: null, principal: false, activo: true });
      notify('Dirección guardada exitosamente');
      fetchPerfil();
    } catch (err) {
      notify('No se pudo guardar la dirección', 'error');
    }
  };

  const openDeleteModal = (id) => {
    setDireccionToDelete(id);
    setShowDeleteModal(true);
  };

  const deleteDireccion = async () => {
    if (!direccionToDelete) return;
    
    try {
      await axios.delete(`${api}/api/perfil/direcciones/${direccionToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notify('Dirección eliminada');
      fetchPerfil();
    } catch (err) {
      notify('Error al eliminar la dirección', 'error');
    } finally {
      setShowDeleteModal(false);
      setDireccionToDelete(null);
    }
  };

  const marcarComoPrincipal = async (id) => {
    try {
      const direccionActual = data.direcciones.find(d => d.id === id);
      if (!direccionActual) return;
      
      await axios.put(`${api}/api/perfil/direcciones/${id}`, 
        { ...direccionActual, principal: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      notify('Dirección principal actualizada');
      fetchPerfil();
    } catch (err) {
      notify('Error al marcar como principal', 'error');
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${api}/api/perfil/password`, passwordForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPasswordForm({ passwordActual: '', nuevaPassword: '' });
      notify('Contraseña actualizada correctamente');
    } catch (err) {
      notify('No se pudo actualizar la contraseña', 'error');
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-neutral-600 font-medium animate-pulse font-body">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Notificaciones */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg transform transition-all duration-300 animate-slide-in-right font-body ${notification.type === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' : 'bg-secondary-light text-secondary-dark border-l-4 border-secondary'
            }`}>
            <p className="font-medium">{notification.msg}</p>
          </div>
        )}

        {/* Header del Perfil */}
        <div className="bg-white rounded-3xl shadow-card border border-neutral-100 p-6 md:p-8 relative overflow-hidden transition-all duration-300 hover:shadow-hover">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-neutral-100 transition-transform duration-300 group-hover:scale-105">
                {data.avatarUrl ? (
                  <img src={data.avatarUrl} alt={data.nombre} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-white text-4xl font-bold font-title">
                    {(data.nombre || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-md hover:bg-primary-dark transition-all duration-200 hover:scale-110" title="Cambiar foto">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
            </div>

            {/* Info Usuario */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-3xl font-bold text-neutral-900 font-title">{data.nombre}</h1>
              <p className="text-neutral-500 font-medium font-body">{data.email}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary-dark text-xs font-bold uppercase tracking-wider font-title">
                  {user?.rol || 'Cliente'}
                </span>
                <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary-dark text-xs font-bold flex items-center gap-1 font-title">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  {data.pedidos?.length || 0} Pedidos
                </span>
              </div>
            </div>

            {/* Botones de Acción (Desktop) */}
            <div className="hidden md:flex flex-col gap-3 items-end">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-100 text-neutral-600 font-semibold hover:bg-neutral-200 transition-all duration-300 font-body"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-2 sticky top-20 z-30 backdrop-blur-md bg-white/90">
          <nav className="flex flex-wrap md:flex-nowrap justify-between gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 font-title ${activeTab === tab.id
                  ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20 scale-105'
                  : 'text-neutral-500 hover:bg-neutral-50 hover:text-primary'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido Principal con Transiciones */}
        <div className="min-h-[400px] transition-all duration-500 ease-in-out">
          {activeTab === 'perfil' && (
            <div className="bg-white rounded-3xl shadow-card border border-neutral-100 p-6 md:p-10 animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-neutral-900 font-title">Información Personal</h2>
                <p className="text-neutral-500 mt-1 font-body">Administra tu información de contacto y detalles personales.</p>
              </div>

              <form onSubmit={savePerfil} className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                <InputGroup label="Nombre Completo" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} />
                <InputGroup label="Correo Electrónico" value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" />
                <InputGroup label="Teléfono" value={form.telefono} onChange={(v) => setForm({ ...form, telefono: v })} type="tel" />
                <InputGroup label="URL de Avatar" value={form.avatarUrl} onChange={(v) => setForm({ ...form, avatarUrl: v })} />

                <div className="md:col-span-2 pt-4 flex justify-end">
                  <button className="px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-title">
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'pedidos' && (
            <div className="bg-white rounded-3xl shadow-card border border-neutral-100 p-6 animate-fade-in">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 font-title">Mis Pedidos</h2>
                  <p className="text-neutral-500 mt-1 font-body">Historial de tus compras recientes.</p>
                </div>
              </div>
              <MisPedidos embedded />
            </div>
          )}

          {activeTab === 'direcciones' && (
            <div className="grid lg:grid-cols-3 gap-6 animate-fade-in">
              {/* Formulario Nueva Dirección */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl shadow-card border border-neutral-100 p-6 sticky top-24 transition-all duration-300 hover:shadow-hover">
                  <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2 font-title">
                    <span className="p-2 rounded-lg bg-secondary/10 text-secondary-dark"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg></span>
                    Nueva Dirección
                  </h3>
                  <form onSubmit={addDireccion} className="space-y-4">
                    <InputGroup label="Alias (ej. Casa)" value={newDir.alias} onChange={(v) => setNewDir({ ...newDir, alias: v })} small />
                    <InputGroup label="Dirección" value={newDir.linea1} onChange={(v) => setNewDir({ ...newDir, linea1: v })} required small />
                    <InputGroup label="Detalles" value={newDir.linea2} onChange={(v) => setNewDir({ ...newDir, linea2: v })} small />
                    
                    {/* Selector de ubicación en el mapa */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-neutral-800 font-title">
                        Ubicación en el Mapa <span className="text-red-400">*</span>
                      </label>
                      <MapaSelector
                        onLocationSelect={(data) => {
                          setNewDir(prev => ({
                            ...prev,
                            latitud: data.lat,
                            longitud: data.lng,
                            linea1: data.direccion || prev.linea1,
                            ciudad: data.ciudad || prev.ciudad,
                            cp: data.codigoPostal || prev.cp
                          }));
                        }}
                      />
                      {newDir.latitud && newDir.longitud && (
                        <p className="text-xs text-green-600 flex items-center gap-1 font-body">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Ubicación guardada
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <InputGroup label="Ciudad" value={newDir.ciudad} onChange={(v) => setNewDir({ ...newDir, ciudad: v })} small />
                      <InputGroup label="CP" value={newDir.cp} onChange={(v) => setNewDir({ ...newDir, cp: v })} small />
                    </div>
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-100 hover:bg-neutral-50 cursor-pointer transition">
                      <input type="checkbox" checked={newDir.principal} onChange={(e) => setNewDir({ ...newDir, principal: e.target.checked })} className="w-4 h-4 text-primary rounded border-neutral-300 focus:ring-primary" />
                      <span className="text-sm font-medium text-neutral-700 font-body">Marcar como principal</span>
                    </label>
                    <button className="w-full py-3 bg-neutral-900 text-white rounded-full font-bold shadow-md hover:bg-primary transition-all duration-300 hover:-translate-y-0.5 font-title">
                      Agregar Dirección
                    </button>
                  </form>
                </div>
              </div>

              {/* Lista de Direcciones */}
              <div className="lg:col-span-2 space-y-4">
                {data.direcciones?.length === 0 ? (
                  <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-neutral-300 animate-fade-in">
                    <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <p className="text-neutral-500 font-medium font-body">No tienes direcciones guardadas.</p>
                  </div>
                ) : (
                  data.direcciones?.map((d) => (
                    <div key={d.id} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 group hover:border-primary/30 transition-all duration-300 hover:shadow-md animate-fade-in">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${d.principal ? 'bg-primary/10 text-primary' : 'bg-neutral-100 text-neutral-500 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-neutral-800 font-title">{d.alias || 'Dirección'}</h4>
                              {d.principal && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-white uppercase animate-pulse font-title">Principal</span>}
                            </div>
                            <p className="text-neutral-600 text-sm font-body">{d.linea1}</p>
                            {d.linea2 && <p className="text-neutral-500 text-xs mt-0.5 font-body">{d.linea2}</p>}
                            <p className="text-neutral-400 text-xs mt-1 font-body">{d.ciudad}, {d.cp}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => openDeleteModal(d.id)}
                          className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Eliminar dirección"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                      
                      {/* Botón para marcar como principal */}
                      {!d.principal && (
                        <button
                          onClick={() => marcarComoPrincipal(d.id)}
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-primary/5 to-secondary/5 hover:from-primary hover:to-secondary text-primary hover:text-white rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 group/btn border border-primary/20 hover:border-transparent shadow-sm hover:shadow-md"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Marcar como principal
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'seguridad' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
              {/* Sección de Recuperar Contraseña */}
              <div className="bg-white rounded-3xl shadow-card border border-neutral-100 overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 px-6 py-4 border-b border-neutral-100">
                  <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2 font-title">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                    Actualizar Contraseña
                  </h2>
                  <p className="text-neutral-600 text-sm mt-1 font-body">Cambia tu contraseña de forma segura</p>
                </div>
                <div className="p-6">
                  <ForgotPassword embedded onSuccess={() => notify('Revisa tu correo para actualizar tu contraseña')} />
                </div>
              </div>

              {/* Sección de Cambio Directo (Opcional - con contraseña actual) */}
              <div className="bg-white rounded-3xl shadow-card border border-neutral-100 p-8 transition-all duration-300 hover:shadow-hover">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2 font-title">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Cambio Rápido de Contraseña
                  </h2>
                  <p className="text-neutral-500 text-sm font-body">Si conoces tu contraseña actual, cámbiala directamente aquí.</p>
                </div>
                <form onSubmit={changePassword} className="space-y-4">
                  <InputGroup label="Contraseña Actual" type="password" value={passwordForm.passwordActual} onChange={(v) => setPasswordForm({ ...passwordForm, passwordActual: v })} required />
                  <InputGroup label="Nueva Contraseña" type="password" value={passwordForm.nuevaPassword} onChange={(v) => setPasswordForm({ ...passwordForm, nuevaPassword: v })} required />
                  <div className="pt-2">
                    <button className="w-full py-3 bg-neutral-800 text-white rounded-full font-bold shadow hover:bg-black transition-all duration-300 hover:-translate-y-0.5 font-title">
                      Actualizar Contraseña
                    </button>
                  </div>
                </form>
              </div>

              {/* Botón Logout Móvil */}
              <div className="md:hidden pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 bg-neutral-200 text-neutral-700 rounded-xl font-bold shadow hover:bg-neutral-300 transition-all duration-300 font-title"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación para eliminar dirección */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-neutral-900 text-center mb-3 font-title">
              ¿Eliminar dirección?
            </h3>
            <p className="text-neutral-600 text-center mb-8 font-body">
              Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar esta dirección?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDireccionToDelete(null);
                }}
                className="flex-1 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-bold transition-all duration-200 font-title"
              >
                Cancelar
              </button>
              <button
                onClick={deleteDireccion}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl font-title"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InputGroup = ({ label, value, onChange, type = 'text', required, disabled, small }) => (
  <div className="space-y-1.5">
    <label className={`block font-bold text-neutral-800 font-title ${small ? 'text-xs' : 'text-sm'}`}>{label}</label>
    <input
      type={type}
      value={value}
      required={required}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-xl border-neutral-200 bg-white text-neutral-800 focus:border-primary focus:ring-primary/20 transition-all duration-200 font-body ${small ? 'px-3 py-2 text-sm' : 'px-4 py-3'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    />
  </div>
);

export default Perfil;
