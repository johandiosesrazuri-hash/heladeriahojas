package com.choccoDelight.config;

import com.choccoDelight.entity.Producto;
import com.choccoDelight.entity.Usuario;
import com.choccoDelight.repository.ProductoRepository;
import com.choccoDelight.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.Arrays;

@Configuration
public class DevDataLoader implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private Environment env;

    @Override
    public void run(String... args) throws Exception {
        // Solo cargar datos si la propiedad app.load-sample-data=true
        String load = env.getProperty("app.load-sample-data", "false");
        if (!Boolean.parseBoolean(load)) return;

        if (usuarioRepository.existsByEmail("admin@local")) {
            return; // ya cargado
        }

        Usuario admin = new Usuario();
        admin.setNombre("Admin Local");
        admin.setEmail("admin@local");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRol(Usuario.Role.ADMIN);
        usuarioRepository.save(admin);

        Usuario cliente = new Usuario();
        cliente.setNombre("Cliente Local");
        cliente.setEmail("cliente@local");
        cliente.setPassword(passwordEncoder.encode("cliente123"));
        cliente.setRol(Usuario.Role.USER);
        usuarioRepository.save(cliente);

        Producto p1 = new Producto();
        p1.setNombre("Helado Vainilla");
        p1.setDescripcion("Vainilla clásica");
        p1.setPrecio(new BigDecimal("120.00"));
        p1.setImagen("");

        Producto p2 = new Producto();
        p2.setNombre("Helado Chocolate");
        p2.setDescripcion("Chocolate oscuro");
        p2.setPrecio(new BigDecimal("140.00"));
        p2.setImagen("");

        productoRepository.saveAll(Arrays.asList(p1, p2));

        System.out.println("[DevDataLoader] Datos de prueba cargados: admin@local/admin123 cliente@local/cliente123");
    }
}
