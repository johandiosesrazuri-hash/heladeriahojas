package com.choccoDelight.controller;

import com.choccoDelight.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173" })
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El email es obligatorio"));
        }
        try {
            String token = passwordResetService.createPasswordResetTokenForUser(email);
            
            // En desarrollo, también retornar el link en la respuesta (SOLO PARA DESARROLLO)
            if (token != null) {
                String resetLink = "http://localhost:5173/reset-password?token=" + token;
                System.out.println("━".repeat(80));
                System.out.println("🔗 LINK DE RECUPERACIÓN GENERADO:");
                System.out.println("   " + resetLink);
                System.out.println("━".repeat(80));
                
                // TEMPORAL: incluir el token en la respuesta para desarrollo
                return ResponseEntity.ok(Map.of(
                    "message", "Si el email existe, se ha enviado un enlace de recuperación.",
                    "devToken", token,
                    "devLink", resetLink
                ));
            }
            
            return ResponseEntity.ok(Map.of("message", "Si el email existe, se ha enviado un enlace de recuperación."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error interno: " + e.getMessage()));
        }
    }

    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestParam("token") String token) {
        boolean isValid = passwordResetService.validatePasswordResetToken(token);
        if (isValid) {
            return ResponseEntity.ok(Map.of("valid", true));
        } else {
            return ResponseEntity.badRequest().body(Map.of("valid", false, "error", "Token inválido o expirado"));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token y nueva contraseña son obligatorios"));
        }
        if (newPassword.length() < 8) {
            return ResponseEntity.badRequest().body(Map.of("error", "La contraseña debe tener al menos 8 caracteres"));
        }
        passwordResetService.resetPassword(token, newPassword);
        return ResponseEntity.ok(Map.of("message", "Contraseña restablecida con éxito"));
    }
}
