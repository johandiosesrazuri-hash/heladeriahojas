import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-200 pt-16 pb-8 px-4 md:px-8 lg:px-16">
      <div className="container-custom mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Columna 1: Logo y Descripción */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3 shadow-lg shadow-primary/20">
                <img alt="LOGO" className="h-6 w-6" src="/img/ice-cream.png" />
              </div>
              <span className="text-2xl font-bold font-title text-white">ChoccoDelight</span>
            </div>
            <p className="text-neutral-400 mb-6 font-body leading-relaxed">
              Creando momentos dulces y experiencias inolvidables con cada helado artesanal.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z', color: '#1877F2' },
                { icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z', color: '#E4405F' },
                { icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.5-5.71-.04-1.16.14-2.32.57-3.4.41-1.04 1.15-1.93 2.09-2.53 1.11-.69 2.44-1.03 3.75-1.01.05 1.46-.05 2.92-.03 4.38-.87-.13-1.83-.2-2.65.2-.8.39-1.28 1.24-1.31 2.12-.02.86.35 1.74.96 2.33.66.63 1.58.97 2.49.92 1.34-.06 2.64-.68 3.42-1.79.8-1.14.88-2.59.84-3.94-.01-2.92-.01-5.84 0-8.75z' }
              ].map((social, index) => (
                <a
                  key={index}
                  href="https://www.instagram.com/universidadutp?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary transition-all duration-300 hover:-translate-y-1"
                  aria-label={`Red social ${index + 1}`}
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="text-xl font-bold mb-6 font-title text-white">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              {[
                { name: 'Inicio', path: '/' },
                { name: 'Menú', path: '/menu' },
                { name: 'Promociones', path: '/promociones' },
                { name: 'Sobre Nosotros', path: '/sobre-nosotros' },
                { name: 'Testimonios', path: '/testimonios' }
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.path}
                    className="text-neutral-400 hover:text-primary transition-colors duration-300 font-body flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 transition-all duration-300 overflow-hidden mr-0 group-hover:mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h3 className="text-xl font-bold mb-6 font-title text-white">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-neutral-800 p-2 rounded-full mr-3 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-neutral-400 font-body">Anexo Andrés Avelino Cáceres 1, Piura 20001</span>
              </li>
              <li className="flex items-center">
                <div className="bg-neutral-800 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-neutral-400 font-body">+51 978 704 402</span>
              </li>
              <li className="flex items-center">
                <div className="bg-neutral-800 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-neutral-400 font-body">johandiosesrazuri@hgmail.com</span>
              </li>
              <li className="flex items-center">
                <div className="bg-neutral-800 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-neutral-400 font-body text-sm">
                  Lunes a Viernes: 9:00 AM - 8:00 PM<br />
                  Sábados y Domingos: 10:00 AM - 10:00 PM
                </span>
              </li>
            </ul>
          </div>

          {/* Columna 4: Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6 font-title text-white">Boletín</h3>
            <p className="text-neutral-400 mb-4 font-body">
              Suscríbete para recibir nuestras promociones y novedades.
            </p>
            <form className="mb-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="px-4 py-2 w-full rounded-l-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:border-primary font-body placeholder-neutral-500"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-r-lg font-semibold transition-colors duration-300 font-title"
                >
                  Enviar
                </button>
              </div>
            </form>
            <p className="text-xs text-neutral-500 font-body">
              Al suscribirte, aceptas nuestra política de privacidad.
            </p>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-neutral-800 my-8"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-500 text-sm mb-4 md:mb-0 font-body">
            © 2025 Heladería ChoccoDelight. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-neutral-500 hover:text-primary text-sm transition-colors duration-300 font-body">
              Política de Privacidad
            </a>
            <a href="#" className="text-neutral-500 hover:text-primary text-sm transition-colors duration-300 font-body">
              Términos y Condiciones
            </a>
            <a href="#" className="text-neutral-500 hover:text-primary text-sm transition-colors duration-300 font-body">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
