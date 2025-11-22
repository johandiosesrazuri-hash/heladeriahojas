import React, { useState, useEffect } from "react";
import axios from "axios";

const Contacto = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mensajeEstado, setMensajeEstado] = useState({ show: false, message: "", type: "" });
  const [animate, setAnimate] = useState(false);

  // Activar animación después de que el componente se monte
  useEffect(() => {
    setTimeout(() => setAnimate(true), 5);
  }, []);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/contacto", {
        nombre: nombre,
        email: email,
        asunto: asunto,
        mensaje: mensaje,
      });

      // Actualizar el mensaje de éxito
      setMensajeEstado({
        show: true,
        message: "Mensaje enviado con éxito!",
        type: "success"
      });

      // Reiniciar los campos del formulario
      setNombre("");
      setEmail("");
      setAsunto("");
      setMensaje("");

      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        setMensajeEstado({ show: false, message: "", type: "" });
      }, 5000);
    } catch (error) {
      // Actualizar el mensaje de error en caso de fallo
      setMensajeEstado({
        show: true,
        message: "Hubo un error al enviar el mensaje. Intenta nuevamente.",
        type: "error"
      });
      console.error("Error al enviar el mensaje", error);
    }
  };

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 min-h-screen relative overflow-hidden bg-neutral-50">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full gradient-hero"></div>
      </div>

      {/* Notificación temporal */}
      {mensajeEstado.show && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className={`px-6 py-4 rounded-xl shadow-lg flex items-center ${mensajeEstado.type === 'success' ? 'bg-secondary-light text-secondary-dark' : 'bg-red-100 text-red-800'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mr-3 ${mensajeEstado.type === 'success' ? 'text-secondary-dark' : 'text-red-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mensajeEstado.type === 'success' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              )}
            </svg>
            <span className="font-medium font-body">{mensajeEstado.message}</span>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="relative z-10 container-custom">
        <div className="text-center mb-16">
          <h2
            className="section-title"
            style={{
              animation: animate ? `fadeInUp 0.6s ease-out 0.1s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            Contáctanos
          </h2>

          <p
            className="text-center text-neutral-500 mb-12 text-lg max-w-2xl mx-auto font-body"
            style={{
              animation: animate ? `fadeInUp 0.6s ease-out 0.3s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulario de contacto */}
          <div
            className="bg-white/80 backdrop-blur-md rounded-3xl shadow-card p-8 border border-white/50"
            style={{
              animation: animate ? `fadeInUp 0.6s ease-out 0.5s both` : 'none',
              opacity: animate ? 1 : 0
            }}
          >
            <h3 className="text-2xl font-bold text-neutral-800 mb-6 font-title">Envíanos un mensaje</h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="nombre" className="block text-sm font-bold text-neutral-700 mb-2 font-body">Nombre</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 font-body bg-white"
                    placeholder="Tu nombre completo"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-bold text-neutral-700 mb-2 font-body">Correo electrónico</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 font-body bg-white"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="asunto" className="block text-sm font-bold text-neutral-700 mb-2 font-body">Asunto</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="asunto"
                    value={asunto}
                    onChange={(e) => setAsunto(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 font-body bg-white"
                    placeholder="Asunto del mensaje"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="mensaje" className="block text-sm font-bold text-neutral-700 mb-2 font-body">Mensaje</label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <textarea
                    id="mensaje"
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    required
                    rows={5}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 font-body bg-white"
                    placeholder="Escribe tu mensaje aquí..."
                  ></textarea>
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-primary text-white rounded-full font-bold shadow-lg transition-all duration-300 flex items-center justify-center font-title hover:bg-primary-dark hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                Enviar mensaje
              </button>
            </form>
          </div>

          {/* Información de contacto */}
          <div>
            <h3
              className="text-2xl font-bold text-neutral-800 mb-6 font-title"
              style={{
                animation: animate ? `fadeInUp 0.6s ease-out 0.7s both` : 'none',
                opacity: animate ? 1 : 0
              }}
            >
              Información de contacto
            </h3>

            <div
              className="bg-white/80 backdrop-blur-md rounded-3xl shadow-card p-8 border border-white/50 mb-8"
              style={{
                animation: animate ? `fadeInUp 0.6s ease-out 0.9s both` : 'none',
                opacity: animate ? 1 : 0
              }}
            >
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-neutral-800 font-title">Dirección</h4>
                    <p className="mt-1 text-neutral-600 font-body">Anexo Andrés Avelino Cáceres 1, Piura 20001</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-neutral-800 font-title">Teléfono</h4>
                    <p className="mt-1 text-neutral-600 font-body">+51 978 704 402</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-neutral-800 font-title">Correo electrónico</h4>
                    <p className="mt-1 text-neutral-600 font-body">johandiosesrazuri@hgmail.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-neutral-800 font-title">Horario de atención</h4>
                    <p className="mt-1 text-neutral-600 font-body">Lunes a Viernes: 9:00 AM - 8:00 PM</p>
                    <p className="text-neutral-600 font-body">Sábados y Domingos: 10:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Redes sociales */}
            <div
              className="bg-white/80 backdrop-blur-md rounded-3xl shadow-card p-8 border border-white/50"
              style={{
                animation: animate ? `fadeInUp 0.6s ease-out 1.1s both` : 'none',
                opacity: animate ? 1 : 0
              }}
            >
              <h4 className="text-lg font-bold text-neutral-800 mb-4 font-title">Síguenos en redes sociales</h4>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/UTP.Peru/?locale=es_LA" className="text-neutral-600 hover:text-primary transition-colors duration-300 transform hover:scale-110">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/universidadutp?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="text-neutral-600 hover:text-primary transition-colors duration-300 transform hover:scale-110">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@universidadutp" className="text-neutral-600 hover:text-primary transition-colors duration-300 transform hover:scale-110">
                  <span className="sr-only">TikTok</span>
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.5-5.71-.04-1.16.14-2.32.57-3.4.41-1.04 1.15-1.93 2.09-2.53 1.11-.69 2.44-1.03 3.75-1.01.05 1.46-.05 2.92-.03 4.38-.87-.13-1.83-.2-2.65.2-.8.39-1.28 1.24-1.31 2.12-.02.86.35 1.74.96 2.33.66.63 1.58.97 2.49.92 1.34-.06 2.64-.68 3.42-1.79.8-1.14.88-2.59.84-3.94-.01-2.92-.01-5.84 0-8.75z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa de ubicación */}
        <div
          className="mt-16"
          style={{
            animation: animate ? `fadeInUp 0.6s ease-out 1.3s both` : 'none',
            opacity: animate ? 1 : 0
          }}
        >
          <h3 className="text-2xl font-bold text-neutral-800 mb-6 text-center font-title">Encuéntranos</h3>
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-card overflow-hidden border border-white/50">
            <div className="h-80 md:h-96 w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m12!1m8!1m3!1d127150.66014173928!2d-80.73494263270626!3d-5.190435122876108!3m2!1i1024!2i768!4f13.1!2m1!1sutp%20maps!5e0!3m2!1ses-419!2spe!4v1763280622494!5m2!1ses-419!2spe"
                className="w-full h-full"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
