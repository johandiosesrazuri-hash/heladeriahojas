package com.choccoDelight.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtRequestFilter jwtRequestFilter;
    private final com.choccoDelight.config.SecurityHeadersFilter securityHeadersFilter;

    public SecurityConfig(CustomUserDetailsService userDetailsService, 
                         JwtRequestFilter jwtRequestFilter,
                         com.choccoDelight.config.SecurityHeadersFilter securityHeadersFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtRequestFilter = jwtRequestFilter;
        this.securityHeadersFilter = securityHeadersFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // DESHABILITAR CSRF
                .csrf(csrf -> csrf.disable())

                // CONFIGURAR CORS PRIMERO
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .authorizeHttpRequests(auth -> auth
                        // Preflight CORS sin autenticación
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // PERMITIR /api/auth/** SIN AUTENTICACIÓN
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/auth/register").permitAll()
                        .requestMatchers("/api/auth/forgot-password").permitAll()
                        .requestMatchers("/api/auth/validate-token").permitAll()
                        .requestMatchers("/api/auth/reset-password").permitAll()
                        .requestMatchers("/api/perfil").permitAll()

                        // PERMITIR PRODUCTOS Y PROMOCIONES
                        .requestMatchers(HttpMethod.GET, "/api/productos").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/promociones").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/promociones/**").permitAll()

                        // PERMITIR CONTACTO Y INFO
                        .requestMatchers(HttpMethod.POST, "/api/contacto").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/contacto/**").permitAll()
                        .requestMatchers("/api/sobre-nosotros/**").permitAll()
                        .requestMatchers("/img/**").permitAll()

                        // TESTIMONIOS
                        .requestMatchers(HttpMethod.GET, "/api/testimonios").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/testimonios").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/testimonios/**").authenticated()

                        // ADMIN SOLO
                        .requestMatchers("/api/admin/**").authenticated()

                        // USUARIO AUTENTICADO
                        .requestMatchers("/api/pedidos/**").permitAll()
                        .requestMatchers("/api/delivery/**").authenticated()
                        .requestMatchers("/api/usuarios/**").authenticated()

                        .anyRequest().authenticated())

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authenticationProvider(authenticationProvider())

                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(securityHeadersFilter, JwtRequestFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173"));

        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"));

        configuration.setAllowedHeaders(Arrays.asList(
                "Content-Type",
                "Authorization",
                "X-Requested-With",
                "Accept",
                "Origin"));

        configuration.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type"));

        configuration.setAllowCredentials(true);

        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
