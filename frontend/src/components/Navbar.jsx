import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/" className="logo-text">ChoccoDelight</Link>
      </div>
      
      <ul className="nav-menu">
        <li><Link to="/" className="nav-link">Inicio</Link></li>
        <li><Link to="/menu" className="nav-link">Menú</Link></li>
        <li><Link to="/promociones" className="nav-link">Promociones</Link></li>
        <li><Link to="/contacto" className="nav-link">Contacto</Link></li>
      </ul>

      <div className="nav-actions">
        <Link to="/carrito" className="cart-link">
          <span className="cart-icon">🛒</span>
          {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
        </Link>
        
        {user ? (
          <>
            <Link to="/pedidos" className="nav-link">Mis Pedidos</Link>
            <button onClick={logout} className="auth-button">Cerrar Sesión</button>
          </>
        ) : (
          <>
            <Link to="/login" className="auth-button">Iniciar Sesión</Link>
            <Link to="/register" className="auth-button">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;