import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Pedido.css';

const Pedido = () => {
  const { items, total, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    direccion: '',
    telefono: '',
    ciudad: '',
    codigoPostal: '',
    instrucciones: '',
    nombreReceptor: user?.nombre || '',
    metodoPago: 'efectivo'
  });

  const [isProcessing, setIsProcessing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="pedido-section">
        <div className="empty-cart">
          <h2>No hay productos en tu carrito</h2>
          <p>Agrega productos antes de hacer un pedido</p>
          <button onClick={() => navigate('/menu')} className="confirm-button">
            Ir al Menú
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.direccion || !formData.telefono || !formData.ciudad) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsProcessing(true);

    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';

      // ✅ Mapear items para enviar al backend
      const pedidoData = {
        items: items.map(item => ({
          productoId: item.productoId || item.id, // usar productoId si existe, si no id
          cantidad: item.quantity,
          precioUnitario: Number(item.price)
        })),
        delivery: {
          direccion: formData.direccion,
          telefono: formData.telefono,
          ciudad: formData.ciudad,
          codigoPostal: formData.codigoPostal,
          instruccionesEspeciales: formData.instrucciones,
          nombreReceptor: formData.nombreReceptor
        },
        metodoPago: formData.metodoPago
      };

      console.log("ENVIANDO PEDIDO:", pedidoData);

      await axios.post(`${api}/api/pedidos`, pedidoData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      clearCart();
      alert('¡Pedido realizado con éxito!');
      navigate('/mis-pedidos');

    } catch (error) {
      console.error('Error al crear el pedido:', error.response?.data || error);
      alert('Error al procesar el pedido. Por favor intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pedido-section">
      <h2>Finalizar Pedido</h2>
      <div className="pedido-container">
        <div className="pedido-resumen">
          <h3>Resumen del Pedido</h3>
          {items.map(item => (
            <div key={item.id} className="pedido-item">
              <span>{item.name}</span>
              <span>x{item.quantity}</span>
              <span>${((Number(item.price) || 0) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="pedido-total">
            <strong>Total:</strong>
            <span>${(total || 0).toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="pedido-form">
          <div className="form-group">
            <label htmlFor="nombreReceptor">Nombre del Receptor *</label>
            <input
              type="text"
              id="nombreReceptor"
              name="nombreReceptor"
              value={formData.nombreReceptor}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="direccion">Dirección de Entrega *</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono de Contacto *</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ciudad">Ciudad *</label>
              <input
                type="text"
                id="ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="codigoPostal">Código Postal</label>
              <input
                type="text"
                id="codigoPostal"
                name="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="instrucciones">Instrucciones de Entrega</label>
            <textarea
              id="instrucciones"
              name="instrucciones"
              value={formData.instrucciones}
              onChange={handleChange}
              rows="3"
              placeholder="Ej: Tocar el timbre, dejar en portería, etc."
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="metodoPago">Método de Pago *</label>
            <select
              id="metodoPago"
              name="metodoPago"
              value={formData.metodoPago}
              onChange={handleChange}
              required
            >
              <option value="efectivo">💵 Efectivo (Pago contra entrega)</option>
              <option value="transferencia">🏦 Transferencia bancaria</option>
              <option value="tarjeta">💳 Tarjeta (Próximamente)</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="confirm-button"
            disabled={isProcessing || formData.metodoPago === 'tarjeta'}
          >
            {isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Pedido;
