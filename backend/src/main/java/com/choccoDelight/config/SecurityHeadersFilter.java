package com.choccoDelight.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityHeadersFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // X-Content-Type-Options: Previene MIME type sniffing
        response.setHeader("X-Content-Type-Options", "nosniff");
        
        // X-Frame-Options: Protege contra clickjacking
        response.setHeader("X-Frame-Options", "DENY");
        
        // X-XSS-Protection: Habilita filtro XSS en navegadores antiguos
        response.setHeader("X-XSS-Protection", "1; mode=block");
        
        // Strict-Transport-Security: Fuerza HTTPS (solo en producción)
        // Descomentado cuando uses HTTPS
        // response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        
        // Referrer-Policy: Controla información de referrer
        response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        
        // Permissions-Policy: Controla acceso a APIs del navegador
        response.setHeader("Permissions-Policy", 
            "geolocation=(self), microphone=(), camera=()");
        
        filterChain.doFilter(request, response);
    }
}
