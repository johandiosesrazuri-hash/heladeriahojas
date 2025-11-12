import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import '../styles/Menu.css';

const Menu = () => {
  const [productos, setProductos] = useState([]);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const response = await axios.get(`${api}/api/productos`);
        setProductos(response.data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    fetchProductos();
  }, []);

  const handleAddToCart = (producto) => {
    addItem({
      id: producto.id,
      name: producto.nombre,
      price: producto.precio,
      image: producto.imagen,
      quantity: 1
    });
  };

  return (
    <section className="menu-section">
      <div className="section-content">
        <h2 className="section-title">Nuestros Helados</h2>
        <div className="menu-list">
          {productos.map(producto => (
            <div key={producto.id} className="menu-item">
              <img src={producto.imagen} alt={producto.nombre} className="menu-image" />
              <h3 className="name">{producto.nombre}</h3>
              <p className="text">{producto.descripcion}</p>
              <p className="price">${producto.precio.toFixed(2)}</p>
              <button 
                className="add-to-cart"
                onClick={() => handleAddToCart(producto)}
              >
                Agregar al Carrito
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;