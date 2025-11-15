package com.choccoDelight.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.choccoDelight.dto.TestimonioDTO;
import com.choccoDelight.entity.Testimonio;
import com.choccoDelight.entity.Usuario;
import com.choccoDelight.repository.TestimonioRepository;
import com.choccoDelight.repository.UsuarioRepository;

import java.util.List;
import java.util.Optional;

@Service
public class TestimonioService {

    @Autowired
    private TestimonioRepository testimonioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Método para guardar un testimonio usando TestimonioDTO
    public Testimonio guardarTestimonio(TestimonioDTO testimonioDTO) {
    // Verificar si el usuario existe
    Optional<Usuario> usuario = usuarioRepository.findById(testimonioDTO.getUsuarioId());
if (usuario.isPresent()) {
    Testimonio testimonio = new Testimonio();
    testimonio.setUsuario(usuario.get());  // Asocia el usuario encontrado
    testimonio.setMensaje(testimonioDTO.getMensaje());
    testimonio.setFecha(new java.util.Date());  // Establecer la fecha actual
    testimonio.setCalificacion(testimonioDTO.getCalificacion());  // Establecer la calificación
    return testimonioRepository.save(testimonio);  // Guardar el testimonio con el usuario
} else {
    throw new RuntimeException("Usuario no encontrado");
}

}




    // Método para obtener todos los testimonios
    public List<Testimonio> obtenerTodosLosTestimonios() {
        return testimonioRepository.findAll();  // Asegúrate de que el repositorio esté devolviendo los datos
    }

    // Método para obtener un testimonio por ID
    public Testimonio obtenerTestimonioPorId(Long id) {
    return testimonioRepository.findById(id).orElse(null);  // Esto debe devolver el testimonio si existe
}

    // Método para eliminar un testimonio por ID
    public void eliminarTestimonio(Long id) {
        testimonioRepository.deleteById(id);
    }
}
