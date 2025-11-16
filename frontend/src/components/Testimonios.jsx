import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/Testimonios.css';

const Testimonios = () => {
  const { user, token } = useAuth();
  const [testimonios, setTestimonios] = useState([]);
  const [miTestimonio, setMiTestimonio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    calificacion: 5,
    comentario: ''
  });

  // 🔥 Cargar todos los testimonios al montar el componente
  useEffect(() => {
    fetchTestimonios();
  }, []);  // Solo se ejecuta al montar el componente

  const fetchTestimonios = async () => {
    try {
      setLoading(true);
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      
      // ✅ Obtener todos los testimonios (público)
      const response = await axios.get(`${api}/api/testimonios`);
      setTestimonios(response.data);
      
      // ✅ Si está logueado, buscar su testimonio
      if (user && token) {
        try {
          const miTestimonioResponse = await axios.get(
            `${api}/api/testimonios/usuario/${user.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMiTestimonio(miTestimonioResponse.data);
        } catch (err) {
          // Si hay un error 403, ignorarlo y no interrumpir la carga de testimonios
          if (err.response?.status === 403) {
            console.warn('No tienes permiso para acceder a este testimonio');
            setMiTestimonio(null);  // No mostrar el testimonio si no está permitido
          } else {
            console.error('Error al obtener el testimonio del usuario:', err);
          }
        }
      }
      
      setError(null);  // Limpiar cualquier error anterior
    } catch (err) {
      console.error('Error al cargar testimonios:', err);
      if (err.response?.status === 404) {
        setTestimonios([]);  // Si no hay testimonios, mostrar lista vacía
      } else {
        setError('Error al cargar testimonios');
      }
    } finally {
      setLoading(false);  // Cambiar el estado de loading a false después de obtener los datos
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Debes iniciar sesión para dejar un testimonio');
      return;
    }

    if (!formData.comentario.trim()) {
      alert('Por favor escribe un comentario');
      return;
    }

    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      
      await axios.post(
        `${api}/api/testimonios`,
        {
          usuarioId: user.id,
          calificacion: Number(formData.calificacion),
          comentario: formData.comentario
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('¡Testimonio enviado con éxito!');
      setFormData({ calificacion: 5, comentario: '' });
      setShowForm(false);
      fetchTestimonios();  // Recargar los testimonios después de enviar uno nuevo
    } catch (err) {
      console.error('Error al enviar testimonio:', err);
      alert('Error al enviar el testimonio. Intenta de nuevo.');
    }
  };

  if (loading) {
    return (
      <div className="testimonios-section">
        <p>Cargando testimonios...</p>
      </div>
    );
  }

  return (
    <div className="testimonios-section">
      <h2 className="section-title">Lo que dicen nuestros clientes</h2>

      {/* 🔹 Sección de pestañas */}
      <div className="testimonios-tabs">
        <button className="tab active">Todos los Testimonios</button>
        <button className="tab">
          Mis Testimonios ({miTestimonio ? 1 : 0})
        </button>
      </div>

      {/* 🔹 Lista de testimonios o mensaje vacío */}
      {testimonios.length === 0 ? (
        <div className="empty-testimonios">
          <p>Aún no hay testimonios. ¡Sé el primero!</p>
        </div>
      ) : (
        <div className="testimonios-grid">
          {testimonios.map(test => (
            <div key={test.id} className="testimonio-card">
              <div className="testimonio-header">
                <div className="usuario-info">
                  <span className="usuario-avatar">
                    {test.usuario?.nombre?.charAt(0).toUpperCase() || '?'}
                  </span>
                  <span className="usuario-nombre">
                    {test.usuario?.nombre || 'Usuario Anónimo'}
                  </span>
                </div>
                <div className="calificacion">
                  {'⭐'.repeat(test.calificacion)}
                </div>
              </div>
              <p className="testimonio-texto">{test.comentario}</p>
              <span className="testimonio-fecha">
                {new Date(test.fecha).toLocaleDateString('es-ES')}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Botón para agregar testimonio */}
      {user && !showForm && (
        <button 
          className="btn-agregar-testimonio"
          onClick={() => setShowForm(true)}
        >
          ✍️ ¡Déjanos tu opinión!
        </button>
      )}

      {/* 🔹 Formulario para nuevo testimonio */}
      {showForm && (
        <div className="testimonio-form-overlay">
          <div className="testimonio-form">
            <h3>Deja tu testimonio</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="calificacion">Calificación:</label>
                <div className="rating-selector">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      className={`star ${formData.calificacion >= num ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, calificacion: num }))}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="comentario">Tu opinión:</label>
                <textarea
                  id="comentario"
                  name="comentario"
                  value={formData.comentario}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Cuéntanos tu experiencia con ChoccoDelight..."
                  required
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn-submit">
                  Enviar
                </button>
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ calificacion: 5, comentario: '' });
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Testimonios;
