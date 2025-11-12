package com.choccoDelight.service;

import com.choccoDelight.dto.AuthResponse;
import com.choccoDelight.dto.LoginRequest;
import com.choccoDelight.dto.RegisterRequest;
import com.choccoDelight.entity.Usuario;
import com.choccoDelight.repository.UsuarioRepository;
import com.choccoDelight.security.JwtTokenUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @org.springframework.beans.factory.annotation.Autowired
    private UsuarioRepository usuarioRepository;

    @org.springframework.beans.factory.annotation.Autowired
    private PasswordEncoder passwordEncoder;

    @org.springframework.beans.factory.annotation.Autowired
    private JwtTokenUtil jwtTokenUtil;

    @org.springframework.beans.factory.annotation.Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    String token = jwtTokenUtil.generateToken(usuario);

    AuthResponse resp = new AuthResponse();
    resp.setToken(token);
    resp.setEmail(usuario.getEmail());
    resp.setNombre(usuario.getNombre());
    resp.setRol(usuario.getRol().name());
    return resp;
    }

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

    Usuario usuario = new Usuario();
    usuario.setNombre(request.getNombre());
    usuario.setEmail(request.getEmail());
    usuario.setPassword(passwordEncoder.encode(request.getPassword()));
    usuario.setRol(Usuario.Role.USER);

    usuarioRepository.save(usuario);

    String token = jwtTokenUtil.generateToken(usuario);

    AuthResponse resp = new AuthResponse();
    resp.setToken(token);
    resp.setEmail(usuario.getEmail());
    resp.setNombre(usuario.getNombre());
    // Devolvemos el role con prefijo ROLE_ para mantener compatibilidad con Spring Security
    resp.setRol("ROLE_" + usuario.getRol().name());
    return resp;
    }

    public Usuario getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}