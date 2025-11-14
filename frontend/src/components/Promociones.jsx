import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import '../styles/Promociones.css';

const Promociones = () => {
  const [promociones, setPromociones] = useState([]);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const response = await axios.get(`${api}/api/promociones`);
        setPromociones(response.data);
      } catch (error) {
        console.error("Error al cargar promociones:", error);
      }
    };

    fetchPromos();
  }, []);

  const handleAddPromo = (promo) => {
    const basePrice = promo.producto?.precio || 0;
    const descuento = promo.descuento || 0;
    const precioFinal = basePrice * (1 - descuento / 100);

    addItem({
      id: `promo-${promo.id}`,          // id único para la promoción
      productoId: promo.producto?.id,   // id del producto real, si lo necesitas en backend
      name: promo.nombre,               // ⚡ aquí usamos el nombre de la promoción
      price: precioFinal,
      image: `http://localhost:8080${promo.producto?.imagen}` || "/img/promociones/default.png",
      quantity: 1
    });
  };

  return (
    <section className="promociones">
      <h2>Promociones</h2>
      <div className="promociones-container">
        {promociones.map((promo) => (
          <div className="promocion-card" key={promo.id}>
            <img
              src={`http://localhost:8080${promo.producto?.imagen}` || "/img/promociones/default.png"}
              alt={promo.nombre}
              className="promocion-imagen"
            />
            <h3>{promo.nombre}</h3> {/* ⚡ nombre de la promoción */}
            <p>{promo.descripcion}</p>
            <p className="precio">
              Precio: ${(promo.producto?.precio * (1 - promo.descuento / 100) || 0).toFixed(2)} | 
              Descuento: {promo.descuento}%
            </p>
            <button
              className="add-to-cart"
              onClick={() => handleAddPromo(promo)}
            >
              Agregar al Carrito
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Promociones;
