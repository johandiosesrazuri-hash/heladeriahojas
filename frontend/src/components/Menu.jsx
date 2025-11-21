import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const Menu = () => {
  const [productos, setProductos] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [categorias, setCategorias] = useState(['Todos', 'Helados', 'Bebidas']);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
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
      id: `menu-${producto.id}`,
      productoId: producto.id,
      name: producto.nombre,
      price: Number(producto.precio) || 0,
      image: `http://localhost:8080${producto.imagen}` || '/img/default.png',
      quantity: 1
    });
    
    setNotification({
      show: true,
      message: `${producto.nombre} agregado al carrito`
    });
    
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  // Normaliza la categoría recibida desde la API o el formulario admin
  const normalizarCategoria = (categoria) => {
    if (!categoria) return null;
    const valor = categoria.toString().trim().toLowerCase();
    
    if (valor.startsWith('beb')) return 'Bebidas';
    if (valor.startsWith('hel')) return 'Helados';
    if (valor === 'cafe' || valor === 'café') return 'Bebidas';
    
    return null;
  };

  // Determinar el tipo de producto (helado o bebida)
  const getTipoProducto = (producto) => {
    // Usar el campo 'tipo' o 'categoria' si existen
    const tipoPorCampo = normalizarCategoria(producto.tipo) || normalizarCategoria(producto.categoria);
    if (tipoPorCampo) return tipoPorCampo;
    
    // Inferir el tipo por el nombre del producto como respaldo
    const nombre = (producto.nombre || '').toLowerCase();
    
    const palabrasBebidas = [
      'bebida', 'jugo', 'refresco', 'malteada', 'batido', 'smoothie', 
      'agua', 'soda', 'té', 'café', 'limonada', 'horchata', 'chicha'
    ];
    
    const esBebida = palabrasBebidas.some(palabra => nombre.includes(palabra));
    
    return esBebida ? 'Bebidas' : 'Helados';
  };

  // Filtrar productos por categoría
  const productosFiltrados = categoriaActiva === 'Todos' 
    ? productos 
    : productos.filter(producto => getTipoProducto(producto) === categoriaActiva);

  // Obtener color de la categoría
  const getColorCategoria = (categoria) => {
    switch(categoria) {
      case 'Helados': return 'bg-blue-100 text-blue-800';
      case 'Bebidas': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener icono de la categoría
  const getIconoCategoria = (categoria) => {
    switch(categoria) {
      case 'Helados': return '🍦';
      case 'Bebidas': return '🥤';
      default: return '📋';
    }
  };

  return (
    <section className="py-12 px-4 md:px-8 lg:px-16 min-h-screen bg-[#FFFBF7]">
      {/* Notificación temporal */}
      {notification.show && (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
          <div className="bg-[#217868] text-[#FFFBF7] px-6 py-3 rounded-full shadow-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#217868] mb-4 font-serif">
            Nuestro Menú
          </h1>
          <p className="text-lg text-[#217868] max-w-2xl mx-auto font-sans">
            Descubre nuestra deliciosa variedad de helados artesanales y refrescantes bebidas
          </p>
        </div>

        {/* Filtros de Categoría */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white rounded-full p-1 shadow-md border border-[#217868]">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setCategoriaActiva(categoria)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center font-sans ${
                  categoriaActiva === categoria
                    ? 'bg-[#217868] text-[#FFFBF7] shadow-sm'
                    : 'text-[#217868] hover:bg-[#e8f5f2]'
                }`}
              >
                <span className="mr-2">{getIconoCategoria(categoria)}</span>
                {categoria}
              </button>
            ))}
          </div>
        </div>

        {/* Contenedor de Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {productosFiltrados.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#217868] border-t-transparent"></div>
              <p className="mt-4 text-[#217868] text-lg font-sans">
                Cargando productos...
              </p>
            </div>
          ) : (
            productosFiltrados.map((producto, index) => {
              const tipo = getTipoProducto(producto);
              return (
                <div
                  key={producto.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group border border-[#e8f5f2]"
                >
                  {/* Imagen del Producto con efecto zoom */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={`http://localhost:8080${producto.imagen}`}
                      alt={producto.nombre}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = '/img/default.png';
                      }}
                    />
                    
                    {/* Badge de Tipo */}
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold flex items-center ${getColorCategoria(tipo)}`}>
                      <span className="mr-1">{getIconoCategoria(tipo)}</span>
                      {tipo}
                    </div>
                  </div>

                  {/* Contenido de la Tarjeta */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#217868] mb-2 font-serif">
                      {producto.nombre}
                    </h3>
                    
                    <p className="text-[#217868] text-sm mb-4 line-clamp-2 font-sans">
                      {producto.descripcion}
                    </p>

                    {/* Precio y Botón */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-[#217868] font-serif">
                        S/ {Number(producto.precio).toFixed(2)}
                      </span>
                      
                      <button
                        onClick={() => handleAddToCart(producto)}
                        className="px-4 py-2 bg-[#217868] hover:bg-[#1a6654] text-[#FFFBF7] rounded-full font-medium transition-colors duration-300 flex items-center font-sans"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Mensaje cuando no hay productos en una categoría */}
        {productosFiltrados.length === 0 && productos.length > 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">
              {categoriaActiva === 'Helados' ? '🍦' : '🥤'}
            </div>
            <h3 className="text-2xl font-bold text-[#217868] mb-2 font-serif">
              No hay {categoriaActiva.toLowerCase()} disponibles
            </h3>
            <p className="text-[#217868] font-sans">
              Prueba seleccionando otra categoría
            </p>
          </div>
        )}
      </div>

      {/* Estilos */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default Menu;