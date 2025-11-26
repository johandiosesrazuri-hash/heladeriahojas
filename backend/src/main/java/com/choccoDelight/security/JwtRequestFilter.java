package com.choccoDelight.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String authorizationHeader = request.getHeader("Authorization");
        String requestURI = request.getRequestURI();
        String method = request.getMethod();

        System.out.println("🔐 JWT Filter - " + method + " " + requestURI);

        String username = null;
        String jwt = null;
        // 1. Extraer token del header "Authorization: Bearer {token}"
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7); // Extrae el token
            try {
                username = jwtTokenUtil.extractUsername(jwt); // Extrae el nombre de usuario del token
                System.out.println("✅ Token válido para usuario: " + username);
            } catch (Exception e) {
                System.out.println("❌ Error extrayendo username del token: " + e.getMessage());
            }
        } else {
            System.out.println("⚠️ No se encontró token Bearer en el header Authorization");
        }

        // 2. Validar token y establecer autenticación
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            System.out.println("👤 Usuario cargado: " + username);
            System.out.println("🔑 Authorities: " + userDetails.getAuthorities());

            // 3. Verificar si el token es válido
            if (jwtTokenUtil.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("✅ Autenticación establecida para: " + username + " con roles: "
                        + userDetails.getAuthorities());
            } else {
                System.out.println("❌ Token inválido para usuario: " + username);
            }
        }

        chain.doFilter(request, response); // Continúa con el filtro
    }
}
