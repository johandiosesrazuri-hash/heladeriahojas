package com.choccoDelight.controller;

import com.choccoDelight.dto.AuthResponse;
import com.choccoDelight.dto.LoginRequest;
import com.choccoDelight.dto.RegisterRequest;
import com.choccoDelight.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @org.springframework.beans.factory.annotation.Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        return ResponseEntity.ok(authService.getCurrentUser());
    }
}