import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import ProductSkeleton from './skeletons/ProductSkeleton';
import ProductModal from './ProductModal';
import useScrollAnimation from '../hooks/useScrollAnimation';

// Componente de Card con animación
const ProductCard = ({ producto, index, onAddToCart, onViewDetail, getTipoProducto, getColorCategoria, getIconoCategoria }) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: false });
  const tipo = getTipoProducto(producto);

  return (
    <div
      ref={ref}
      className={`bg-white rounded-3xl shadow-card overflow-hidden transition-all duration-700 ease-out transform hover:shadow-hover hover:-translate-y-2 group border border-neutral-100 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${(index % 3) * 100}ms` }}
    >
      {/* Imagen del Producto con efecto zoom */}
      <div 
        className="relative h-64 overflow-hidden bg-neutral-50 cursor-pointer"
        onClick={onViewDetail}
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
            onClick={() => onAddToCart(producto)}
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
};

const Menu = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState(['Todos', 'Helados', 'Bebidas']);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ordenPrecio, setOrdenPrecio] = useState('');
  const [rangoPrecios, setRangoPrecios] = useState({ min: 0, max: 100 });
  const [showFilters, setShowFilters] = useState(false);
  const { addItem } = useCart();
  const toast = useToast();

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

    toast.cart(`${producto.nombre} agregado al carrito`, '¡Añadido! 🛒');
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

  // Filtrar productos por categoría, búsqueda y precio
  const productosFiltrados = productos
    .filter(producto => {
      const matchCategoria = categoriaActiva === 'Todos' || getTipoProducto(producto) === categoriaActiva;
      const matchBusqueda = searchTerm === '' || 
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (producto.descripcion && producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
      const precio = Number(producto.precio) || 0;
      const matchPrecio = precio >= rangoPrecios.min && precio <= rangoPrecios.max;
      return matchCategoria && matchBusqueda && matchPrecio;
    })
    .sort((a, b) => {
      if (ordenPrecio === 'asc') return (Number(a.precio) || 0) - (Number(b.precio) || 0);
      if (ordenPrecio === 'desc') return (Number(b.precio) || 0) - (Number(a.precio) || 0);
      return 0;
    });

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setSearchTerm('');
    setCategoriaActiva('Todos');
    setOrdenPrecio('');
    setRangoPrecios({ min: 0, max: 100 });
  };

  // Verificar si hay filtros activos
  const hayFiltrosActivos = searchTerm || categoriaActiva !== 'Todos' || ordenPrecio || rangoPrecios.min > 0 || rangoPrecios.max < 100;

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

        {/* Barra de búsqueda y filtros */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          {/* Búsqueda principal */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar helados, bebidas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pl-14 bg-white border-2 border-neutral-200 rounded-2xl focus:outline-none focus:border-primary transition-all duration-300 font-body shadow-soft"
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
            
            {/* Botón de filtros avanzados */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-5 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 ${
                showFilters || hayFiltrosActivos
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white border-2 border-neutral-200 text-neutral-600 hover:border-primary hover:text-primary'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="hidden sm:inline">Filtros</span>
              {hayFiltrosActivos && (
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </button>
          </div>

          {/* Panel de filtros expandible */}
          <div className={`overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-neutral-800 font-title">Filtros avanzados</h3>
                {hayFiltrosActivos && (
                  <button
                    onClick={limpiarFiltros}
                    className="text-sm text-primary hover:text-primary-dark font-medium transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Limpiar filtros
                  </button>
                )}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Ordenar por precio */}
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2 font-body">Ordenar por precio</label>
                  <select
                    value={ordenPrecio}
                    onChange={(e) => setOrdenPrecio(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors font-body"
                  >
                    <option value="">Sin ordenar</option>
                    <option value="asc">Menor a mayor</option>
                    <option value="desc">Mayor a menor</option>
                  </select>
                </div>

                {/* Precio mínimo */}
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2 font-body">Precio mínimo</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">S/</span>
                    <input
                      type="number"
                      min="0"
                      value={rangoPrecios.min}
                      onChange={(e) => setRangoPrecios({ ...rangoPrecios, min: Number(e.target.value) || 0 })}
                      className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors font-body"
                    />
                  </div>
                </div>

                {/* Precio máximo */}
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2 font-body">Precio máximo</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">S/</span>
                    <input
                      type="number"
                      min="0"
                      value={rangoPrecios.max}
                      onChange={(e) => setRangoPrecios({ ...rangoPrecios, max: Number(e.target.value) || 100 })}
                      className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors font-body"
                    />
                  </div>
                </div>
              </div>
            </div>
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

        {/* Contador de resultados */}
        {!loading && (
          <div className="text-center mb-6">
            <p className="text-neutral-500 font-body">
              {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto encontrado' : 'productos encontrados'}
              {hayFiltrosActivos && ' con los filtros aplicados'}
            </p>
          </div>
        )}

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
            productosFiltrados.map((producto, index) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                index={index}
                onAddToCart={handleAddToCart}
                onViewDetail={() => {
                  setSelectedProduct(producto);
                  setIsModalOpen(true);
                }}
                getTipoProducto={getTipoProducto}
                getColorCategoria={getColorCategoria}
                getIconoCategoria={getIconoCategoria}
              />
            ))
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
