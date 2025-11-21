import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Calcular total de items en el carrito
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // Actualizar el contador del carrito con animación
  useEffect(() => {
    if (totalItems !== cartCount) {
      setCartCount(totalItems);
    }
  }, [totalItems, cartCount]);

  // Efecto para cambiar el estilo del navbar al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavClick = (sectionId) => {
    if (location.pathname === '/') {
      scrollToSection(sectionId);
    } else {
      navigate(`/#${sectionId}`);
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}>
        <div className="container-custom px-4 md:px-8 lg:px-16">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <div className="w-10 h-10 bg-[#E19D7E] rounded-full flex items-center justify-center mr-3">
                      <img alt="LOGO" className="h-6 w-6" src="/img/ice-cream.png" />
                </div>
                <span className="text-2xl font-bold text-[#904939] font-cinzel">ChoccoDelight</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <ul className="flex space-x-6">
                {[
                  { name: 'Inicio', section: 'sobre-nosotros' },
                  { name: 'Sobre Nosotros', section: 'sobre-nosotros' },
                  { name: 'Menú', section: 'menu' },
                  { name: 'Promociones', section: 'promociones' },
                  { name: 'Contacto', section: 'contacto' },
                  { name: 'Testimonios', section: 'testimonios' },
                ].map((item) => (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.section)}
                      className="text-[#C1583B] hover:text-[#904939] font-medium font-quicksand transition-colors duration-200 relative group"
                    >
                      {item.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E19D7E] transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Cart */}
              <Link 
                to="/carrito" 
                className="relative p-2 text-[#C1583B] hover:text-[#904939] transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#E19D7E] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User Actions */}
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/mis-pedidos" 
                    className="text-[#C1583B] hover:text-[#904939] font-medium font-quicksand transition-colors duration-200"
                  >
                    Mis Pedidos
                  </Link>
                  <div className="relative group">
                    <button className="flex items-center space-x-1 text-[#C1583B] hover:text-[#904939] font-medium font-quicksand transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{user.nombre}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-[#C1583B] hover:bg-[#DDD4CE] font-quicksand"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login" 
                    className="px-4 py-2 text-[#C1583B] hover:text-[#904939] font-medium font-quicksand transition-colors duration-200"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-4 py-2 bg-[#E19D7E] hover:bg-[#3aa38f] text-[#904939] rounded-full font-semibold transition-all duration-300 hover:shadow-md font-montserrat"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-[#C1583B] hover:text-[#904939] focus:outline-none"
              >
                {isMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-md shadow-lg">
              <div className="px-4 pt-2 pb-3 space-y-1">
                {[
                  { name: 'Inicio', section: 'inicio' },
                  { name: 'Sobre Nosotros', section: 'sobre-nosotros' },
                  { name: 'Menú', section: 'menu' },
                  { name: 'Promociones', section: 'promociones' },
                  { name: 'Contacto', section: 'contacto' },
                  { name: 'Testimonios', section: 'testimonios' }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.name}
                    onClick={() => handleNavClick(item.section)}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[#C1583B] hover:text-[#904939] hover:bg-[#DDD4CE] font-quicksand"
                  >
                    {item.name}
                  </button>
                ))}
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-between px-3 py-2">
                  <Link 
                    to="/carrito" 
                    className="flex items-center text-[#C1583B] hover:text-[#904939] font-medium font-quicksand"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Carrito
                    {totalItems > 0 && (
                      <span className="ml-1 bg-[#E19D7E] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </div>
                
                {user ? (
                  <>
                    <Link
                      to="/pedidos"
                      className="block px-3 py-2 rounded-md text-base font-medium text-[#C1583B] hover:text-[#904939] hover:bg-[#DDD4CE] font-quicksand"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mis Pedidos
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[#C1583B] hover:text-[#904939] hover:bg-[#DDD4CE] font-quicksand"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-3 py-2 rounded-md text-base font-medium text-[#C1583B] hover:text-[#904939] hover:bg-[#DDD4CE] font-quicksand"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/register"
                      className="block px-3 py-2 mt-2 bg-[#E19D7E] hover:bg-[#3aa38f] text-[#904939] rounded-md text-base font-semibold text-center font-montserrat"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Espacio para el navbar fijo */}
      <div className="h-16 md:h-20"></div>

    </>
  );
};

export default Navbar;




