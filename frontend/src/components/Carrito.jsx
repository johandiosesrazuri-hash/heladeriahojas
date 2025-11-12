import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Carrito.css';

const Carrito = () => {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/pedido');
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-section empty">
        <h2>Tu carrito está vacío</h2>
        <p>Agrega algunos productos deliciosos para comenzar</p>
      </div>
    );
  }

  return (
    <div className="cart-section">
      <h2 className="section-title">Tu Carrito</h2>
      <div className="cart-items">
        {items.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="item-image" />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="price">${item.price.toFixed(2)}</p>
              <div className="quantity-controls">
                <button 
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <button 
                className="remove-item"
                onClick={() => removeItem(item.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Resumen del pedido</h3>
        <p className="total">Total: ${total.toFixed(2)}</p>
        <button className="checkout-button" onClick={handleCheckout}>
          Proceder al pago
        </button>
        <button className="clear-cart" onClick={clearCart}>
          Vaciar carrito
        </button>
      </div>
    </div>
  );
};

export default Carrito;