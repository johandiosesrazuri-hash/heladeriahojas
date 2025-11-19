package com.choccoDelight.controller;

import com.choccoDelight.dto.SobreNosotrosDTO;
import com.choccoDelight.entity.*;
import com.choccoDelight.service.SobreNosotrosService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sobre-nosotros")
@CrossOrigin(origins = "http://localhost:5173")
public class SobreNosotrosController {

    private final SobreNosotrosService service;

    public SobreNosotrosController(SobreNosotrosService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<SobreNosotrosDTO> obtenerInformacion() {
        return ResponseEntity.ok(service.obtenerInformacionCompleta());
    }

    /* ENDPOINTS ADMINISTRATIVOS */

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/informacion/{id}")
    public ResponseEntity<SobreNosotros> actualizarInformacion(
            @PathVariable Long id,
            @RequestBody SobreNosotros datos) {
        return ResponseEntity.ok(service.actualizarInformacion(id, datos));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/valores")
    public ResponseEntity<ValorEmpresa> crearValor(@RequestBody ValorEmpresa valor) {
        return ResponseEntity.ok(service.crearValor(valor));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/valores/{id}")
    public ResponseEntity<Void> eliminarValor(@PathVariable Long id) {
        service.eliminarValor(id);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/estadisticas")
    public ResponseEntity<EstadisticaEmpresa> crearEstadistica(
            @RequestBody EstadisticaEmpresa estadistica) {
        return ResponseEntity.ok(service.crearEstadistica(estadistica));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/estadisticas/{id}")
    public ResponseEntity<Void> eliminarEstadistica(@PathVariable Long id) {
        service.eliminarEstadistica(id);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/galeria")
    public ResponseEntity<GaleriaEmpresa> crearImagenGaleria(
            @RequestBody GaleriaEmpresa imagen) {
        return ResponseEntity.ok(service.crearImagenGaleria(imagen));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/galeria/{id}")
    public ResponseEntity<Void> eliminarImagenGaleria(@PathVariable Long id) {
        service.eliminarImagenGaleria(id);
        return ResponseEntity.ok().build();
    }
}