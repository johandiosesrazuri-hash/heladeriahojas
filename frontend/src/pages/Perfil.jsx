import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import MisPedidos from '../components/MisPedidos';

const tabs = [
  { id: 'perfil', label: 'Perfil' },
  { id: 'direcciones', label: 'Direcciones' },
  { id: 'pedidos', label: 'Pedidos' },
  { id: 'testimonios', label: 'Testimonios' },
  { id: 'seguridad', label: 'Seguridad' }
];

const Perfil = () => {
  const { token, user } = useAuth();
  const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const [activeTab, setActiveTab] = useState('perfil');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [form, setForm] = useState({ nombre: '', telefono: '', avatarUrl: '' });
  const [newDir, setNewDir] = useState({ alias: '', linea1: '', linea2: '', ciudad: '', region: '', cp: '', referencias: '', principal: false, activo: true });
  const [newTestimonio, setNewTestimonio] = useState({ calificacion: 5, comentario: '' });
  const [passwordForm, setPasswordForm] = useState({ passwordActual: '', nuevaPassword: '' });
  const [notification, setNotification] = useState(null);

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

  const notify = (msg, type = 'success') => setNotification({ msg, type });

  const savePerfil = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${api}/api/perfil`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notify('Perfil actualizado');
      fetchPerfil();
    } catch (err) {
      notify('No se pudo actualizar', 'error');
    }
  };

  const addDireccion = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${api}/api/perfil/direcciones`, newDir, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewDir({ alias: '', linea1: '', linea2: '', ciudad: '', region: '', cp: '', referencias: '', principal: false, activo: true });
      notify('Dirección guardada');
      fetchPerfil();
    } catch (err) {
      notify('No se pudo guardar la dirección', 'error');
    }
  };

  const deleteDireccion = async (id) => {
    if (!window.confirm('¿Eliminar dirección?')) return;
    await axios.delete(`${api}/api/perfil/direcciones/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchPerfil();
  };

  const saveTestimonio = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${api}/api/perfil/testimonios`, newTestimonio, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewTestimonio({ calificacion: 5, comentario: '' });
      notify('Testimonio enviado');
      fetchPerfil();
    } catch (err) {
      notify('No se pudo guardar el testimonio', 'error');
    }
  };

  const deleteTestimonio = async (id) => {
    if (!window.confirm('¿Eliminar testimonio?')) return;
    await axios.delete(`${api}/api/perfil/testimonios/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchPerfil();
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${api}/api/perfil/password`, passwordForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPasswordForm({ passwordActual: '', nuevaPassword: '' });
      notify('Contraseña actualizada');
    } catch (err) {
      notify('No se pudo actualizar la contraseña', 'error');
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#DDD4CE] via-[#E19D7E] to-[#C1583B]">
        <div className="text-center space-y-3">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-white/80 mb-2" />
          <p className="text-white font-semibold text-lg">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  const pills = tabs.map((t) => (
    <button
      key={t.id}
      onClick={() => setActiveTab(t.id)}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
        activeTab === t.id
          ? 'bg-[#C1583B] text-white border-transparent shadow-md'
          : 'bg-white/40 text-[#904939] border-[#f0e5dd] hover:bg-white hover:shadow'
      }`}
    >
      {t.label}
    </button>
  ));

  const quickStats = [
    { label: 'Pedidos', value: data.pedidos?.length || 0, emoji: '📦', color: 'from-amber-400 to-amber-500' },
    { label: 'Direcciones', value: data.direcciones?.length || 0, emoji: '🏠', color: 'from-emerald-400 to-emerald-500' },
    { label: 'Testimonios', value: data.testimonios?.length || 0, emoji: '⭐', color: 'from-sky-400 to-sky-500' }
  ];

  return (
    <section className="py-10 px-4 md:px-10 lg:px-16 min-h-screen bg-gradient-to-br from-[#DDD4CE] via-[#E19D7E] to-[#C1583B]">
      {notification && (
        <div className={`mb-4 px-4 py-3 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {notification.msg}
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40">
        {/* Hero */}
        <div className="relative p-6 md:p-8 bg-gradient-to-r from-[#904939] via-[#C1583B] to-[#E19D7E] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#ffffff22,transparent_35%)]"></div>
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white/20 border border-white/30 shadow-lg flex items-center justify-center text-3xl overflow-hidden">
                {data.avatarUrl ? (
                  <img src={data.avatarUrl} alt={data.nombre} className="w-full h-full object-cover" />
                ) : (
                  (data.nombre || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/80 font-semibold">Perfil</p>
                <h1 className="text-3xl md:text-4xl font-bold">{data.nombre}</h1>
                <p className="text-white/90">{data.email}</p>
                <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
                  {user?.rol}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">{pills}</div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Quick stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickStats.map((stat) => (
              <div key={stat.label} className={`bg-gradient-to-r ${stat.color} text-white rounded-2xl p-4 shadow-lg flex items-center justify-between`}>
                <div>
                  <p className="text-sm uppercase tracking-wide text-white/80 font-semibold">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.emoji}</span>
              </div>
            ))}
          </div>

          {activeTab === 'perfil' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <form onSubmit={savePerfil} className="space-y-4 bg-white rounded-2xl p-5 shadow border border-[#f0e5dd]">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👤</span>
                  <h3 className="text-xl font-bold text-[#904939]">Información personal</h3>
                </div>
                <Input label="Nombre" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} />
                <Input label="Teléfono" value={form.telefono} onChange={(v) => setForm({ ...form, telefono: v })} />
                <Input label="Avatar URL" value={form.avatarUrl} onChange={(v) => setForm({ ...form, avatarUrl: v })} />
                <button className="w-full px-4 py-3 bg-gradient-to-r from-[#C1583B] to-[#904939] text-white rounded-lg font-semibold shadow hover:shadow-lg transition">
                  Guardar cambios
                </button>
              </form>

              <div className="space-y-4 bg-white rounded-2xl p-5 shadow border border-[#f0e5dd]">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <h3 className="text-xl font-bold text-[#904939]">Resumen rápido</h3>
                </div>
                <div className="rounded-xl bg-gradient-to-r from-[#f7f1ed] to-white p-4 border border-[#f0e5dd]">
                  <p className="text-sm text-[#C1583B] font-semibold">Dirección principal</p>
                  {data.direcciones?.length ? (
                    data.direcciones.filter((d) => d.principal).map((d) => (
                      <p key={d.id} className="text-[#904939]">{d.alias || 'Principal'}: {d.linea1}</p>
                    ))
                  ) : (
                    <p className="text-[#C1583B]">Aún no guardas direcciones</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-[#f0e5dd] bg-[#fdf8f5]">
                    <p className="text-sm text-[#C1583B]">Pedidos</p>
                    <p className="text-2xl font-bold text-[#904939]">{data.pedidos?.length || 0}</p>
                  </div>
                  <div className="p-3 rounded-xl border border-[#f0e5dd] bg-[#fdf8f5]">
                    <p className="text-sm text-[#C1583B]">Testimonios</p>
                    <p className="text-2xl font-bold text-[#904939]">{data.testimonios?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'direcciones' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏠</span>
                <h3 className="text-xl font-bold text-[#904939]">Direcciones</h3>
              </div>
              <form onSubmit={addDireccion} className="grid md:grid-cols-2 gap-3 bg-white p-5 rounded-2xl shadow border border-[#f0e5dd]">
                <Input label="Alias" value={newDir.alias} onChange={(v) => setNewDir({ ...newDir, alias: v })} />
                <Input label="Dirección" value={newDir.linea1} onChange={(v) => setNewDir({ ...newDir, linea1: v })} required />
                <Input label="Detalle" value={newDir.linea2} onChange={(v) => setNewDir({ ...newDir, linea2: v })} />
                <Input label="Ciudad" value={newDir.ciudad} onChange={(v) => setNewDir({ ...newDir, ciudad: v })} />
                <Input label="Región" value={newDir.region} onChange={(v) => setNewDir({ ...newDir, region: v })} />
                <Input label="CP" value={newDir.cp} onChange={(v) => setNewDir({ ...newDir, cp: v })} />
                <Input label="Referencias" value={newDir.referencias} onChange={(v) => setNewDir({ ...newDir, referencias: v })} />
                <label className="flex items-center gap-2 text-[#904939] font-semibold">
                  <input type="checkbox" checked={newDir.principal} onChange={(e) => setNewDir({ ...newDir, principal: e.target.checked })} />
                  Marcar como principal
                </label>
                <button className="md:col-span-2 px-4 py-3 bg-gradient-to-r from-[#64b5f6] to-[#42a5f5] text-white rounded-lg font-semibold shadow hover:shadow-lg transition">
                  Guardar dirección
                </button>
              </form>
              <div className="space-y-3">
                {data.direcciones?.map((d) => (
                  <div key={d.id} className="p-4 rounded-xl border border-[#f0e5dd] bg-white flex justify-between items-start shadow-sm">
                    <div>
                      <p className="font-semibold text-[#904939]">{d.alias || 'Dirección'}</p>
                      <p className="text-[#C1583B]">{d.linea1}</p>
                      {d.linea2 && <p className="text-[#C1583B]">{d.linea2}</p>}
                      <p className="text-sm text-[#C1583B]">{d.ciudad} {d.region} {d.cp}</p>
                      {d.principal && <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">Principal</span>}
                    </div>
                    <button onClick={() => deleteDireccion(d.id)} className="text-[#c62828] font-semibold hover:underline">Eliminar</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pedidos' && (
            <div className="bg-white rounded-2xl shadow border border-[#f0e5dd] p-5">
              <MisPedidos embedded />
            </div>
          )}

          {activeTab === 'testimonios' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⭐</span>
                <h3 className="text-xl font-bold text-[#904939]">Mis testimonios</h3>
              </div>
              <form onSubmit={saveTestimonio} className="grid md:grid-cols-2 gap-3 bg-white p-5 rounded-2xl shadow border border-[#f0e5dd]">
                <Input label="Calificación (1-5)" type="number" min="1" max="5" value={newTestimonio.calificacion} onChange={(v) => setNewTestimonio({ ...newTestimonio, calificacion: Number(v) })} required />
                <Input label="Comentario" value={newTestimonio.comentario} onChange={(v) => setNewTestimonio({ ...newTestimonio, comentario: v })} required />
                <button className="md:col-span-2 px-4 py-3 bg-gradient-to-r from-[#8d6e63] to-[#C1583B] text-white rounded-lg font-semibold shadow hover:shadow-lg transition">
                  Guardar testimonio
                </button>
              </form>
              <div className="space-y-3">
                {data.testimonios?.map((t) => (
                  <div key={t.id} className="p-4 rounded-xl bg-white border border-[#f0e5dd] flex justify-between items-start shadow-sm">
                    <div>
                      <p className="font-semibold text-[#904939]">⭐ {t.calificacion}</p>
                      <p className="text-[#C1583B]">{t.comentario}</p>
                    </div>
                    <button onClick={() => deleteTestimonio(t.id)} className="text-[#c62828] font-semibold hover:underline">Eliminar</button>
                  </div>
                ))}
                {!data.testimonios?.length && <p className="text-[#C1583B]">No has enviado testimonios aún.</p>}
              </div>
            </div>
          )}

          {activeTab === 'seguridad' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔒</span>
                <h3 className="text-xl font-bold text-[#904939]">Seguridad</h3>
              </div>
              <form onSubmit={changePassword} className="grid md:grid-cols-2 gap-3 bg-white p-5 rounded-2xl shadow border border-[#f0e5dd]">
                <Input label="Contraseña actual" type="password" value={passwordForm.passwordActual} onChange={(v) => setPasswordForm({ ...passwordForm, passwordActual: v })} required />
                <Input label="Nueva contraseña" type="password" value={passwordForm.nuevaPassword} onChange={(v) => setPasswordForm({ ...passwordForm, nuevaPassword: v })} required />
                <button className="md:col-span-2 px-4 py-3 bg-gradient-to-r from-[#C1583B] to-[#904939] text-white rounded-lg font-semibold shadow hover:shadow-lg transition">
                  Actualizar contraseña
                </button>
              </form>
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 shadow-sm">
                <p className="text-red-700 font-semibold mb-2">Eliminar cuenta</p>
                <p className="text-sm text-red-700 mb-2">Esta acción es permanente. Contacta soporte para confirmarlo.</p>
                <button className="px-4 py-3 bg-red-600 text-white rounded-lg font-semibold opacity-60 cursor-not-allowed">
                  Solicitar eliminación
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const Input = ({ label, value, onChange, type = 'text', required, min, max }) => (
  <label className="flex flex-col gap-1 text-[#904939] font-semibold">
    <span>{label}</span>
    <input
      type={type}
      min={min}
      max={max}
      value={value}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-3 rounded-lg border border-[#E19D7E] bg-white focus:outline-none focus:ring-2 focus:ring-[#C1583B]"
    />
  </label>
);

export default Perfil;
