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
    nombreReceptor: user?.nombre || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const pedidoData = {
        items: items.map(item => ({ productoId: item.id, cantidad: item.quantity, precioUnitario: item.price })),
        delivery: { ...formData }
      };

      await axios.post(`${api}/api/pedidos`, pedidoData, { headers: { Authorization: `Bearer ${token}` } });

      clearCart();
      navigate('/pedidos');
    } catch (error) {
      console.error('Error al crear el pedido:', error);
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
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="pedido-total">
            <strong>Total:</strong>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="pedido-form">
          <div className="form-group">
            <label htmlFor="nombreReceptor">Nombre del Receptor</label>
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
            <label htmlFor="direccion">Dirección de Entrega</label>
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
            <label htmlFor="telefono">Teléfono de Contacto</label>
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
              <label htmlFor="ciudad">Ciudad</label>
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
            ></textarea>
          </div>

          <button type="submit" className="confirm-button">
            Confirmar Pedido
          </button>
        </form>
      </div>
    </div>
  );
};

export default Pedido;