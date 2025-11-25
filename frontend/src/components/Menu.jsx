import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import ProductSkeleton from './skeletons/ProductSkeleton';
import useScrollAnimation from '../hooks/useScrollAnimation';
import ProductModal from './ProductModal';

const Menu = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [categorias, setCategorias] = useState(['Todos', 'Helados', 'Bebidas']);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const api = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const response = await axios.get(`${api}/api/productos`);
        setProductos(response.data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
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

  // Filtrar productos por categoría y búsqueda
  const productosFiltrados = productos
    .filter(producto => {
      const matchCategoria = categoriaActiva === 'Todos' || getTipoProducto(producto) === categoriaActiva;
      const matchBusqueda = searchTerm === '' || 
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (producto.descripcion && producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCategoria && matchBusqueda;
    });

  // Obtener color de la categoría
  const getColorCategoria = (categoria) => {
    switch (categoria) {
      case 'Helados': return 'bg-primary/20 text-primary-dark';
      case 'Bebidas': return 'bg-secondary/20 text-secondary-dark';
      default: return 'bg-neutral-100 text-neutral-600';
    }
  };

  // Obtener icono de la categoría
  const getIconoCategoria = (categoria) => {
    switch (categoria) {
      case 'Helados': return '🍦';
      case 'Bebidas': return '🥤';
      default: return '📋';
    }
  };

  return (
    <section className="py-12 px-4 md:px-8 lg:px-16 min-h-screen bg-neutral-50">
      {/* Notificación temporal */}
      {notification.show && (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
          <div className="bg-primary text-white px-6 py-3 rounded-full shadow-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium font-body">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="section-title">
            Nuestro Menú
          </h1>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto font-body">
            Descubre nuestra deliciosa variedad de helados artesanales y refrescantes bebidas
          </p>
        </div>

        {/* Barra de búsqueda */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-14 bg-white border-2 border-neutral-200 rounded-full focus:outline-none focus:border-primary transition-all duration-300 font-body shadow-soft"
            />
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filtros de Categoría */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white rounded-full p-1.5 shadow-soft border border-neutral-100">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setCategoriaActiva(categoria)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center font-body ${categoriaActiva === categoria
                    ? 'bg-primary text-white shadow-md transform scale-105'
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-primary'
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
          {loading ? (
            <>
              {[...Array(6)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </>
          ) : productosFiltrados.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-neutral-500 text-lg font-body">
                No hay productos disponibles
              </p>
            </div>
          ) : (
            productosFiltrados.map((producto, index) => {
              const tipo = getTipoProducto(producto);
              return (
                <div
                  key={producto.id}
                  className="bg-white rounded-3xl shadow-card overflow-hidden transition-all duration-500 hover:shadow-hover hover:-translate-y-2 group border border-neutral-100"
                >
                  {/* Imagen del Producto con efecto zoom */}
                  <div 
                    className="relative h-64 overflow-hidden bg-neutral-50 cursor-pointer"
                    onClick={() => {
                      setSelectedProduct(producto);
                      setIsModalOpen(true);
                    }}
                  >
                    <img
                      src={`http://localhost:8080${producto.imagen}`}
                      alt={producto.nombre}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = '/img/default.png';
                      }}
                    />

                    {/* Badge de Tipo */}
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold flex items-center backdrop-blur-sm ${getColorCategoria(tipo)}`}>
                      <span className="mr-1">{getIconoCategoria(tipo)}</span>
                      {tipo}
                    </div>

                    {/* Overlay de "Ver detalle" */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-bold text-lg font-title">Ver Detalle</span>
                    </div>
                  </div>

                  {/* Contenido de la Tarjeta */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-neutral-800 mb-2 font-title group-hover:text-primary transition-colors">
                      {producto.nombre}
                    </h3>

                    <p className="text-neutral-500 text-sm mb-4 line-clamp-2 font-body leading-relaxed">
                      {producto.descripcion}
                    </p>

                    {/* Precio y Botón */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-50">
                      <span className="text-2xl font-bold text-primary font-title">
                        S/ {Number(producto.precio).toFixed(2)}
                      </span>

                      <button
                        onClick={() => handleAddToCart(producto)}
                        className="px-5 py-2.5 bg-neutral-900 text-white rounded-full font-bold text-sm transition-all duration-300 flex items-center font-title hover:bg-primary hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
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
          <div className="col-span-full text-center py-16">
            <div className="text-6xl mb-6 animate-bounce-slow">
              {searchTerm ? '🔍' : categoriaActiva === 'Helados' ? '🍦' : '🥤'}
            </div>
            <h3 className="text-2xl font-bold text-neutral-800 mb-2 font-title">
              {searchTerm ? `No se encontraron resultados para "${searchTerm}"` : `No hay ${categoriaActiva.toLowerCase()} disponibles`}
            </h3>
            <p className="text-neutral-500 font-body">
              {searchTerm ? 'Intenta con otro término de búsqueda' : 'Prueba seleccionando otra categoría'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de producto */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
      />

      {/* Estilos */}
      <style jsx global>{`
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
