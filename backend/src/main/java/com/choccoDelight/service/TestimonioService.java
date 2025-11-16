package com.choccoDelight.service;

import com.choccoDelight.entity.Testimonio;
import com.choccoDelight.entity.Usuario;
import com.choccoDelight.repository.TestimonioRepository;
import com.choccoDelight.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TestimonioService {

    @Autowired
    private TestimonioRepository testimonioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public Testimonio crearTestimonio(Long usuarioId, Integer calificacion, String comentario) {
        // Validar usuario
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Validar calificación
        if (calificacion < 1 || calificacion > 5) {
            throw new RuntimeException("La calificación debe estar entre 1 y 5");
        }

        // Validar que no tenga testimonio previo (opcional)
        Optional<Testimonio> existente = testimonioRepository.findByUsuarioId(usuarioId);
        if (existente.isPresent()) {
            throw new RuntimeException("Ya has dejado un testimonio anteriormente");
        }

        // Crear nuevo testimonio
        Testimonio testimonio = new Testimonio();
        testimonio.setUsuario(usuario);
        testimonio.setCalificacion(calificacion);
        testimonio.setComentario(comentario);

        return testimonioRepository.save(testimonio);
    }

    public List<Testimonio> listarTodos() {
        return testimonioRepository.findAll();
    }

    public List<Testimonio> listarPorUsuario(Long usuarioId) {
        return testimonioRepository.findByUsuarioIdOrderByFechaDesc(usuarioId);
    }

    public Optional<Testimonio> obtenerPorUsuario(Long usuarioId) {
        return testimonioRepository.findByUsuarioId(usuarioId);
    }
}