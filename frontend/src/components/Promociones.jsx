import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import '../styles/Promociones.css';

const Promociones = () => {
  const [promociones, setPromociones] = useState([]);
  const { addItem } = useCart();

  // ✅ Mapeo de imágenes locales por ID de promoción
  const imagenesPorId = {
    1: "/img/promociones/fresa2x1.png",
    2: "/img/promociones/fresachoco.png",
    3: "/img/promociones/mentacremo.png",
    4: "/img/promociones/vainillachoco.png",
    5: "/img/promociones/bananamilk.png",
    6: "/img/promociones/cremofrape.png",
    7: "/img/promociones/frape2x1.png",
  };

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
    // ✅ Usar imagen local en lugar de la del backend
    const imagenLocal = imagenesPorId[promo.id] || "/img/promociones/default.png";

    addItem({
      id: `promo-${promo.id}`,
      name: promo.nombrePromo,
      price: Number(promo.precio) || 0,
      image: imagenLocal,  // ✅ Imagen local
      quantity: 1
    });
    
    alert(`${promo.nombrePromo} agregado al carrito`);
  };

  return (
    <section className="promociones">
      <h2>Promociones</h2>
      <div className="promociones-container">
        {promociones.length === 0 ? (
          <p>Cargando promociones...</p>
        ) : (
          promociones.map((promo) => {
            // ✅ Obtener imagen local
            const imagenLocal = imagenesPorId[promo.id] || "/img/promociones/default.png";

            return (
              <div className="promocion-card" key={promo.id}>
                <img
                  src={imagenLocal}  // ✅ Usar imagen local
                  alt={promo.nombrePromo}
                  className="promocion-imagen"
                  onError={(e) => {
                    console.error("❌ Error cargando imagen:", imagenLocal);
                    e.target.src = "/img/promociones/default.png";
                  }}
                />
                <h3>{promo.nombrePromo}</h3>
                <p>{promo.descripcion}</p>
                <div className="precio-info">
                  <p className="descuento-badge">{promo.descuento}% OFF</p>
                  <p className="precio-descuento">${Number(promo.precio).toFixed(2)}</p>
                </div>
                <button
                  className="add-to-cart"
                  onClick={() => handleAddPromo(promo)}
                >
                  Agregar al Carrito
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default Promociones;