package com.choccoDelight.controller;

import com.choccoDelight.dto.AuthResponse;
import com.choccoDelight.dto.LoginRequest;
import com.choccoDelight.dto.RegisterRequest;
import com.choccoDelight.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"})
public class AuthController {

    @org.springframework.beans.factory.annotation.Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@jakarta.validation.Valid @RequestBody LoginRequest request) {
        System.out.println("🔵 Login attempt: " + request.getEmail());
        AuthResponse response = authService.login(request);
        System.out.println("✅ Login exitoso para: " + request.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@jakarta.validation.Valid @RequestBody RegisterRequest request) {
        System.out.println("🔵 Register attempt: " + request.getEmail());
        AuthResponse response = authService.register(request);
        System.out.println("✅ Registro exitoso para: " + request.getEmail());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            return ResponseEntity.ok(authService.getCurrentUser());
        } catch (Exception e) {
            System.out.println("❌ Error obteniendo usuario actual: " + e.getMessage());
            return ResponseEntity.status(401).body(null);
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@jakarta.validation.Valid @RequestBody com.choccoDelight.dto.RefreshTokenRequest request) {
        System.out.println("🔵 Refresh token attempt");
        AuthResponse response = authService.refreshToken(request.getRefreshToken());
        System.out.println("✅ Refresh token exitoso");
        return ResponseEntity.ok(response);
    }
}