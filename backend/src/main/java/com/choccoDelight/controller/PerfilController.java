package com.choccoDelight.controller;

import com.choccoDelight.dto.PerfilDTO;
import com.choccoDelight.entity.Direccion;
import com.choccoDelight.entity.Testimonio;
import com.choccoDelight.entity.Usuario;
import com.choccoDelight.service.PerfilService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/perfil")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("isAuthenticated()")
public class PerfilController {

    private final PerfilService perfilService;

    public PerfilController(PerfilService perfilService) {
        this.perfilService = perfilService;
    }

    @GetMapping
    public ResponseEntity<PerfilDTO> obtenerPerfil(@AuthenticationPrincipal UserDetails userDetails) {
        PerfilDTO perfil = perfilService.obtenerPerfil(userDetails.getUsername());
        return ResponseEntity.ok(perfil);
    }

    @PutMapping
    public ResponseEntity<Usuario> actualizarPerfil(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Usuario datos) {
        return ResponseEntity.ok(perfilService.actualizarPerfil(userDetails.getUsername(), datos));
    }

    @PutMapping("/password")
    public ResponseEntity<?> cambiarPassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody PasswordRequest body) {
        perfilService.cambiarPassword(userDetails.getUsername(), body.getPasswordActual(), body.getNuevaPassword());
        return ResponseEntity.ok().build();
    }

    // Direcciones
    @PostMapping("/direcciones")
    public ResponseEntity<Direccion> crearDireccion(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Direccion dir) {
        return ResponseEntity.ok(perfilService.crearDireccion(userDetails.getUsername(), dir));
    }

    @PutMapping("/direcciones/{id}")
    public ResponseEntity<Direccion> actualizarDireccion(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody Direccion dir) {
        return ResponseEntity.ok(perfilService.actualizarDireccion(userDetails.getUsername(), id, dir));
    }

    @DeleteMapping("/direcciones/{id}")
    public ResponseEntity<Void> eliminarDireccion(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        perfilService.eliminarDireccion(userDetails.getUsername(), id);
        return ResponseEntity.ok().build();
    }

    // Testimonios del usuario
    @PostMapping("/testimonios")
    public ResponseEntity<Testimonio> crearTestimonio(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Testimonio testimonio) {
        return ResponseEntity.ok(perfilService.crearTestimonio(userDetails.getUsername(), testimonio));
    }

    @PutMapping("/testimonios/{id}")
    public ResponseEntity<Testimonio> actualizarTestimonio(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody Testimonio testimonio) {
        return ResponseEntity.ok(perfilService.actualizarTestimonio(userDetails.getUsername(), id, testimonio));
    }

    @DeleteMapping("/testimonios/{id}")
    public ResponseEntity<Void> eliminarTestimonio(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        perfilService.eliminarTestimonio(userDetails.getUsername(), id);
        return ResponseEntity.ok().build();
    }

    public static class PasswordRequest {
        private String passwordActual;
        private String nuevaPassword;
        public String getPasswordActual() { return passwordActual; }
        public void setPasswordActual(String passwordActual) { this.passwordActual = passwordActual; }
        public String getNuevaPassword() { return nuevaPassword; }
        public void setNuevaPassword(String nuevaPassword) { this.nuevaPassword = nuevaPassword; }
    }
}
