import React, { useState } from "react";
import axios from "axios";
import "../styles/Contacto.css";

const Contacto = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mensajeEstado, setMensajeEstado] = useState(""); // Estado para manejar los mensajes de éxito o error

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Restablecer cualquier mensaje anterior
    setMensajeEstado("");

    try {
      const response = await axios.post("http://localhost:8080/api/contacto", {
        nombre: nombre,
        email: email,
        asunto: asunto,
        mensaje: mensaje,
      });

      // Actualizar el mensaje de éxito
      setMensajeEstado("Mensaje enviado con éxito!");

      // Reiniciar los campos del formulario
      setNombre("");
      setEmail("");
      setAsunto("");
      setMensaje("");
    } catch (error) {
      // Actualizar el mensaje de error en caso de fallo
      setMensajeEstado("Hubo un error al enviar el mensaje. Intenta nuevamente.");
      console.error("Error al enviar el mensaje", error);
    }
  };

  return (
    <div className="contacto-container">
      <h2>Contáctanos</h2>

      {/* Mostrar el mensaje de éxito o error */}
      {mensajeEstado && (
        <div className="alerta">
          {mensajeEstado}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="asunto">Asunto:</label>
          <input
            type="text"
            id="asunto"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="mensaje">Mensaje:</label>
          <textarea
            id="mensaje"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
          />
        </div>

        <button type="submit">Enviar mensaje</button>
      </form>
    </div>
  );
};

export default Contacto;
