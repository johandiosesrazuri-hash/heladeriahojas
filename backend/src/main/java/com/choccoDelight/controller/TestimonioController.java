package com.choccoDelight.controller;

import com.choccoDelight.dto.TestimonioDTO;
import com.choccoDelight.entity.Testimonio;
import com.choccoDelight.service.TestimonioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/testimonios")
public class TestimonioController {

    @Autowired
    private TestimonioService testimonioService;

    // Obtener todos los testimonios
    @GetMapping
    public ResponseEntity<List<Testimonio>> obtenerTodosTestimonios() {
        List<Testimonio> testimonios = testimonioService.obtenerTodosLosTestimonios();
        if (testimonios.isEmpty()) {
            return ResponseEntity.noContent().build();  // No hay testimonios
        }
        return ResponseEntity.ok(testimonios);
    }

    // Obtener testimonio por ID
    @GetMapping("/{id}")
public ResponseEntity<Testimonio> obtenerTestimonioPorId(@PathVariable Long id) {
    Testimonio testimonio = testimonioService.obtenerTestimonioPorId(id);
    if (testimonio != null) {
        return ResponseEntity.ok(testimonio);
    } else {
        return ResponseEntity.status(404).body(null);
    }
}
    @PostMapping
    public ResponseEntity<Testimonio> guardarTestimonio(@RequestBody TestimonioDTO testimonioDTO) {
        try {
            Testimonio testimonioGuardado = testimonioService.guardarTestimonio(testimonioDTO);
            return ResponseEntity.ok(testimonioGuardado);
        } catch (RuntimeException e) {
            // En caso de error, devolver un error 404 si no se encuentra el usuario
            return ResponseEntity.status(404).body(null);
        }
    }

}
