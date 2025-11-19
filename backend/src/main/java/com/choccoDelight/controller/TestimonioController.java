package com.choccoDelight.controller;

import com.choccoDelight.dto.TestimonioRequest;
import com.choccoDelight.entity.Testimonio;
import com.choccoDelight.service.TestimonioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/testimonios")
@CrossOrigin(origins = "http://localhost:5173")
public class TestimonioController {

    @Autowired
    private TestimonioService testimonioService;

    @GetMapping
    public ResponseEntity<List<Testimonio>> listarTodos() {
        return ResponseEntity.ok(testimonioService.listarTodos());
    }

    @GetMapping("/usuario/{usuarioId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Testimonio> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return testimonioService.obtenerPorUsuario(usuarioId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> crearTestimonio(@RequestBody TestimonioRequest request) {
        try {
            Testimonio testimonio = testimonioService.crearTestimonio(
                    request.getUsuarioId(),
                    request.getCalificacion(),
                    request.getComentario()
            );
            return ResponseEntity.ok(testimonio);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}