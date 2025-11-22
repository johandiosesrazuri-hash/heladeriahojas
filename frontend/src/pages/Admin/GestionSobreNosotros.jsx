import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const initialMain = {
  id: null,
  titulo: '',
  subtitulo: '',
  descripcionPrincipal: '',
  mision: '',
  vision: '',
  videoUrl: '',
  imagenPrincipal: '',
  activo: true
};

const GestionSobreNosotros = () => {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [error, setError] = useState(null);
  const [mainForm, setMainForm] = useState(initialMain);
  const [newValor, setNewValor] = useState({ icono: '✨', titulo: '', descripcion: '', orden: 0, activo: true });
  const [newEstadistica, setNewEstadistica] = useState({ icono: '📈', valor: '', descripcion: '', orden: 0, activo: true });
  const [newImagen, setNewImagen] = useState({ imagenUrl: '', titulo: '', descripcion: '', orden: 0, activo: true });
  const [editValor, setEditValor] = useState(null);
  const [editEstadistica, setEditEstadistica] = useState(null);
  const [editImagen, setEditImagen] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => setNotification({ show: false, message: '', type: '' }), 2500);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${api}/api/sobre-nosotros`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data);
      const info = response.data.informacionPrincipal;
      if (info) {
        setMainForm({
          id: info.id,
          titulo: info.titulo || '',
          subtitulo: info.subtitulo || '',
          descripcionPrincipal: info.descripcionPrincipal || '',
          mision: info.mision || '',
          vision: info.vision || '',
          videoUrl: info.videoUrl || '',
          imagenPrincipal: info.imagenPrincipal || '',
          activo: info.activo ?? true
        });
      } else {
        setMainForm(initialMain);
      }
    } catch (err) {
      console.error('Error cargando sobre nosotros', err);
      setError('No pudimos cargar la información. Puedes crearla desde cero.');
      setData({ valores: [], estadisticas: [], galeria: [] });
      setMainForm(initialMain);
    } finally {
      setLoading(false);
    }
  };

  const notify = (message, type = 'success') => setNotification({ show: true, message, type });

  const handleSaveMain = async (e) => {
    e.preventDefault();
    try {
      const body = { ...mainForm };
      const url = mainForm.id
        ? `${api}/api/sobre-nosotros/informacion/${mainForm.id}`
        : `${api}/api/sobre-nosotros/informacion`;
      const method = mainForm.id ? 'put' : 'post';
      await axios[method](url, body, { headers: { Authorization: `Bearer ${token}` } });
      notify(mainForm.id ? 'Información actualizada' : 'Información creada');
      fetchData();
    } catch (err) {
      console.error('Error guardando info principal', err);
      notify('No se pudo guardar la información', 'error');
    }
  };

  const handleCreateValor = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${api}/api/sobre-nosotros/valores`, newValor, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notify('Valor creado');
      setNewValor({ icono: '✨', titulo: '', descripcion: '', orden: 0, activo: true });
      fetchData();
    } catch (err) {
      console.error('Error creando valor', err);
      notify('No se pudo crear el valor', 'error');
    }
  };

  const handleUpdateValor = async (e) => {
    e.preventDefault();
    if (!editValor) return;
    try {
      await axios.put(`${api}/api/sobre-nosotros/valores/${editValor.id}`, editValor, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notify('Valor actualizado');
      setEditValor(null);
      fetchData();
    } catch (err) {
      console.error('Error actualizando valor', err);
      notify('No se pudo actualizar el valor', 'error');
    }
  };

  const handleDeleteValor = async (id) => {
    if (!window.confirm('¿Eliminar este valor?')) return;
    try {
      await axios.delete(`${api}/api/sobre-nosotros/valores/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notify('Valor eliminado');
      fetchData();
    } catch (err) {
      console.error('Error eliminando valor', err);
      notify('No se pudo eliminar el valor', 'error');
    }
  };

  const handleCreateEstadistica = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${api}/api/sobre-nosotros/estadisticas`, newEstadistica, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notify('Estadística creada');
      setNewEstadistica({ icono: '📈', valor: '', descripcion: '', orden: 0, activo: true });
      fetchData();
    } catch (err) {
      console.error('Error creando estadística', err);
      notify('No se pudo crear la estadística', 'error');
    }
  };

  const handleUpdateEstadistica = async (e) => {
    e.preventDefault();
    if (!editEstadistica) return;
    try {
      await axios.put(`${api}/api/sobre-nosotros/estadisticas/${editEstadistica.id}`, editEstadistica, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notify('Estadística actualizada');
      setEditEstadistica(null);
      fetchData();
    } catch (err) {
      console.error('Error actualizando estadística', err);
      notify('No se pudo actualizar la estadística', 'error');
    }
  };

  const handleDeleteEstadistica = async (id) => {
    if (!window.confirm('¿Eliminar esta estadística?')) return;
    try {
      await axios.delete(`${api}/api/sobre-nosotros/estadisticas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notify('Estadística eliminada');
      fetchData();
    } catch (err) {
      console.error('Error eliminando estadística', err);
      notify('No se pudo eliminar la estadística', 'error');
    }
  };

  const handleCreateImagen = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${api}/api/sobre-nosotros/galeria`, newImagen, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notify('Imagen creada');
      setNewImagen({ imagenUrl: '', titulo: '', descripcion: '', orden: 0, activo: true });
      fetchData();
    } catch (err) {
      console.error('Error creando imagen', err);
      notify('No se pudo crear la imagen', 'error');
    }
  };

  const handleUpdateImagen = async (e) => {
    e.preventDefault();
    if (!editImagen) return;
    try {
      await axios.put(`${api}/api/sobre-nosotros/galeria/${editImagen.id}`, editImagen, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notify('Imagen actualizada');
      setEditImagen(null);
      fetchData();
    } catch (err) {
      console.error('Error actualizando imagen', err);
      notify('No se pudo actualizar la imagen', 'error');
    }
  };

  const handleDeleteImagen = async (id) => {
    if (!window.confirm('¿Eliminar esta imagen?')) return;
    try {
      await axios.delete(`${api}/api/sobre-nosotros/galeria/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notify('Imagen eliminada');
      fetchData();
    } catch (err) {
      console.error('Error eliminando imagen', err);
      notify('No se pudo eliminar la imagen', 'error');
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4 md:px-8 lg:px-16 min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full gradient-hero"></div>
        </div>
        <div className="relative z-10 container-custom flex flex-col items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-[#E19D7E] mb-6"></div>
            <p className="text-xl text-[#C1583B] font-quicksand">Cargando sección Sobre Nosotros...</p>
          </div>
        </div>
        <style>{`.gradient-hero { background: linear-gradient(135deg, #DDD4CE 0%, #E19D7E 100%); }`}</style>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full gradient-hero"></div>
      </div>

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

      <div className="relative z-10 container-custom">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl text-[#904939] font-bold mb-4 relative pb-4 font-cinzel">
            Gestión Sobre Nosotros
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-[#E19D7E] to-[#904939] rounded-full"></span>
          </h1>
          <p className="text-lg text-[#C1583B] font-quicksand">
            Actualiza la historia, los valores, estadísticas y galería que ve el usuario.
          </p>
          {error && <p className="text-red-700 font-semibold mt-2">{error}</p>}
        </div>

        {/* Snapshot de estado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <QuickStat label="Valores" value={data?.valores?.length || 0} icon="✨" color="from-amber-400 to-amber-500" />
          <QuickStat label="Estadísticas" value={data?.estadisticas?.length || 0} icon="📈" color="from-sky-400 to-sky-500" />
          <QuickStat label="Imágenes" value={data?.galeria?.length || 0} icon="🖼️" color="from-emerald-400 to-emerald-500" />
          <QuickStat label="Versión activa" value={mainForm.activo ? 'Sí' : 'No'} icon="✅" color="from-rose-400 to-rose-500" />
        </div>

        {/* Información principal */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#904939] font-cinzel">Información Principal</h2>
              <p className="text-sm text-[#C1583B] font-quicksand">Título, subtítulo, misión, visión, video y hero.</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${mainForm.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {mainForm.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <form className="grid md:grid-cols-2 gap-6" onSubmit={handleSaveMain}>
            <div className="space-y-4">
              <Input label="Título" value={mainForm.titulo} onChange={(v) => setMainForm({ ...mainForm, titulo: v })} required />
              <Input label="Subtítulo" value={mainForm.subtitulo} onChange={(v) => setMainForm({ ...mainForm, subtitulo: v })} />
              <TextArea label="Descripción Principal" value={mainForm.descripcionPrincipal} onChange={(v) => setMainForm({ ...mainForm, descripcionPrincipal: v })} required />
              <TextArea label="Misión" value={mainForm.mision} onChange={(v) => setMainForm({ ...mainForm, mision: v })} />
              <TextArea label="Visión" value={mainForm.vision} onChange={(v) => setMainForm({ ...mainForm, vision: v })} />
            </div>
            <div className="space-y-4">
              <Input label="Imagen Principal (URL)" value={mainForm.imagenPrincipal} onChange={(v) => setMainForm({ ...mainForm, imagenPrincipal: v })} />
              {mainForm.imagenPrincipal && (
                <div className="rounded-xl overflow-hidden border border-[#DDD4CE] bg-[#f7f1ed]">
                  <img
                    src={mainForm.imagenPrincipal}
                    alt="Vista previa"
                    className="w-full h-48 object-cover"
                    onError={(e) => { e.target.src = '/img/default-about.jpg'; }}
                  />
                </div>
              )}
              <Input label="Video (URL embebido)" value={mainForm.videoUrl} onChange={(v) => setMainForm({ ...mainForm, videoUrl: v })} />
              <label className="flex items-center gap-2 text-[#904939] font-semibold">
                <input
                  type="checkbox"
                  checked={mainForm.activo}
                  onChange={(e) => setMainForm({ ...mainForm, activo: e.target.checked })}
                  className="w-4 h-4 text-[#C1583B]"
                />
                Mostrar como versión activa
              </label>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#8d6e63] to-[#C1583B] text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {mainForm.id ? 'Actualizar Información' : 'Crear Información'}
              </button>
            </div>
          </form>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Valores */}
          <SectionCard title="Valores" subtitle="Tarjetas que aparecen en la sección Nuestros Valores">
            <div className="space-y-4">
              <MiniForm onSubmit={handleCreateValor} fields={[
                { label: 'Icono', value: newValor.icono, onChange: (v) => setNewValor({ ...newValor, icono: v }) },
                { label: 'Título', value: newValor.titulo, onChange: (v) => setNewValor({ ...newValor, titulo: v }), required: true },
                { label: 'Descripción', value: newValor.descripcion, onChange: (v) => setNewValor({ ...newValor, descripcion: v }), required: true },
                { label: 'Orden', type: 'number', value: newValor.orden, onChange: (v) => setNewValor({ ...newValor, orden: Number(v) || 0 }) },
                { label: 'Activo', type: 'checkbox', value: newValor.activo, onChange: (v) => setNewValor({ ...newValor, activo: v }) }
              ]} buttonLabel="Agregar Valor" />

              {editValor && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#904939]">Editando valor: {editValor.titulo}</p>
                    <button onClick={() => setEditValor(null)} className="text-xs text-[#c62828] hover:underline">Cancelar</button>
                  </div>
                  <MiniForm onSubmit={handleUpdateValor} fields={[
                    { label: 'Icono', value: editValor.icono, onChange: (v) => setEditValor({ ...editValor, icono: v }) },
                    { label: 'Título', value: editValor.titulo, onChange: (v) => setEditValor({ ...editValor, titulo: v }), required: true },
                    { label: 'Descripción', value: editValor.descripcion, onChange: (v) => setEditValor({ ...editValor, descripcion: v }), required: true },
                    { label: 'Orden', type: 'number', value: editValor.orden, onChange: (v) => setEditValor({ ...editValor, orden: Number(v) || 0 }) },
                    { label: 'Activo', type: 'checkbox', value: editValor.activo, onChange: (v) => setEditValor({ ...editValor, activo: v }) }
                  ]} buttonLabel="Guardar cambios en Valor" />
                </div>
              )}

              <Listado items={data?.valores || []} columns={[
                { key: 'icono', label: 'Icono' },
                { key: 'titulo', label: 'Título' },
                { key: 'descripcion', label: 'Descripción' },
                { key: 'orden', label: 'Orden' },
                { key: 'activo', label: 'Estado' }
              ]} onDelete={handleDeleteValor} onEdit={(item) => setEditValor(item)} />
            </div>
          </SectionCard>

          {/* Estadísticas */}
          <SectionCard title="Estadísticas" subtitle="Números destacados que se muestran en la sección de KPIs">
            <div className="space-y-4">
              <MiniForm onSubmit={handleCreateEstadistica} fields={[
                { label: 'Icono', value: newEstadistica.icono, onChange: (v) => setNewEstadistica({ ...newEstadistica, icono: v }) },
                { label: 'Valor', value: newEstadistica.valor, onChange: (v) => setNewEstadistica({ ...newEstadistica, valor: v }), required: true },
                { label: 'Descripción', value: newEstadistica.descripcion, onChange: (v) => setNewEstadistica({ ...newEstadistica, descripcion: v }), required: true },
                { label: 'Orden', type: 'number', value: newEstadistica.orden, onChange: (v) => setNewEstadistica({ ...newEstadistica, orden: Number(v) || 0 }) },
                { label: 'Activo', type: 'checkbox', value: newEstadistica.activo, onChange: (v) => setNewEstadistica({ ...newEstadistica, activo: v }) }
              ]} buttonLabel="Agregar Estadística" />

              {editEstadistica && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#904939]">Editando estadística: {editEstadistica.descripcion}</p>
                    <button onClick={() => setEditEstadistica(null)} className="text-xs text-[#c62828] hover:underline">Cancelar</button>
                  </div>
                  <MiniForm onSubmit={handleUpdateEstadistica} fields={[
                    { label: 'Icono', value: editEstadistica.icono, onChange: (v) => setEditEstadistica({ ...editEstadistica, icono: v }) },
                    { label: 'Valor', value: editEstadistica.valor, onChange: (v) => setEditEstadistica({ ...editEstadistica, valor: v }), required: true },
                    { label: 'Descripción', value: editEstadistica.descripcion, onChange: (v) => setEditEstadistica({ ...editEstadistica, descripcion: v }), required: true },
                    { label: 'Orden', type: 'number', value: editEstadistica.orden, onChange: (v) => setEditEstadistica({ ...editEstadistica, orden: Number(v) || 0 }) },
                    { label: 'Activo', type: 'checkbox', value: editEstadistica.activo, onChange: (v) => setEditEstadistica({ ...editEstadistica, activo: v }) }
                  ]} buttonLabel="Guardar cambios en Estadística" />
                </div>
              )}

              <Listado items={data?.estadisticas || []} columns={[
                { key: 'icono', label: 'Icono' },
                { key: 'valor', label: 'Valor' },
                { key: 'descripcion', label: 'Descripción' },
                { key: 'orden', label: 'Orden' },
                { key: 'activo', label: 'Estado' }
              ]} onDelete={handleDeleteEstadistica} onEdit={(item) => setEditEstadistica(item)} />
            </div>
          </SectionCard>
        </div>

        {/* Galería */}
        <SectionCard title="Galería" subtitle="Imágenes que se muestran en el mosaico de la sección">
          <div className="space-y-4">
            <MiniForm onSubmit={handleCreateImagen} fields={[
              { label: 'Imagen URL', value: newImagen.imagenUrl, onChange: (v) => setNewImagen({ ...newImagen, imagenUrl: v }), required: true },
              { label: 'Título', value: newImagen.titulo, onChange: (v) => setNewImagen({ ...newImagen, titulo: v }) },
              { label: 'Descripción', value: newImagen.descripcion, onChange: (v) => setNewImagen({ ...newImagen, descripcion: v }) },
              { label: 'Orden', type: 'number', value: newImagen.orden, onChange: (v) => setNewImagen({ ...newImagen, orden: Number(v) || 0 }) },
              { label: 'Activo', type: 'checkbox', value: newImagen.activo, onChange: (v) => setNewImagen({ ...newImagen, activo: v }) }
            ]} buttonLabel="Agregar Imagen" />

            {editImagen && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#904939]">Editando imagen: {editImagen.titulo || editImagen.imagenUrl}</p>
                  <button onClick={() => setEditImagen(null)} className="text-xs text-[#c62828] hover:underline">Cancelar</button>
                </div>
                <MiniForm onSubmit={handleUpdateImagen} fields={[
                  { label: 'Imagen URL', value: editImagen.imagenUrl, onChange: (v) => setEditImagen({ ...editImagen, imagenUrl: v }), required: true },
                  { label: 'Título', value: editImagen.titulo, onChange: (v) => setEditImagen({ ...editImagen, titulo: v }) },
                  { label: 'Descripción', value: editImagen.descripcion, onChange: (v) => setEditImagen({ ...editImagen, descripcion: v }) },
                  { label: 'Orden', type: 'number', value: editImagen.orden, onChange: (v) => setEditImagen({ ...editImagen, orden: Number(v) || 0 }) },
                  { label: 'Activo', type: 'checkbox', value: editImagen.activo, onChange: (v) => setEditImagen({ ...editImagen, activo: v }) }
                ]} buttonLabel="Guardar cambios en Imagen" />
              </div>
            )}

            <Listado items={data?.galeria || []} columns={[
              { key: 'imagenUrl', label: 'Imagen' },
              { key: 'titulo', label: 'Título' },
              { key: 'descripcion', label: 'Descripción' },
              { key: 'orden', label: 'Orden' },
              { key: 'activo', label: 'Estado' }
            ]} onDelete={handleDeleteImagen} onEdit={(item) => setEditImagen(item)} />
          </div>
        </SectionCard>
      </div>

      <style>{`
        .gradient-hero {
          background: linear-gradient(135deg, #DDD4CE 0%, #E19D7E 100%);
        }
      `}</style>
    </section>
  );
};

const Input = ({ label, value, onChange, type = 'text', required }) => (
  <div className="space-y-2">
    <label className="block text-[#C1583B] font-semibold">{label}</label>
    <input
      type={type}
      value={value}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-lg border border-[#E19D7E] focus:outline-none focus:ring-2 focus:ring-[#904939] bg-white"
    />
  </div>
);

const TextArea = ({ label, value, onChange, required }) => (
  <div className="space-y-2">
    <label className="block text-[#C1583B] font-semibold">{label}</label>
    <textarea
      value={value}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      className="w-full px-4 py-3 rounded-lg border border-[#E19D7E] focus:outline-none focus:ring-2 focus:ring-[#904939] bg-white"
    />
  </div>
);

const SectionCard = ({ title, subtitle, children }) => (
  <div className="bg-white/85 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-[#f1e5de] relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E19D7E] via-[#904939] to-[#E19D7E]"></div>
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-xl font-bold text-[#904939] font-cinzel">{title}</h3>
        <p className="text-sm text-[#C1583B] font-quicksand">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

const MiniForm = ({ fields, buttonLabel, onSubmit }) => (
  <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4 bg-white/60 rounded-xl p-4 border border-[#DDD4CE]">
    {fields.map((field) => (
      <div key={field.label} className="space-y-2">
        {field.type === 'checkbox' ? (
          <label className="flex items-center gap-3 text-[#904939] font-semibold">
            <input
              type="checkbox"
              checked={Boolean(field.value)}
              onChange={(e) => field.onChange(e.target.checked)}
              className="w-4 h-4 text-[#C1583B] accent-[#C1583B]"
            />
            {field.label}
          </label>
        ) : (
          <>
            <label className="block text-[#C1583B] font-semibold">{field.label}</label>
            <input
              type={field.type === 'number' ? 'number' : 'text'}
              value={field.value}
              onChange={(e) => field.onChange(field.type === 'number' ? e.target.value : e.target.value)}
              required={field.required}
              className="w-full px-3 py-2 rounded-lg border border-[#E19D7E] focus:outline-none focus:ring-2 focus:ring-[#904939] bg-white"
            />
          </>
        )}
      </div>
    ))}
    <div className="md:col-span-2">
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#64b5f6] to-[#42a5f5] text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {buttonLabel}
      </button>
    </div>
  </form>
);

const QuickStat = ({ label, value, icon, color }) => (
  <div className={`bg-gradient-to-r ${color} text-white rounded-2xl shadow-lg p-4 flex items-center justify-between`}>
    <div>
      <p className="text-sm uppercase tracking-wide text-white/80 font-quicksand">{label}</p>
      <p className="text-2xl font-bold font-cinzel">{value}</p>
    </div>
    <span className="text-3xl">{icon}</span>
  </div>
);

const Listado = ({ items, columns, onDelete, onEdit }) => {
  const renderCell = (item, colKey) => {
    if (colKey === 'activo') {
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {item.activo ? 'Activo' : 'Inactivo'}
        </span>
      );
    }
    if (colKey === 'imagenUrl') {
      return (
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#DDD4CE] bg-[#f7f3ef]">
            <img
              src={item.imagenUrl}
              alt={item.titulo || 'Imagen'}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/img/default-gallery.jpg'; }}
            />
          </div>
          <div>
            <p className="font-semibold text-[#904939]">{item.titulo || 'Sin título'}</p>
            {item.descripcion && <p className="text-sm text-[#C1583B] truncate max-w-xs">{item.descripcion}</p>}
          </div>
        </div>
      );
    }
    if (colKey === 'descripcion') {
      return <span className="block max-w-xs truncate">{item.descripcion}</span>;
    }
    if (colKey === 'icono') {
      return <span className="text-2xl">{item.icono}</span>;
    }
    return item[colKey];
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-[#DDD4CE]">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-[#8d6e63] to-[#C1583B] text-white">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left font-cinzel">{col.label}</th>
            ))}
            <th className="px-4 py-3 text-left font-cinzel">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {(items || []).length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="px-4 py-4 text-center text-[#C1583B] font-quicksand">
                Sin registros aún
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="border-t border-[#DDD4CE] hover:bg-[#f7f1ed]">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-[#904939] font-quicksand align-top">
                    {renderCell(item, col.key)}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="text-[#1976d2] hover:text-[#1565c0] font-semibold"
                      >
                        Editar
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-[#c62828] hover:text-[#b71c1c] font-semibold"
                    >
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
  );
};

export default GestionSobreNosotros;
